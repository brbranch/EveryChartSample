import * as React from "react";
import {Button, createStyles, makeStyles, TextField, Theme, useTheme} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ShareIcon from "@material-ui/icons/Link"
import EventDispacher from "../../eventDispacher";
import {useState} from "react";
import clsx from 'clsx';
import Timeout = NodeJS.Timeout;
import {clipboardCopy} from "../../utils/clicpboard";

interface Props {
    title: string
    path: string
    shareText: string
    className?: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            border: "solid 2px #fa4",
            borderRadius: "5px",
            background: "#fa4",
            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)"
        },
        title: {
            borderRadius: "5px 5px 0px 0px",
            background: "#fa4",
            color: "#fff",
            fontSize: "1.2em",
            fontWeight: 900,
            padding: theme.spacing(1),
        },
        content: {
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingBottom: "16px",
            background: "#fff"
        },
        link: {
        },
        textField: {
            width: "100%",
            transition: "all 0.3s linear 0s",
            '& input' : {
                textAlign: "left",
            }
        },
        textFieldRed: {
            boxShadow: "0px 0px 6px #f66",
            background: "#fee",
        },
        buttonArea: {
        },
        button: {
        },
        tweetBtn: {
            textTransform: 'none',
            [theme.breakpoints.up('md')] : {
                width: "100%"
            },
            minWidth: "100px",
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(1),
            color: "white !important",
            background: "#55acee !important",
            '&:hover': {
                color: "white !important",
                background: "#55acee !important",
            },
            '&:active': {
                color: "white !important",
                background: "#55acee !important",
            },
            '&:focus': {
                color: "white !important",
                background: "#55acee !important",
            },
        },
        copyBtn: {
            textTransform: 'none',
            minWidth: "100px",
            [theme.breakpoints.up('md')] : {
                width: "100%"
            },
            marginRight: theme.spacing(1),
            marginBottom: theme.spacing(1),
            color: "white !important",
            background: "#6666cc !important",
            '&:hover': {
                color: "white !important",
                background: "#6666cc !important",
            },
            '&:active': {
                color: "white !important",
                background: "#6666cc !important",
            },
            '&:focus': {
                color: "white !important",
                background: "#6666cc !important",
            }
        },
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

    }),
);

export const ShareLink: React.FC<Props> = (props) => {
    const theme = useTheme();
    const css = useStyles(theme);
    const baseurl = "https://everychart.site";
    const [anim, setAnim] = useState("");
    let interval:any = null;

    function tweetLink() {
        const base = "https://twitter.com/intent/tweet?text=";
        return base + props.shareText + "%0a〜EveryChart〜なんでもチャートで評価しよう&hashtags=everychart&url=" + path();
    }

    function clickCopy() {
        if (clipboardCopy(path())) {
            changeAnim("start");
        } else {
            EventDispacher.instance.showToast("コピーに失敗しました。");
        }
    }

    function focus(event: any) {
        clickCopy();
        event.preventDefault();
        const { target } = event;
        const extensionStarts = target.value.length;
        target.focus();
        target.setSelectionRange(0, extensionStarts);
    }

    function path() {
        if(props.path.startsWith("/")) {
            return baseurl + props.path;
        }
        return baseurl + "/" + props.path;
    }

    function changeAnim(type: string) {
        setAnim(type);
        interval = setInterval(() => {
            setAnim("");
            clearInterval(interval);
        }, 2000);
    }

    function getAnimClass() {
        if(anim === "") {
            return css.textField;
        }
        return clsx(css.textField, css.textFieldRed);
    }

    const rootClass = props.className ? clsx(props.className, css.root) : css.root;

    return (
        <div className={rootClass}>
            <div className={css.title}>{props.title}</div>
            <div className={css.content}>
                <div className={css.link}>
                    <TextField
                        id="outlined-disabled"
                        defaultValue={path()}
                        className={getAnimClass()}
                        onClick={focus}
                        inputProps={{ }}
                        margin="normal"
                    />
                </div>
                <div className={css.buttonArea}>
                    <Button variant="contained"
                            href={tweetLink()}
                            size="medium"
                            target="_blank"
                            style={{textTransform: "none"}}
                            className={css.tweetBtn}>
                        <FontAwesomeIcon icon={['fab', 'twitter']}/>
                        &nbsp;Tweet
                    </Button>
                    <Button variant="contained"
                            href=""
                            size="medium"
                            style={{textTransform: "none"}}
                            onClick={clickCopy}
                            className={css.copyBtn}>
                        <ShareIcon/>&nbsp;{anim === "" ? "リンクをコピー" : "コピーしました"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
