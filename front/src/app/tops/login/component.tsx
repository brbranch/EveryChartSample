import * as React from 'react';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {Container, Grid, Paper, Button} from "@material-ui/core";
import {Actions} from "./container";
import {LoginState} from "./state";
import Session from "../../../utils/session";
import {NotebookPage, NotebookPageModel} from "../../../model/notebookPage";
import {Title} from "../../common/title";
import {PagePanels} from "../../common/pagePanel";
import {TopPanel} from "../../common/toppanel";
import {PropsWithChildren} from "react";
import {LazyLoader} from "../../common/lazyLoader";
import {RecentNotebooksModel} from "../../notebooks/recents/state";
import {NotebookList} from "../../notebooks/recents/component";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: "center"
        },
        container: {
            padding: 0
        },
        twitter: {
            textTransform: 'none',
            color: "white",
            background: "#55acee",
            width: "80%",
            height: "42px",
            maxWidth: "300px",
            '&:hover': {
                color: "white",
                background: "#55acee",
            },
            '&:active': {
                color: "white",
                background: "#55acee",
            },
            '&:focus': {
                color: "white",
                background: "#55acee",
            }
        },
        error : {
            marginBottom: theme.spacing(2),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            padding: theme.spacing(2),
            borderRadius: "5px",
            border: "1px solid #ffcccc",
            background: "#ffeeee",
            color: "#c88"
        },
        gridRoot: {

        },
        whatEveryChart: {
            border: "solid 3px #f83",
            margin: theme.spacing(1),
            marginBottom: theme.spacing(2),
            padding: theme.spacing(1)
        },
        notice: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1),
            fontSize: "0.8em"
        },
        list : {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        }
    }),
);

interface Props {}

type OwnProps = Props & Actions & LoginState;

const TestPanel: React.FC<Props> = (props: PropsWithChildren<Props>) => {
    console.log("this is test panel");
    return (
        <div>test</div>
    )
}

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const session = new Session();


    function getError() {
        if (props.error && props.error.length > 0) {
            return (
                <div className={classes.error}>
                    ログインに失敗しました。
                </div>
            )
        }
    }

    function renderPages(elem: NotebookPage, key: number) {
        const model = new NotebookPageModel(elem);
        return (
            <div key={key}>
                <Grid container className={classes.gridRoot} spacing={2}>
                    <Grid item xs={12}>
                        {elem.title}
                    </Grid>
                </Grid>
            </div>
        )
    }

    function pages() {
        if (props.pages.length) {
            return (
                <React.Fragment>
                    <Title>最新のページ</Title>
                    <PagePanels showNote pages={props.pages}/>
                </React.Fragment>
            )
        }
    }

    function loadMore(page: number) {
        props.loadNextPage(props.cursor);
    }


    const bookModel = new RecentNotebooksModel(props.books);
    function notebooks() {
        if(bookModel.hasData()) {
            return (
                <React.Fragment>
                    <Title>最新のノート</Title>
                    <div className={classes.list}>
                        <NotebookList books={bookModel.notebooks()}
                                      disabled={props.loadBooks}
                                      showNext={false}
                                      showEdit={false}
                                      onClickNext={() => {}}/>
                    </div>
                </React.Fragment>
            )
        }
    }


    return (
        <div className={classes.root}>
            <Container className={classes.container} maxWidth="sm" fixed>
                {getError()}
                <div>
                    <div>EveryChartは、好きな口コミ評価を作れるサービスです</div>
                    <div><img src="/static/images/logo2.png" width="40%"/></div>
                </div>
                <TopPanel/>

                <LazyLoader key="bookLoader" onLoad={() => props.loadNote(props.books)}>
                    {notebooks()}
                </LazyLoader>

                <LazyLoader key="pageLoader" onLoad={() => {loadMore(0)}}>
                    {pages()}
                </LazyLoader>
            </Container>
        </div>
    );
}
