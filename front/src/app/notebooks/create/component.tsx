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
import CloseIcon from '@material-ui/icons/Close'
import {
    Container,
    Grid,
    Paper,
    Box,
    Button,
    FormGroup,
    FormControlLabel,
    Switch,
    Snackbar,
    SnackbarContent, Fade, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@material-ui/core";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {InputText} from '../../common/forms/textfield'
import {NotebookState} from "./state";
import {Actions} from './container'
import {Select} from '../../common/forms/selectfield'
import {Textarea} from '../../common/forms/textarea'
import {InputTextList} from "../../common/forms/addableText";
import Validator from "../../common/forms/valiator";
import {spacing} from "material-ui/styles";
import Icon from "@material-ui/core/Icon/Icon";
import {SyntheticEvent} from "react";
import {categories} from '../category'
import {permissions} from '../permission'
import {Notice} from "../../common/notice";
import {store} from '../../../index'
import {routerActions} from "../../routerActions";
import {FetchError, UrlFetch} from "../../../client/fetch";
import ImageReader from "../../../utils/imageReader";
import {NotebookModel} from "../../../model/notebook";
import {Title} from "../../common/title";
import {AllowBox} from "../../common/allowBox";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        button : {
            fontWeight: "bold",
            color: "white",
            marginTop: theme.spacing(2),
            padding: theme.spacing(1),
            width: "90%"
        },
        notice: {
            paddingLeft: "16px",
            paddingRight: "16px",
        },
        close: {
            padding: theme.spacing(0.5),
        },
        input: {
            display: 'none',
        },
        imageButton : {
            fontWeight: "bold",
            color: "white",
            padding: theme.spacing(1),
        },
        image : {
            paddingTop: "16px",
            paddingLeft: "16px",
        },
        img : {
            height: "100px"
        },
        delete: {
            color: "white",
        },
        confirm : {
            color: "#f00",
        },
        sectionTitle: {
            marginLeft: theme.spacing(1),
            fontWeight: 900,
        }
    }),
);

interface Props {
    isFirst?: boolean;
}
type Own = Props & NotebookState & Actions;

export const Component: React.FC<Own> = (props: Own) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [open, setOpen] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);
    const [disable, setDisableButton] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);
    const image: React.RefObject<HTMLInputElement> = React.createRef();
    const validator = new Validator();
    const model = new NotebookModel(props);
    const first = new URLSearchParams(location.search).get("first") === 'true';

    var onClick = () => {
        if(validator.validate()) {
            props.save(props);
            return;
        }
        setOpen(true);
    };

    function handleClose(event?: SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    function changeImage(e: React.ChangeEvent<HTMLInputElement>) {
        let files = e.target.files;
        if (files.length === 0) {
            return;
        }
        let file = files[0];
        const reader = new ImageReader({ maxHeight: 500, maxWidth: 500});
        reader.read(file, (resizeImage: File) => {
            var fr= new FileReader();
            fr.onload = function(evt: any) {
                props.setImage(evt.target.result);
            }
            fr.readAsDataURL(resizeImage);
        });
    }

    function showImage() {
        if(props.image.length > 0) {
            return (
                <div style={{ padding: "16px" }}><img src={props.image} className={classes.img}/></div>
            )
        }
        if(props.imageUrl.length > 0) {
            return (
                <div style={{ padding: "16px" }}><img src={props.imageUrl} className={classes.img}/></div>
            )
        }
    }

    function name() {
        return props.id ? "ノートを編集" : "ノートを作成";
    }

    function showDeleteRanking() {
        setConfirm(true);
    }

    function deleteRanking() {
        setDisableButton(true);
        model.deleteNote((error: FetchError) => {
            if (error) {
                setDisableButton(false);
                setConfirm(false);
                return;
            }
            location.href = "/home"
        })
    }

    function closeConfirm(event?: SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }
        if (disable === false) {
            setConfirm(false);
        }
    }

    function showDeleteButton() {
        if (props.id) {
            return (
                <Grid item>
                    <Button className={classes.delete} onClick={showDeleteRanking}>削除</Button>
                </Grid>
            )
        }
    }

    const buttonName = props.id ? "ノートを更新": "ノートを作成";
    const editableText = props.editable === 'self' ? "「自分のみ投稿」にすると、このノートはあなただけが評価ページを作成できます。" : "「みんなで投稿」にすると、このノートに色んな人が評価ページを作れるようになります。";

    return (
        <div className={classes.root}>
            <Container maxWidth="sm">
                <Title>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Grid item>
                            {name()}
                        </Grid>
                        {showDeleteButton()}
                    </Grid>
                </Title>
                <InputText title="タイトル (必須)"
                           required="タイトルは必須です"
                           value={props.title}
                           validate={validator}
                           placeholder="(例)好きなマンガ一覧"
                           onChange={(v) => {props.updateTitle(v)}}/>
                <AllowBox show={first}>
                    作りたい評価一覧の名前を決めましょう！<br/>
                </AllowBox>

                <Textarea title="説明"
                          value={props.description}
                          placeholder="(例)今まで読んできて印象に残った漫画の一覧を作成しました"
                          onChange={(v) => {props.updateState('description', v)}}/>
                <input
                    ref={image}
                    accept="image/*"
                    className={classes.input}
                    id="contained-button-file"
                    onChange={changeImage}
                    type="file"
                />
                <div className={classes.image}>
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="secondary" component="span" className={classes.imageButton}>
                            画像
                        </Button>
                        <div>
                            <Fade in={imgError}>
                                <span style={{color: "red", paddingLeft: "20px"}}>画像が大きすぎます</span>
                            </Fade>
                        </div>
                    </label>
                    {showImage()}
                </div>
                <InputTextList
                        title="評価項目"
                        required="必須項目です"
                        minItems={3}
                        maxItems={12}
                        dateKey={props.changedAt}
                        values={props.items}
                        placeholders={[
                            "(例)読み応え", "(例)ストーリー", "(例)キャラの個性", "(例)展開", "(例)画力" ,
                            "(例)オリジナリティ","(例)ハラハラ感","(例)尊さ","(例)線のタッチ","(例)かっこよさ","(例)好き","(例)ラスト"
                        ]}
                        onAdd={()=>{props.addItem()}}
                        onChanges={(values) => {props.updateItems(values)}}
                />
                <AllowBox show={first}>
                    レーダーチャートで表示する項目です。評価したいポイントを入れましょう！<br/>
                    <img src={"/static/images/demo001.png"} style={{width: "50%"}}/>
                </AllowBox>
                <Title>設定</Title>
                <Select title="リスト投稿"
                        validate={validator}
                        onChange={(v) => {props.updateState('editable', v)}}
                        value={props.editable} menu={permissions}/>
                <AllowBox show={first}>
                    {editableText}<br/>
                    <img src={"/static/images/demo002.png"} style={{width: "50%"}}/>
                </AllowBox>

                <div className={classes.sectionTitle}>公開設定</div>
                <Grid component="label" container alignItems="center" spacing={1} style={{paddingLeft: "16px"}}>
                    <Grid item>
                        非公開
                    </Grid>
                    <Grid item>
                        <Switch checked={props.private === false} onChange={(e)=>{ props.changeSwitch('private', !e.target.checked); }} color="primary" value="checkedA" />
                    </Grid>
                    <Grid item>
                        公開
                    </Grid>
                </Grid>
                <AllowBox show={first}>
                    誰にも見せたくないときは非公開にしましょう。
                </AllowBox>

                <div className={classes.sectionTitle}>大人向け</div>
                <FormGroup row style={{marginLeft: "16px"}}>
                    <FormControlLabel
                        control={
                            <Switch checked={props.adult} onChange={(e)=>{ props.changeSwitch('adult', e.target.checked); }} color="primary" value="checkedA" />
                        }
                        label="大人向け(R18)"
                    />
                </FormGroup>
                <Notice className={classes.notice}>
                    大人向けの内容を扱う場合には、大人向け(R18)の設定をお願いします。
                </Notice>

                <Box>
                    <Button variant="contained" disabled={props.disable} color="secondary" className={classes.button} onClick={onClick}>
                        {buttonName}
                    </Button>
                </Box>
            </Container>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">入力内容にエラーがあります</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.close}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />

            <Dialog
                open={confirm}
                onClose={closeConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"ノートを削除"}</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.confirm} id="alert-dialog-description">
                        この操作は取り消しできません。心の準備はいいですか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirm} disabled={disable} autoFocus>
                        キャンセル
                    </Button>
                    <Button onClick={deleteRanking} disabled={disable} variant="contained" color="secondary" >
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
