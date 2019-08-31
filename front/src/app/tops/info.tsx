import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";
import {Title} from "../common/title";
import {Container, Link, Paper} from "@material-ui/core";
import {SubTitle} from "../common/subtitle";

interface OwnProps {
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    content : {
        margin: theme.spacing(1.5),
        padding: theme.spacing(1),
        borderRadius: "5px",
        border: "2px solid #f82",
        '& p': {
            margin: theme.spacing(1),
            lineWidth: theme.spacing(1)
        },
        '& ul': {
            marginLeft: theme.spacing(1.5),
            paddingLeft: theme.spacing(2.0)
        },
        '& li': {
            marginTop: theme.spacing(1)
        }
    },
    eof: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    title: {
        fontWeight: 900,
        fontSize: "1.1em"
    },
    date: {
        color: "#999"
    },
    details: {
        lineHeight: "130%",
    }
}));


export const Information : React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div>
            <Container maxWidth="md" fixed>
                <Title>お知らせ</Title>
                <Paper className={classes.content}>
                    <div className={classes.title}>
                        EveryChart (v0.9.0) をリリースしました！
                    </div>
                    <div className={classes.details}>
                        <p>
                            自分だけの口コミ評価を作れるサービスとして EveryChart のv0.9.0をリリースしました〜！
                        </p>
                        <p>
                            EveryChartは、自分の行きつけのお店とか、好きな漫画とかキャラとか自分の創作物といったものを自分なりにランク付けしたり、他の人達にも投票してもらったりして楽しむというサービスです。もともとは自分の飲んだお酒や、ハマってるゲームの最強キャラをランク付けしたいという思いから作りました。
                        </p>
                        <p>
                            まだまだ産声を上げたばかりのサービスで機能も少ないですが、徐々に成長させていけたらと思ってます。
                        </p>
                        <p>
                            ちなみに、みんなに使ってもらえるようなら直近は以下のアップデートを考えてます。
                        </p>
                        <ul>
                            <li>アカウントのフォロー</li>
                            <li>ノートのウォッチ</li>
                            <li>いいねとか押されたことがわかる機能(通知とか)</li>
                        </ul>
                        <p >
                            他にも、要望を受け付けたりするかもです。応援してもらえると嬉しいです！
                        </p>
                    </div>
                    <div className={classes.date}>
                        2019年8月12日 22:23
                    </div>
                </Paper>
            </Container>
        </div>
    )
}
