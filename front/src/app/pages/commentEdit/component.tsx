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
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import MenuItem from "../../common/menuitem";
import HomeIcon from '@material-ui/icons/Home'
import {
    Container,
    Grid,
    Paper,
    Button,
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText, DialogActions, Slide, TextField, FormControlLabel, Switch
} from "@material-ui/core";
import {Actions} from "./container";
import {NotebookCommentEditState} from "./state";
import {TransitionProps} from "@material-ui/core/transitions";
import {Textarea} from "../../common/forms/textarea";
import {NotebookCommentModel} from "../../../model/notebookComment";
import {RadarChart, RadarItem} from "../../common/radar";
import Rating, { IconContainerProps } from '@material-ui/lab/Rating';
import {NotebookPage, NotebookPageModel} from "../../../model/notebookPage";
import {Permission} from "../../../model/permission";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        img : {
            height: "100px"
        },
        input: {
            display: 'none',
        },
        button : {
            fontWeight: "bold",
            color: "white",
            marginTop: theme.spacing(2),
            padding: theme.spacing(1),
            width: "80%"
        },
        imageButton : {
            fontWeight: "bold",
            color: "white",
            padding: theme.spacing(1),
        },
        image : {
            paddingTop: "32px",
            paddingLeft: "32px",
        },
        textField: {
            border: '1px solid #e2e2e1',
            borderRadius: 4,
            fontSize: "0.5em",
            backgroundColor: "white",
            marginRight: '8px',
            width: '100px',
        },
        textFieldNum: {
            border: '1px solid #e2e2e1',
            borderRadius: 4,
            fontSize: "0.5em",
            backgroundColor: "white",
            marginRight: '8px',
            width: '100%',
        },
        dialogContent: {

        },
        dialogTitle: {
            borderBottom: "1px solid #ccc"
        },
        radar: {
            background: "#fff",
            margin: theme.spacing(1.5),
            borderRadius: "5px",
            padding: theme.spacing(1.5),
            border: "solid 1px #aaa",
        },
        notice : {
            color: "red",
            fontSize: "0.8em"
        }
    }),
);

interface Props {
    page: NotebookPage
}

type OwnProps = Props & Actions & NotebookCommentEditState;

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const maxWidth = fullScreen ? undefined : "sm";
    const model = new NotebookCommentModel(props.myComment, props.page);
    const permission = new Permission(props.page);

    if (props.myComment === undefined) {
        return (<div style={{display:"none"}}></div>)
    }

    function handleClose() {
        if(props.edit == false || confirm("編集を破棄しますか？")) {
            props.setVisible(false);
        }
    }

    function focus(e:any) {
        e.target.select();
    }

    function showEvaluate(elem: RadarItem, key: number) {
        const name = elem.name;
        const value = elem.value;
        return (
            <div key={"comment-evaluate-" + key}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={4}>
                        {name}
                    </Grid>
                    <Grid item xs={6} style={{paddingLeft: "10px"}}>
                        <Rating
                            name={"hover-side" + key}
                            value={value > 5 ? 5 : value}
                            precision={1.0}
                            size="large"
                            onChange={(event: object, value: number) => {
                                if (value >= 0) {
                                    props.changeRate(key, value);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            className={classes.textFieldNum}
                            value={value}
                            type="number"
                            onFocus={focus}
                            onChange={(v) => {
                                const value = v.target.value;
                                if (value == "") {
                                    props.changeRate(key, 0);
                                    return;
                                }
                                const num = parseInt(value, 10);
                                props.changeRate(key, num);
                            }}
                            variant="outlined" />
                    </Grid>
                </Grid>
            </div>
        );
    }

    function showEvaluates() {
        return model.items().map(showEvaluate);
    }

    function cancel() {
        handleClose();
    }

    function update() {
        props.update(model);
    }

    function hasRate() {
        return props.myComment.values.reduce((b, f) => {return b + f}) > 0;
    }

    function isEdit() {
        if (!props.edit) {
            return false;
        }
        if (props.myComment.comment.length === 0 && hasRate() === false) {
            return false;
        }
        return true;
    }

    function showEvaluateComponent() {
        if(props.myComment.evaluates) {
            return (
                <div>
                    <div>
                        <RadarChart datas={model.items()} average={model.average()}></RadarChart>
                    </div>
                    {showEvaluates()}
                    <div className={classes.notice}>
                        5点より大きい評価は、統計では5点として扱われます。
                    </div>
                </div>
            )
        }
    }

    function showComment() {
        if(permission.hasCommentPermission()) {
            return (
                <Textarea title="コメント"
                          value={props.myComment.comment}
                          onChange={(v) => {
                              props.changeComment(v);
                          }}/>
            )
        }
    }

    const title = props.myComment.evaluates ? "評価する": "コメントする";

    return (
        <Dialog
            fullScreen={fullScreen}
            maxWidth={maxWidth}
            fullWidth={true}
            open={props.visible}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title" className={classes.dialogTitle}>
                <Grid container direction="row"
                      justify="flex-start"
                      alignItems="center">
                    <Grid item>
                        <Button onClick={cancel}>
                            <CloseIcon />
                        </Button>
                    </Grid>
                    <Grid item>
                        {title}
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent >
                {showEvaluateComponent()}
                {showComment()}
            </DialogContent>
            <DialogActions>
                <Button onClick={cancel} color="primary">
                    キャンセル
                </Button>
                <Button onClick={update} color="primary" disabled={!isEdit()} autoFocus>
                    投稿
                </Button>
            </DialogActions>
        </Dialog>
    );
}
