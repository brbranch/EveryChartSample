import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
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
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import {Button, Card, CardContent, CardMedia, Container, Fab, Grid, Icon, Link, Paper} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import {MylistState} from "./state";
import {Actions} from "./container";
import {ProcessStatus} from "../../common/processStatus";
import {Notebook, NotebookModel} from "../../../model/notebook";
import Session from "../../../utils/session";
import {LogoPanel} from "../../common/logoPanel";
import {NotebookList} from "../../notebooks/recents/component";
import {LazyLoader} from "../../common/lazyLoader";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        boxRoot: {
            position: "relative"
        },
        title: {
            background:"#f62",
            fontWeight: 700,
            fontSize: "1.5em",
            color: "white",
            padding: theme.spacing(0.5),
            marginBottom: theme.spacing(1.5),
            width: "100%",
        },
        card: {
            marginTop: theme.spacing(1.5),
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            borderRadius: "5px 5px 5px 5px",
            border: "1px solid #ccc",
            boxShadow: "none",
            [theme.breakpoints.down('sm')] : {
                borderRadius: "5px 5px 5px 5px",
            },
            '&:hover' : {
                background: "#ccc"
            }
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        overflowCard: {
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            flex: '1 0 auto',
            width: 100,
        },
        button: {
            position: "absolute",
            top: -theme.spacing(1),
            right: -theme.spacing(2),
            color: "#fff"
        },
        list : {
            marginTop: "0",
            width : "calc(100% - 100px)",
            padding: "0px",
            background: "white",
            borderRadius: "0px 0px 5px 5px",
            [theme.breakpoints.down('sm')] : {
                width: "100%"
            }
        },
        listItem  : {
            '&:first-child': {
                background: "#fa0",
                fontWeight: 700,
                color: "white",
            },
            '&:last-child' : {
                borderRadius: "0px 0px 5px 5px",
            }
        },
        newButton: {
            width: "100%",
            fontWight: 900,
            color: "white",
            marginTop: theme.spacing(1),
        }
    }),
);

interface Props {
    accountID: string
}
type OwnProps = Props & MylistState & Actions;

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const session = new Session();

    function renderProcessing() {
        return (<div>取得中...</div>)
    }

    function renderTable() {
        if (props.status != ProcessStatus.DONE) {
            return renderProcessing();
        }
        if (props.books === undefined || props.books === null) {
            return;
        }
        if (props.books.hasData()) {
            return <NotebookList books={props.books.notebooks()}
                                 showNext={props.books.hasNext() && props.status == ProcessStatus.DONE}
                                 showEdit={true}
                                 chips={false}
                                 onClickNext={() => {props.nextData(props.books)}}
            />
        } else {
            return (
                <Link href={getNewUrl()} underline={"none"}>
                    <LogoPanel text={"あなただけのチャートを作成しよう"}></LogoPanel>
                </Link>
            )
        }
    }

    function getNewUrl() {
        const url =  "/" + session.getId() + "/notebooks/new";
        if(props.books !== null && props.books.hasData()) {
            return url;
        }
        return url + "?first=true";
    }

    function renderNewButton() {
        if (session.isLoggedIn() && session.getId() === props.accountID && props.status === ProcessStatus.DONE) {
            return (<Button href={getNewUrl()} variant="contained" color="secondary" className={classes.newButton}>新しいノートを作成</Button>);
        }
    }

    function load() {
        props.receiveData(props.accountID);
    }


    function render() {
        return (
            <LazyLoader className={classes.root} once onLoad={load}>
                <Card className={classes.title}>ノート一覧</Card>
                {renderTable()}
                {renderNewButton()}
            </LazyLoader>
        );
    }

    return render();
}
