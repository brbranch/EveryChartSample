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
import clsx from 'clsx';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home'
import {
    Container,
    Grid,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions, Slide, Link
} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import {SettingActions} from "./container";
import {Title} from "../../common/title";
import {TransitionProps} from "@material-ui/core/transitions";
import EventDispacher from "../../../eventDispacher";
import {SettingState} from "./state";
import {FetchError} from "../../../client/fetch";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        container: {
            padding: 0
        },
        content: {
            margin: theme.spacing(1),
            padding: theme.spacing(1.5)
        },
        row: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        confirm : {
            color: "#f00",
            marginTop: theme.spacing(2)
        },
        bye : {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            textAlign: "center"
        }

    }),
);

interface Props {}

type OwnProps = Props & SettingActions & SettingState;

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [open, setOpen] = React.useState(false);
    const [disable, setDisableButton] = React.useState(false);

    function handleClose() {
        if (disable) {
            return;
        }
        setOpen(false);
    }

    function confirmUnsubscribe() {
        setOpen(true);
    }

    function handleOk() {
        setDisableButton(true);
        props.bye((error: FetchError) => {
            if(error) {
                setDisableButton(false);
                setOpen(false);
            }
        });
    }

    const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
        return <Slide direction="down" ref={ref} {...props} />;
    });

    if (props.goodbye) {
        return (
            <div className={classes.root}>
                <Title>退会しました</Title>
                <Paper className={classes.content}>
                    またお会いする日まで…。
                    <div className={classes.bye}>
                        <Link href="/top">トップへ</Link>
                    </div>
                </Paper>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <Container fixed maxWidth={"sm"} className={classes.container}>
                <Title>{"設定:" + props.account.name}</Title>
                <Paper className={classes.content}>
                    <Grid container className={classes.row} direction="row" alignItems="center" justify="space-between">
                        <Grid item>
                            <strong>アカウントID</strong>
                        </Grid>
                        <Grid item>
                            {props.account.id}
                        </Grid>
                    </Grid>
                    <Grid container className={classes.row} direction="row" alignItems="center" justify="space-between">
                        <Grid item>
                            <strong>退会</strong>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={confirmUnsubscribe}>退会する</Button>
                        </Grid>
                    </Grid>
                </Paper>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"EveryChartから退会"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            あなたのアカウント({props.account.id})を削除します。
                        </DialogContentText>
                        <DialogContentText className={classes.confirm} id="alert-dialog-description">
                            アカウント削除後は、あなたのアカウントに紐付いたすべての投稿（ノート・ページ・コメント）が消え、再登録後も復旧されません。
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} disabled={disable} autoFocus>
                            キャンセル
                        </Button>
                        <Button onClick={handleOk} disabled={disable} variant="contained" color="secondary" >
                            退会する
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
}
