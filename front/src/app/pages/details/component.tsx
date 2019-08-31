import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import EditIcon from '@material-ui/icons/Edit'
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import MenuItem from "../../common/menuitem";
import HomeIcon from '@material-ui/icons/Home'
import FeedbackIcon from '@material-ui/icons/Feedback'
import {
    Container,
    Grid,
    Paper,
    Button,
    Link,
    Breadcrumbs,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent, DialogContentText, DialogActions, useMediaQuery
} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import {Actions} from "./container";
import {NotebookPageDetailState} from "./state";
import {NotebookPageModel} from "../../../model/notebookPage";
import {RadarChart} from "../../common/radar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {rotate, scale} from 'react-imation/tween-value-factories';
import {Timeline} from 'react-imation/timeline';
import CommentEditor from '../commentEdit/container'
import {NotebookComment, NotebookCommentModel} from "../../../model/notebookComment";
import {Permission} from "../../../model/permission";
import {ShareLink} from "../../common/sharelink";
import Rating, { IconContainerProps } from '@material-ui/lab/Rating';
import {LogoPanel} from "../../common/logoPanel";
import {Title} from "../../common/title";
import {FetchError} from "../../../client/fetch";
import {SyntheticEvent} from "react";
import {Notice} from "../../common/notice";
import {LazyLoader} from "../../common/lazyLoader";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: 0
        },
        container: {
        },
        button: {
            width: "90%",
            color: "white",
            margin: theme.spacing(1),
        },
        otherButton: {
            width: "90%",
            margin: theme.spacing(1),
        },
        favButton: {
            margin: theme.spacing(1),
        },
        favButtonLike: {
            margin: theme.spacing(1),
            color: "#f45"
        },
        editButton: {
            color: "#fff",
        },
        descriptionArea: {
            margin: theme.spacing(1),
        },
        description: {
            background:"#ffaa55",
            borderRadius: "5px",
            padding: theme.spacing(1),
        },
        round: {
            borderRadius: "5px",
            background: "#fff",
            margin: theme.spacing(1),
            padding: theme.spacing(1),
        },
        imageDiv: {
            textAlign: "center",
        },
        image : {
            maxWidth: "90%",
            maxHeight: "400px",
            border: "solid 1px #ccc",
            background: "#fff",
            boxShadow: "0 0 5px #777",
        },
        share: {
            margin: theme.spacing(1.5),
        },
        gridRoot: {
        },
        hr: {
            width: "90%",
            border: "none",
            borderBottom: "2px dashed #ccc"
        },
        commentAuthor: {
            padding: theme.spacing(1.0)
        },
        breadcrumbs : {
            marginLeft: theme.spacing(1),
            marginBottom: theme.spacing(1)
        },
        reaction : {
            fontSize: "1.2em"
        },
        authorInfo : {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        comment: {
            paddingTop: "1px",
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(2.0),
        },
        padding: {
            padding: theme.spacing(1),
            paddingTop: theme.spacing(0.5),

        },
        radar: {
            margin: theme.spacing(1),
            padding: theme.spacing(1),
            borderRadius: "5px",
            border: "solid 1px #ddd"
        },
        evaluateOk: {
            borderRadius: "5px",
            background: "#f53",
            color: "#fff",
            padding: theme.spacing(0.5),
            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
        },
        noComments: {
            margin: theme.spacing(1),
            padding: theme.spacing(1),
            textAlign: "center"
        },
        commentRate: {
            margin: theme.spacing(1.5),
            paddingLeft: theme.spacing(2.0),
            paddingRight: theme.spacing(2.0),
            paddingTop: theme.spacing(1.5),
            textAlign: "center"
        },
        delete: {
            color: "#f63",
        },
        confirm : {
            color: "#f00",
        },
        notice: {
            margin: theme.spacing(1.5),
        },
        nextButton: {
            width: "100%",
            textAlign: "center",
        }
    }),
);

interface Props {}
interface test {
    tween: any ,time: any, playing: any, togglePlay: any, setTime: any
}

type OwnProps = Props & Actions & NotebookPageDetailState;

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const pageModel = new NotebookPageModel(props.page);
    const small = useMediaQuery(theme.breakpoints.down('sm'));
    const permission = new Permission(props.page);
    const [disable, setDisableButton] = React.useState(false);

    function like() {
        props.like(pageModel);
    }
    
    function addComment() {
        props.showComment(props.page);
    }

    function addEvaluate() {
        props.showEvaluate(props.page);
    }

    function renderComment(elem: NotebookComment, key: number) {
        const model = new NotebookCommentModel(elem, props.page);
        const renderDelete = () => {
            if (permission.isOwner()) {
                return (
                    <IconButton size="small" className={classes.delete} onClick={()=> {
                        props.setDeleteComment(elem);
                    }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )
            }
        }
        if (model.hasBoth()) {
            return (
                <Paper key={"comment-" + elem.postId + "-" + key} className={classes.comment}>
                    <div className={classes.commentRate}>
                        <RadarChart datas={model.items()} average={model.average()} width={200} height={125} responsive={false}></RadarChart>
                    </div>
                    <Grid container className={classes.gridRoot} direction="row" wrap="nowrap" justify="flex-start" alignItems="center">
                        <Grid item xs={12} className={classes.padding}>
                            {model.comments()}
                        </Grid>
                    </Grid>
                    <hr className={classes.hr}/>
                    <Grid container className={classes.commentAuthor} direction="row" wrap="nowrap" justify="space-between" alignItems="center">
                        <Grid item>
                            {model.author().chip(true)}
                        </Grid>
                        <Grid item>
                            {model.dateString()}
                            {renderDelete()}
                        </Grid>
                    </Grid>
                </Paper>
                )
        }

        if (model.hasComment()) {
            return (
                <Paper key={"comment-" + elem.postId + "-" + key} className={classes.comment}>
                    <Grid container className={classes.gridRoot} direction="row" wrap="nowrap" justify="flex-start" alignItems="center">
                        <Grid item xs={12} className={classes.padding}>
                            {model.comments()}
                        </Grid>
                    </Grid>
                    <hr className={classes.hr}/>
                    <Grid container className={classes.commentAuthor} direction="row" wrap="nowrap" justify="space-between" alignItems="center">
                        <Grid item>
                            {model.author().chip(true)}
                        </Grid>
                        <Grid item>
                            {model.dateString()}
                            {renderDelete()}
                        </Grid>
                    </Grid>
                </Paper>
            )
        }

    }

    function showNextButton() {
        if(props.hasMoreItems) {
            return (
                <Button className={classes.nextButton} onClick={loadMore}>更に読み込む</Button>
            )
        }
    }

    function comments() {
        if (props.hasMoreItems === false && props.page.commentCounts === 0) {
            return (
                <div className={classes.noComments}>コメントはありません</div>
            )
        }
        return (
            <React.Fragment>
                {props.comments.map(renderComment)}
                {showNextButton()}
            </React.Fragment>
        )
    }

    function loadMore() {
        props.loadNext(props.nextCursor, pageModel);
    }

    function accountLink() {
        if(permission.isOwner()) {
            return (
                <Link href={"/home"}>ホーム</Link>
            )
        }
        return (<Link href={"/" + props.page.notebook.account.id }>{props.page.notebook.account.name}</Link>);
    }

    function image() {
        if(props.page.image) {
            return (
                <div className={classes.imageDiv}>
                    <img src={pageModel.image()} className={classes.image}/>
                </div>
            )
        }
    }

    function showCommentButton() {
        if(permission.hasCommentPermission()) {
            return (
            <Button color="primary" variant="contained" className={classes.button} onClick={addComment}>
                <FontAwesomeIcon icon={['far', 'comment']}/>
                &nbsp;コメントを書く
            </Button>
            );
        }
    }

    function showEdit() {
        if(permission.hasEditPermission()) {
            return <Button href={pageModel.getUrl("/edit")} color="primary" className={classes.editButton} aria-label="Edit">|<EditIcon/>&nbsp;編集</Button>
        }
    }

    function showEvaluateButton() {
        if(pageModel.isPublic() === false) {
            return;
        }
        if(permission.hasChartPermission()) {
            if (permission.isAuthor()) {
                return (
                    <div style={{textAlign: "center"}}>
                        <Button color="secondary" variant="contained" className={classes.button} href={pageModel.getUrl("/edit")}>
                            評価を受付中
                        </Button>
                    </div>
                )
            }
            return (
                <div style={{textAlign: "center"}}>
                    <Button color="secondary" variant="contained" className={classes.button} onClick={addEvaluate}>
                        評価を受付中
                    </Button>
                </div>
            )
        }
    }

    function showLikeIcon() {
        if(props.page.isLike) {
            return (
                <Button size="large" className={classes.favButtonLike} onClick={like}>
                    <FontAwesomeIcon icon={['fas', 'heart']}/>
                    {props.page.likes}
                </Button>
            );
        }
        return (
            <Button size="large" className={classes.favButton} onClick={like}>
                <FontAwesomeIcon icon={['far', 'heart']}/>
                {props.page.likes}
            </Button>
        )
    }

    function deleteComment() {
        if(!props.deleteConfirm) {
            props.setDeleteComment(null);
            return;
        }
        setDisableButton(true);
        const model = new NotebookCommentModel(props.deleteConfirm, props.page);
        props.executeDelete(model, (error: FetchError) => {
            setDisableButton(false);
            props.setDeleteComment(null);
        });
    }

    function closeConfirm(event?: SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        if (disable === false) {
            props.setDeleteComment(null);
        }
    }

    function privateIcon() {
        if (pageModel.isPublic() === false) {
            return (
                <FontAwesomeIcon icon={['fas' , 'user-lock']}/>
            )
        }
    }

    function showSharePanel() {
        if (pageModel.isPublic()) {
            return (
                <ShareLink className={classes.share} title="このページを共有" path={pageModel.getUrl("")} shareText={props.page.title + "の評価は【" + pageModel.average() + "】です。"}/>
            );
        }
        return (
            <Notice className={classes.notice}>
                現在非公開設定となっているためこのページは公開されません。
            </Notice>
        )
    }

    function showComment() {
        return (
            <React.Fragment>
                <Title>
                    コメント
                </Title>
                <LazyLoader once onLoad={()=>{loadMore()}}>
                    {comments()}
                </LazyLoader>
                <div style={{textAlign: "center"}}>
                    {showCommentButton()}
                    <Button color="primary" className={classes.otherButton} href={pageModel.getNoteUrl()}>他のページも見る</Button>
                </div>
            </React.Fragment>
        )
    }

    const loader = <div className="loader" key="loading">Loading ...</div>;

    const summaryData = props.page.chartCounts === 0 ? pageModel.asRadarData() : pageModel.asSummaryData();
    function evaluate(isSmall: boolean) {
        if(small !== isSmall) {
            return;
        }
        return (
            <div className={classes.descriptionArea}>
                <Paper className={classes.description}>
                    <div className={classes.round}>
                        <div>
                            {(props.page.chartCounts + 1) + "人の平均値"}
                        </div>
                        <RadarChart datas={summaryData.concat()} average={pageModel.average()}></RadarChart>
                        <div>
                            {summaryData.map((e, k) => {
                                return (
                                    <Grid key={"rating-" + k} container direction="row" wrap="nowrap" justify="space-between" alignItems="center">
                                        <Grid item xs={4}>{e.name}</Grid>
                                        <Grid item>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <strong>{Math.round(e.value * 10) / 10}</strong>
                                                <Rating name="size-small" precision={0.5} readOnly={true} value={Math.min(e.value, 5)} size="medium" />
                                            </div>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                        </div>
                    </div>
                    <div className={classes.round}>
                        {pageModel.description()}
                        <hr className={classes.hr}/>
                        <Grid className={classes.reaction} container direction="row" wrap="nowrap" justify="space-around" alignItems="center">
                            {showLikeIcon()}
                            <Button size="large" disabled={!permission.hasCommentPermission()} onClick={addComment}>
                                <FontAwesomeIcon icon={['far', 'comment']}/>&nbsp;
                                {props.page.commentCounts}
                            </Button>
                        </Grid>
                        {showEvaluateButton()}
                    </div>
                </Paper>
            </div>
        )
    }

    return (
        <Container maxWidth={"md"} className={classes.root}>
            <div className={classes.breadcrumbs}>
                <Breadcrumbs maxItems={3} separator="›">
                    {accountLink()}
                    <Link href={pageModel.getNoteUrl()}>{props.page.notebook.title}</Link>
                    <Typography>評価ページ</Typography>
                </Breadcrumbs>
            </div>
            <Title>
                {props.page.title}&nbsp;
                {privateIcon()}
                {showEdit()}
            </Title>
            <Grid container className={classes.authorInfo} direction="row" wrap="nowrap" justify="space-between" alignItems="center">
                <Grid item>
                    {pageModel.author().chip(false)}
                </Grid>
                <Grid item>
                    {pageModel.dateString()}
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    {image()}
                    {evaluate(true)}
                    {showSharePanel()}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    {evaluate(false)}
                    {showComment()}
                </Grid>
            </Grid>
            <CommentEditor page={props.page}/>
            <Dialog
                open={props.deleteConfirm !== null}
                onClose={closeConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"コメントを非表示"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        コメントを非表示にします。
                    </DialogContentText>
                    <DialogContentText className={classes.confirm} id="alert-dialog-description">
                        この操作は取り消しできません。心の準備はいいですか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirm} disabled={disable} autoFocus>
                        キャンセル
                    </Button>
                    <Button onClick={deleteComment} disabled={disable} variant="contained" color="secondary" >
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
