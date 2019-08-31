import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";
import {NotebookPage, NotebookPageModel} from "../../model/notebookPage";
import {Grid, Link, Paper} from "@material-ui/core";
import {RadarChart} from "./radar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {RankStar} from "./rankStar";

/** 評価パネル */
interface OwnProps {
    pages: NotebookPage[]
    showRank?: boolean
    showNext?: boolean
    onClickNext?: () => void
    disabled?: boolean
    showNote?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
        root: {
            textAlign: "left"
        },
        page: {
            margin: theme.spacing(1.0),
            border: "2px solid #fa3",
            borderRadius: "5px",
            overflow: "hidden"
        },
        newEvaluate: {
            background: "#fff",
            border: "solid 1px #ccc",
            borderRadius: "5px",
            margin: theme.spacing(1.5),
            padding: theme.spacing(1.0),
            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
            textAlign: "center"
        },
        newEvaluateImage: {
            borderRadius: "5px",
            padding: theme.spacing(2.0),
        },
        pageTitle: {
            padding: theme.spacing(1),
            fontWeight: 900,
            position: "relative",
            fontSize: "1.0em",
            background: "#fa3",
            color: "#fff"
        },
        pageImage: {
            zIndex: 1,
            position: "relative",
            width: "50%",
            height: "150px",
            overflow: "hidden",
            '& img': {
                textAlign: "center",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                zIndex: -1,
            }
        },
        noImage: {
            zIndex: 1,
            position: "relative",
            width: "50%",
            height: "150px",
        },
        noImageIcon: {
            position: "absolute",
            top: "-20%",
            right: "-28%",
            fontSize: 210,
            transform: "rotate(45deg)",
            opacity: 0.2,
            color: "#fa3"
        },
        imageContainer: {
            position: "relative"
        },
        pageEvaluate: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            width: "50%",
            position: "relative",
            overflow: "hidden",
        },
        pageDescription: {
            margin: theme.spacing(1),
            '& p' : {
                margin: 0
            }
        },
        pageRank: {
            position: "absolute",
            bottom: -theme.spacing(3),
            right: -theme.spacing(0.5),
            zIndex: 2,
        },
        info: {
            marginLeft: theme.spacing(1.5),
            marginRight: theme.spacing(1.5),
            borderTop: "solid 1px #ccc",
            padding: theme.spacing(1),
            fontSize: "1.0em"
        },
        author: {
            padding: theme.spacing(1),
        },
        pageContent: {
            color: "rgba(0,0,0,0.87)",
            paddingBottom: theme.spacing(0.5),
        },
        nextButton: {
            width: "100%",
            textAlign: "center",
        },
        evaluate: {},
        like: {
            marginRight: theme.spacing(2),
        },
        likes: {
            color: "#f66",
            marginRight: theme.spacing(2),
        },
        chart: {
            color: "#f82",
            stroke: "#f82",
            marginRight: theme.spacing(2),
        },
        comment: {
            color: "#669"
        },
        note: {},
        chip: {
            [theme.breakpoints.down('sm')]: {
                display: "none"
            }
        },
    }
));

export const PagePanels: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    function showPage(page: NotebookPage, key: number) {
        const model = new NotebookPageModel(page);

        var image = () => {
            if (model.hasImage()) {
                return (
                    <Grid item className={classes.pageImage}>
                        <img src={model.image()}/>
                    </Grid>
                )
            }
            return (
                <Grid item className={classes.noImage}>
                    <FontAwesomeIcon className={classes.noImageIcon} icon={['fas', 'star']}/>
                </Grid>
            )
        }

        var rank = () => {
            if (props.showRank) {
                return (
                    <RankStar num={key + 1} className={classes.pageRank} title={page.title + "のランキング：" + (key + 1) + "位"}/>
                )
            }
        }

        function like() {
            if(!page.isLike) {
                return (
                    <span className={classes.like}>
                        <FontAwesomeIcon icon={['far', 'heart']}/>&nbsp;
                        {page.likes}
                    </span>
                );
            }
            return (
                <span className={classes.likes}>
                        <FontAwesomeIcon icon={['fas', 'heart']}/>&nbsp;
                    {page.likes}
                </span>
            );
        }

        function showNote() {
            if(props.showNote) {
                return (
                    <Grid container direction="row" wrap="nowrap" justify="flex-start" spacing={3} alignItems="center">
                        <Grid item className={classes.note}>
                        <Link href={model.getNoteUrl()}><FontAwesomeIcon icon={['fas', 'file-alt']}/>&nbsp;{page.notebook.title}</Link>
                        </Grid>
                    </Grid>
                )
            }
        }

        return (
            <div key={page.id} className={classes.page}>
                    <Paper>
                        <div className={classes.pageTitle}>
                            {page.title}
                            {rank()}
                        </div>
                        <Link underline="none" href={model.getUrl("")} >
                            <div className={classes.pageContent}>
                                <Grid container className={classes.imageContainer} direction="row" wrap="nowrap" justify="flex-start" alignItems="center">
                                    <Grid item className={classes.pageEvaluate}>
                                        <div className={classes.evaluate}>
                                            <RadarChart datas={model.asSummaryData()} average={model.average()}></RadarChart>
                                        </div>
                                    </Grid>
                                    {image()}
                                </Grid>
                                <div className={classes.pageDescription}>
                                    {model.descriptionText(140)}
                                </div>
                            </div>
                        </Link>
                        <div className={classes.info}>
                            {showNote()}
                            <Grid container direction="row" justify="space-between" spacing={3} alignItems="center">
                                <Grid item>
                                    {like()}
                                    <span className={classes.chart}>
                                    <img src="/static/images/radar.svg" color="#ccc" width={14} height={14}/>
                                    &nbsp;
                                    {page.chartCounts}&nbsp;
                                    </span>
                                    <span className={classes.comment}>
                                    <FontAwesomeIcon icon={['far', 'comment']}/>
                                    &nbsp;
                                    {page.commentCounts}
                                    </span>
                                </Grid>
                                <Grid item>
                                    {model.author().chip(true, false , classes.chip)}&nbsp;
                                    {model.dateString()}
                                </Grid>
                            </Grid>
                        </div>
                    </Paper>
            </div>
        )
    }

    function showNextButton() {
        if(props.showNext) {
            return (
                <Button disabled={props.disabled} className={classes.nextButton} onClick={props.onClickNext}>更に読み込む</Button>
            )
        }
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
            {props.pages.map(showPage)}
            {showNextButton()}
            </div>
        </React.Fragment>
    );
}
