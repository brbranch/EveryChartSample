import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";
import {SubTitle} from "./subtitle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface OwnProps {
    status: number
    isPage?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    content: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        lineHeight: "130%"
    },
    errorContent: {
        marginTop: theme.spacing(2),
        textAlign: "center"
    },
    errorButton: {
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
}));

const ErrorTweet : React.FC<{}> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const url = "";
    return (
        <div className={classes.errorContent}>
            <Button variant="contained" href={url} size="medium" className={classes.errorButton}><FontAwesomeIcon icon={['fab', 'twitter']}/>&nbsp;エラーを報告</Button>
        </div>
    )
};

export const ErrorMessage : React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const jsonError : {[key:number]: React.ReactElement} = {
        500: (<div>処理中にエラーが発生しました。暫く時間を置いてやりなおしてみて下さい。<br/>ずっと改善しない場合きっとバグです。ごめんなさい。<br/>(エラー報告を貰えると頑張ってなおします)</div>),
    }

    const htmlError : {[key:number]: React.ReactElement} = {
        400: (<div><SubTitle><FontAwesomeIcon icon={['fas', 'exclamation-circle']} />&nbsp;不正なリクエストです</SubTitle>
            <div className={classes.content}>
                <p>URLに変なの入ってないか確認しつつもう一度やりなおしてみて下さい。</p>
            </div>
        </div>),
        401: (<div>
            <SubTitle><FontAwesomeIcon icon={['fas', 'exclamation-circle']} />&nbsp;表示する権限がありません</SubTitle>
            <div className={classes.content}>
                <p>悲しまないで下さい。</p>
                <p>これはデータがセキュリティでばっちり守られているという証でもあり、
                    あなたの投稿も同じようにばっちり守られるということなのです。</p>
            </div>
        </div>),
        403: (<div>
            <SubTitle><FontAwesomeIcon icon={['fas', 'exclamation-circle']} />&nbsp;表示する権限がありません</SubTitle>
            <div className={classes.content}>
                <p>悲しまないで下さい。</p>
                <p>これはデータがセキュリティでばっちり守られているという証でもあり、
                    あなたの投稿も同じようにばっちり守られるということなのです。</p>
            </div>
        </div>),
        404: (<div><SubTitle><FontAwesomeIcon icon={['fas', 'exclamation-circle']} />&nbsp;ページが見つかりませんでした</SubTitle>
                <div className={classes.content}>
                    <p>もし普通にサイトを使ってたのにこのページが表示されちゃった場合、
                        データが削除されたか、非公開設定になっているか、投稿者が退会しちゃったのかもしれません。
                    </p>
                    <p>別れはいつだって唐突です。こればっかりは仕方がありません。</p>
                </div>
            </div>),
        500: (<div><SubTitle><FontAwesomeIcon icon={['fas', 'exclamation-circle']} />&nbsp;処理中にエラーが発生しました</SubTitle>
            <div className={classes.content}>
                <p>一時的に負荷がかかりすぎちゃってエラーが起きたのかもしれないので、時間を置いてやりなおしてみて下さい。祈りましょう。</p>
                <p>何度やってもずっと改善しない場合、それはきっとバグかもしれません。諦めましょう。ごめんね。</p>
            </div>
        </div>),
    }

    function render(data: {[key:number]: React.ReactElement}, status: number): React.ReactElement {
        if(data.hasOwnProperty(status)) {
            return data[status];
        }
        return data[500];
    }

    if (props.isPage) {
        return render(htmlError, props.status)
    }

    return render(jsonError, props.status)
}
