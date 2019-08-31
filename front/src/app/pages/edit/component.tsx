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
    SnackbarContent, Fade, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@material-ui/core";
import Rating, { IconContainerProps } from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import MenuItem from "../../common/menuitem";
import HomeIcon from '@material-ui/icons/Home'
import {Select} from '../../common/forms/selectfield'
import {Textarea} from '../../common/forms/textarea'
import {InputTextList} from "../../common/forms/addableText";
import {Actions} from "./container";
import {NotebookPageEditState} from "./state";
import {NotebookEditPageModel, NotebookPageItem, NotebookPageModel} from "../../../model/notebookPage";
import Validator from "../../common/forms/valiator";
import {InputText} from '../../common/forms/textfield'
import ImageReader from "../../../utils/imageReader";
import {PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar} from "recharts";
import {RadarChart} from "../../common/radar";
import {Title} from "../../common/title";
import {FetchError} from "../../../client/fetch";
import {SyntheticEvent} from "react";
import {Permission} from "../../../model/permission";
import {Notice} from "../../common/notice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        container : {
            padding: 0
        },
        img : {
            height: "100px"
        },
        input: {
            display: 'none',
        },
        title: {
            background:"#f82",
            fontWeight: 700,
            fontSize: "1.5em",
            position: "relative",
            color: "white",
            borderRadius: "5px",
            padding: theme.spacing(0.5),
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1.5),
            width: "100%",
        },
        button : {
            fontWeight: "bold",
            color: "white",
            marginTop: theme.spacing(2),
            padding: theme.spacing(1),
            width: "90%",
        },
        imageButton : {
            fontWeight: "bold",
            color: "white",
            padding: theme.spacing(1),
        },
        image : {
            paddingLeft: "32px",
        },
        textField: {
            border: '1px solid #e2e2e1',
            borderRadius: 4,
            fontSize: "0.5em",
            backgroundColor: "white",
            width: '120px',
        },
        textFieldNum: {
            border: '1px solid #e2e2e1',
            borderRadius: 4,
            fontSize: "0.5em",
            backgroundColor: "white",
            width: '100%',
        },
        evaluateList : {
            margin: theme.spacing(1.5)
        },
        radar: {
            background: "#fff",
            margin: theme.spacing(1.5),
            borderRadius: "5px",
            padding: theme.spacing(1.5),
            border: "solid 1px #aaa",
        },
        delete: {
            color: "white",
        },
        confirm : {
            color: "#f00",
        },
        private: {
            margin: theme.spacing(1.5),
        },
        sectionTitle: {
            marginLeft: theme.spacing(2),
            fontWeight: 900,
        },
        notice : {
            color: "red",
            fontSize: "0.8em",
            margin: theme.spacing(1.5),
        }
    }),
);

interface Props {}

type OwnProps = Props & Actions & NotebookPageEditState;

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [imgError, setImgError] = React.useState(false);
    const [btn, setBtn] = React.useState(props.isNew);
    const [confirm, setConfirm] = React.useState(false);
    const [disable, setDisableButton] = React.useState(false);
    const image: React.RefObject<HTMLInputElement> = React.createRef();
    const model = new NotebookEditPageModel(props);
    const validator = new Validator();
    const permission = new Permission(props.page);

    const readOnly = permission.isAuthor() === false;

    function changeImage(e: React.ChangeEvent<HTMLInputElement>) {
        let files = e.target.files;
        if (files.length === 0) {
            console.log("no image");
            return;
        }
        console.log(files[0]);
        let file = files[0];
        const reader = new ImageReader({ maxHeight: 500, maxWidth: 500});
        reader.read(file, (resizeImage: File) => {
            console.log(resizeImage);
            var fr= new FileReader();
            fr.onload = function(evt: any) {
                props.setImage(evt.target.result);
            }
            fr.readAsDataURL(resizeImage);
        });
    }

    function showImage() {
        if(props.image && props.image.length > 0) {
            return (
                <div style={{ padding: "16px" }}><img src={props.image} className={classes.img}/></div>
            )
        }
        if(props.page.image.length > 0) {
            return (
                <div style={{ padding: "16px" }}><img src={props.page.image} className={classes.img}/></div>
            )
        }
    }

    function showPrivateMessage() {
        if(model.isPublic() === false) {
            return (
                <Notice className={classes.private}>
                    ノートが非公開設定になっているため、この評価は公開されません。
                </Notice>
            );
        }
    }

    function focus(e:any) {
        if (readOnly === false) {
            e.target.select();
        }
    }

    function showEvaluate(item: NotebookPageItem, key: number) {
        return (
            <div key={key} className={classes.evaluateList}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item xs={4}>
                        <TextField
                                className={classes.textField}
                                disabled={readOnly}
                                value={item.name}
                                onFocus={focus}
                                placeholder={item.name}
                                onChange={(v) => {props.changeItemValue(key, v.target.value);}}
                                variant="outlined" />
                    </Grid>
                    <Grid item xs={6} style={{paddingLeft: "10px"}}>
                        <Rating
                            name={"hover-side" + key}
                            readOnly={readOnly}
                            value={item.value > 5 ? 5 : item.value}
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
                            value={item.value}
                            disabled={readOnly}
                            type="number"
                            onFocus={focus}
                            onChange={(v) => {
                                const value = v.target.value;
                                if (value == "") {
                                    props.changeRate(key, 0);
                                    return;
                                }
                                const num = parseInt(value, 10);
                                props.changeRate(key, num < 0 ? 0 : num);
                            }}
                            variant="outlined" />
                    </Grid>
                </Grid>
            </div>
        );
    }

    function showEvaluates() {
        return props.page.items.map(showEvaluate);
    }


    function showDeletePage() {
        setConfirm(true);
    }

    function deletePage() {
        setDisableButton(true);
        model.deletePage((error: FetchError) => {
            if (error) {
                setDisableButton(false);
                setConfirm(false);
                return;
            }
            location.href = model.getNoteUrl();
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
        if(props.isNew === false) {
            return (
                <Grid item>
                    <Button className={classes.delete} onClick={showDeletePage}>削除</Button>
                </Grid>
            )
        }
    }

    const buttonName = props.isNew ? "作成" : "更新";

    return (
        <div className={classes.root}>
            <Container maxWidth={"sm"} className={classes.container}>
            <Title>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                        {model.editPageTitle()}
                    </Grid>
                    {showDeleteButton()}
                </Grid>
            </Title>
            {showPrivateMessage()}
            <InputText title="タイトル(必須)"
                       required="タイトルは必須です"
                       disabled={readOnly}
                       value={props.page.title}
                       placeholder="タイトル"
                       onChange={(v) => {
                           setBtn(v.length <= 0);
                           props.updateState('title', v)
                       }}/>

            <input
                ref={image}
                accept="image/*"
                disabled={readOnly}
                className={classes.input}
                id="contained-button-file"
                onChange={changeImage}
                type="file"
            />
            <div className={classes.image}>
                <label htmlFor="contained-button-file">
                    <Button variant="contained"
                            disabled={readOnly}
                            color="secondary" component="span" className={classes.imageButton}>
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
            <div className={classes.title}>レーダーチャート</div>
            <div className={classes.radar}>
                <RadarChart datas={model.asRadarData().concat()} average={model.average()}  onRenderEnd={v => { props.setRadar(v);}}></RadarChart>
            </div>
            {showEvaluates()}
            <div className={classes.notice}>
                5点より大きい評価は、統計では5点として扱われます。
            </div>

            <Textarea title="補足"
                      value={props.page.description}
                      disabled={readOnly}
                      placeholder="チャートの評価理由（任意）"
                      onChange={(v) => {props.updateState('description', v)}}/>
            <div className={classes.sectionTitle}>コメント</div>
            <FormGroup row style={{marginLeft: theme.spacing(3)}}>
                <FormControlLabel
                    control={
                        <Switch checked={props.page.comment} onChange={() => { props.toggleSwitch('comment'); } } value="on" />
                    }
                    label="コメントを許可する"
                />
            </FormGroup>
            <div className={classes.sectionTitle}>チャート</div>
            <FormGroup row style={{marginLeft: theme.spacing(3)}}>
                <FormControlLabel
                    control={
                        <Switch checked={props.page.evaluate} onChange={() => { props.toggleSwitch('evaluate'); } } value="on" />
                    }
                    label="他の人の評価を受け付ける"
                />
            </FormGroup>

            <div style={{textAlign: "center"}}>
                <Button variant="contained" color="primary" disabled={btn} className={classes.button} onClick={(v) => {
                    props.update(props, (error: any)=> {

                    });
                }}>
                    {buttonName}
                </Button>
            </div>
            <Dialog
                open={confirm}
                onClose={closeConfirm}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"ページを削除"}</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.confirm} id="alert-dialog-description">
                        この操作は取り消しできません。心の準備はいいですか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirm} disabled={disable} autoFocus>
                        キャンセル
                    </Button>
                    <Button onClick={deletePage} disabled={disable} variant="contained" color="secondary" >
                        はい
                    </Button>
                </DialogActions>
            </Dialog>
            </Container>
        </div>
    );
}
