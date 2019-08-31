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
import MenuItem from "../common/menuitem";
import HomeIcon from '@material-ui/icons/Home'
import {Container, Grid, Paper} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import Test from '../../sample/containers/testContainer'
import TestApi from '../../sample/containers/testApiContainer'
import Avater from './avater/container'
import {RouterState} from "connected-react-router";
import MyList from './mylist/container'
import {ShareLink} from "../common/sharelink";
import {IndexState} from "./state";
import {TopPanel} from "../common/toppanel";
import Session from "../../utils/session";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        avater : {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        topInfo: {
            textAlign: "center",
            marginTop: theme.spacing(1),
            paddingTop: theme.spacing(1),
        }
    }),
);

interface OwnProps {
}

type Props = OwnProps & IndexState;

export const Component: React.FC<Props> = (props: Props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const path = props.accountId;
    const text = props.name + "のノート一覧";

    function showTopContent() {
        const session = new Session();
        if(session.isLoggedIn() === false) {
            return (
                <div className={classes.topInfo}>
                    <div>
                        <div>EveryChartは、好きな口コミ評価を作れるサービスです</div>
                        <div><img src="/static/images/logo2.png" width="40%"/></div>
                    </div>
                    <TopPanel/>
                </div>
            )
        }
    }

    return (
        <Container maxWidth={"md"}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                    <Paper className={classes.paper}>
                        <Avater/>
                    </Paper>
                    <ShareLink title="このページを共有" path={path} shareText={text}/>
                </Grid>
                <Grid item xs={12} sm={6} md={8} lg={8}>
                    <MyList accountID={props.accountId}/>
                </Grid>
            </Grid>
        </Container>
    );
}
