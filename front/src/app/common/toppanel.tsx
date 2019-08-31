import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";
import Session from "../../utils/session";
import {Title} from "./title";
import {Link, Paper} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface OwnProps {
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        textAlign: "center"
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
    }
}));


export const TopPanel: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const session = new Session();

    return (<div className={classes.root} {...props}>
        <div>↓きっと5秒くらいで登録できるよ↓</div>
        <Button variant="contained" href={"/auth/twitter/" + session.getCommentId()} size="medium" className={classes.twitter}><FontAwesomeIcon icon={['fab', 'twitter']}/>&nbsp;Twitterで登録/ログイン</Button>
        <div className={classes.notice}>
            ※ <Link href="/top/terms">利用規約</Link>と<Link href="/top/policy">プライバシーポリシー</Link>に同意の上ご利用下さい
        </div>
        <Title>EveryChartって？</Title>
        <Paper className={classes.whatEveryChart}>
            <div>
                <img src="/static/images/desc1.png" width="90%" alt="好きな評価を作れるサービスです" />
            </div>
            <div>
                <p><strong>なんでもランク付けしちゃおう</strong></p>
                <p>好きな料理も読んだ本の感想も、なんでもレーダーチャートでランク付けできます。</p>
            </div>
        </Paper>

        <Paper className={classes.whatEveryChart}>
            <div>
                <img src="/static/images/desc2.png" width="90%" alt="みんなの投票がチャートに反映されます。" />
            </div>
            <div>
                <p><strong>好きなものをみんなで評価</strong></p>
                <p>チャートを公開すると、みんなで口コミ評価をすることができます。</p>
            </div>
        </Paper>
        <div>↓たぶん5秒ちょいで登録できると思う↓</div>
        <Button variant="contained" href={"/auth/twitter/" + session.getCommentId()} size="medium" className={classes.twitter}><FontAwesomeIcon icon={['fab', 'twitter']}/>&nbsp;Twitterで登録/ログイン</Button>
        <div className={classes.notice}>
            ※ <Link href="/top/terms">利用規約</Link>と<Link href="/top/policy">プライバシーポリシー</Link>に同意の上ご利用下さい
        </div>
    </div>)
}
