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
import InfoIcon from '@material-ui/icons/Info';
import MoreIcon from '@material-ui/icons/MoreHoriz'
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme, Theme, createStyles, withStyles} from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home'
import {
    Box,
    Container,
    Grid,
    Paper,
    Link,
    LinearProgress,
    Snackbar,
    Fab,
    Button,
    Menu,
    MenuItem, Avatar
} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import Test from '../sample/containers/testContainer'
import TestApi from '../sample/containers/testApiContainer'
import Avater from './index/avater/container'
import BackIcon from '@material-ui/icons/KeyboardBackspace'
import Index from './index/container'
import PostCreate from './notebooks/create/container'
import {RootState} from "./routerState";
import Login from './tops/login/container'
import Session from "../utils/session";
import NotebookDetail from './notebooks/details/container'
import NotebookPageEdit from './pages/edit/container'
import NotebookPageDetail from './pages/details/container'
import {SyntheticEvent} from "react";
import {RouterAction} from "connected-react-router";
import {RootActions} from "./routerContainer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MenuProps} from "@material-ui/core/Menu";
import {MenuItemProps} from "@material-ui/core/MenuItem";
import {Terms} from "./tops/terms";
import {PrivacyPolicy} from "./tops/policy";
import {Information} from "./tops/info";
import {SettingPage} from "./index/settings/container";
import {ErrorMessage} from "./common/errorMessage";
import {FetchError, UrlFetch} from "../client/fetch";
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery";

const drawerWidth = 280;
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
        },
        container: {
            padding: 0
        },
        logo: {
            position: "absolute",
            right: 0,
            top: "5px"
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        drawer: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                flexShrink: 0,
            },
        },
        menuButton: {
            marginRight: theme.spacing(2),
            [theme.breakpoints.up('sm')]: {
                display: 'none',
            },
        },
        appBar : {
            backgroundColor: "white",
            boxShadow : "0px 0px 3px 2px rgba(0, 0, 0, .3)",
            transition: "all 0.3s linear 0s"
        },
        appBarOpen: {
            width: "150px",
        },
        appToolbar: {
            paddingTop: "5px",
            paddingBottom: "5px",
            pdadingLeft: "5px",
        },
        toolbar: theme.mixins.toolbar,
        toolbarLeft: {
            paddingLeft: theme.spacing(0.5),
            position: "relative"
        },
        drawerPaper: {
            width: drawerWidth,
        },
        titleContainer: {
            padding: 0
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            [theme.breakpoints.down('sm')]: {
                paddingTop: theme.spacing(3),
                paddingLeft: "0",
                paddingRight: "0",
            }
        },
        test : {
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            }
        },
        hr : {
            borderBottom: "2px dashed #ffcc99"
        },
        footer : {
            paddingTop: theme.spacing(3)
        },
        footerGrid : {
            textAlign: "center"
        },
        footerLogo : {
            paddingTop: theme.spacing(3),
            paddingBottom: theme.spacing(3),
            textAlign: "center"
        },
        progress: {
            position: "relative",
            zIndex: 1600
        },
        close: {

        },
        back: {
            height: "50px",
            fontSize: "2.0em"
        },
        error: {
            margin: theme.spacing(1),
            padding: theme.spacing(1),
        },
        errorTop : {
            marginTop: theme.spacing(1),
            textAlign: "center"
        }
    }),
);

interface RootProps {}
type OwnProps = RootProps & RootState & RootActions;

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const small = useMediaQuery(theme.breakpoints.down('sm'));
    const justify = small ? "" : "";

    const error = document.getElementById('data-error');
    const errorJson = error ? error.getAttribute("data-json") : undefined;
    const session: Session = new Session();

    var renderBody = () => {
        if (errorJson) {
            const err = JSON.parse(errorJson);
            return renderError(err.error);
        }
        return renderRouter();
    };

    var renderError = (errorCode:any) => {
        return (
            <Container maxWidth={"md"} className={classes.container} fixed>
                <Paper className={classes.error}>
                    <ErrorMessage status={errorCode} isPage/>
                    <div className={classes.errorTop}>
                        <Link href="/top">トップへ</Link>
                    </div>
                </Paper>
            </Container>
        );
    };

    function handleClose(event?: SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        props.hideToast();
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    function handleExited() {
        props.nextToast();
    }

    var renderRouter = () => {
        return (
            <Switch>
                <Route exact path="/" render={({match}) => (<Login/>)} />
                <Route exact path="/top/terms" render={({match}) => (<Terms/>)} />
                <Route exact path="/top/policy" render={({match}) => (<PrivacyPolicy/>)} />
                <Route exact path="/top/info" render={({match}) => (<Information/>)} />
                <Route exact path="/home/settings" render={({match}) => (<SettingPage />)} />
                <Route path="/top" render={({match}) => (<Login/>)} />
                <Route path="/home" render={({match}) => (<Index />)} />
                <Route exact path="/:accountId" render={({match}) => (<Index/>)} />
                <Route exact path="/:accountId/notebooks/new" render={({match}) => {
                    return (<PostCreate />)
                }} />
                <Route exact path="/:accountId/notebooks/:id/edit" render={({match}) => (<PostCreate/>)} />
                <Route exact path="/:accountId/notebooks/:id" render={({match}) => (<NotebookDetail/>)} />
                <Route exact path="/:accountId/notebooks/:id/pages/new" render={({match}) => (<NotebookPageEdit/>)} />
                <Route exact path="/:accountId/notebooks/:id/pages/:pageId" render={({match}) => (<NotebookPageDetail/>)} />
                <Route exact path="/:accountId/notebooks/:id/pages/:pageId/edit" render={({match}) => (<NotebookPageEdit/>)} />
            </Switch>
        );
    };

    function setBack() {
        if(props.backPath.length) {
            if(props.backPath === 'back') {
                return (
                    <Button onClick={(e: any) => {
                        history.back();
                    }} className={classes.back} aria-label="Add">
                        <BackIcon/>
                    </Button>
                );
            }
            return (
                <Button href={props.backPath} className={classes.back} aria-label="Add">
                    <BackIcon/>
                </Button>
            );
        }
    }

    function showMoreButton() {
        if (props.disableMenu) {
            return;
        }
        if(session.isLoggedIn()) {
            return (
                <Grid item style={{color: "#f83"}}>
                    <Button href="/logout">ログアウト&nbsp;<Avatar src={session.loginImage()} sizes={"small"} style={{width: 30, height: 30}}/></Button>
                </Grid>
            )
        }
        return (
            <Grid item style={{color: "#f83"}}>
                <Button href="/top">登録/ログイン</Button>
            </Grid>
        )
    }

    function toastMessage() {
        const messages = props.currentToast.split("\n");
        return messages.map((e,k) => <div key={"err-" + k}>{e}</div>)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" color="default" className={classes.appBar}>
                <LinearProgress className={classes.progress} style={{display: props.progress ? 'block' : 'none' }} />
                <Toolbar className={clsx(classes.appToolbar, classes.toolbarLeft)}>
                    <Container maxWidth={"md"} className={classes.titleContainer}>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            <Link href="/" >
                                <img src="/static/images/everychart_logo.svg" width="186" height="50"/>
                            </Link>
                        </Grid>
                        {showMoreButton()}
                    </Grid>
                    </Container>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {renderBody()}
                <div className={classes.hr}>&nbsp;</div>
                <div className={classes.footer}>
                    <Container fixed maxWidth={"md"}>
                        <Grid container spacing={3} justify="space-around" alignItems="center">
                            <Grid item className={classes.footerGrid}>
                                <Link href="/top/terms">利用規約</Link>
                            </Grid>
                            <Grid item className={classes.footerGrid}>
                                <Link href="/top/policy">プライバシーポリシー</Link>
                            </Grid>
                            <Grid item className={classes.footerGrid}>
                                <Link href="https://twitter.com/br_branch"><FontAwesomeIcon icon={['fab', 'twitter']}/>&nbsp;開発者Twitter</Link>
                            </Grid>
                            <Grid item className={classes.footerGrid}>
                                <Link href="/top/info">
                                    <FontAwesomeIcon icon={['fas', 'info-circle']}/>&nbsp;お知らせ
                                </Link>
                            </Grid>
                        </Grid>
                        <div className={classes.footerLogo}>
                            <Link href="/top" underline="none">
                                <img src="/static/images/everychart_logo_footer.svg" width="196" height="59"/>
                            </Link>
                            <div>© 2019 <Link href="https://twitter.com/br_branch">@br_branch</Link></div>
                        </div>
                    </Container>
                </div>
            </main>
            <Snackbar
                key="rooteSnackbar"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={props.toastOpen}
                autoHideDuration={1000}
                onClose={handleClose}
                onExited={handleExited}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<div id="message-id">{toastMessage()}</div>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        </div>
    );
}



