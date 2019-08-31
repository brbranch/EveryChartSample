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
        '& p': {
            margin: theme.spacing(1),
            lineWidth: theme.spacing(1)
        },
        '& ol': {
            marginLeft: theme.spacing(1.5),
            paddingLeft: theme.spacing(1.5)
        },
        '& li': {
            marginTop: theme.spacing(2)
        }
    },
    eof: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }
}));


export const PrivacyPolicy : React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    return (
        <div>
            <Container maxWidth="md" fixed>
                <Title>プライバシーポリシー</Title>
                <Paper className={classes.content}>
                    <p>
                        EveryChart（以下「本サービス」といいます。）は、利用者のプライバシー保護を重要なものとして考えており、以下の方針で管理を行います。
                    </p>
                    <SubTitle>1.登録情報について</SubTitle>
                    <p>
                        本サービスでは、以下の個人情報を保持します。
                        <ol>
                            <li>Twitterでユーザーが利用するアカウントIDおよび、Twitterのプライバシー設定によりユーザーが開示を認めた情報</li>
                            <li>投稿時の発信元アドレス</li>
                        </ol>
                    </p>
                    <SubTitle>2.個人情報の利用目的</SubTitle>
                    <p>
                        本サービスは、取得した個人情報を下記の目的の範囲内で利用いたします。
                        <ol>
                            <li>本サービスへのログインに伴う本人確認のため</li>
                            <li>匿名で投稿する際の利用者識別のため</li>
                            <li>本サービス全般の機能の提供のため</li>
                            <li>お客様のサービス利用状況に関する調査、統計、分析のため</li>
                            <li>不具合によるお問い合わせ時の対応のため</li>
                        </ol>
                    </p>
                    <SubTitle>3.個人情報の提供</SubTitle>
                    <p>
                        本サービスは、公的機関により法令に基づいた要請があった場合に限り、保持しているデータを第三者に提供します。
                    </p>
                    <SubTitle>4.免責事項</SubTitle>
                    <p>
                        本プライバシーポリシーには、本サービスの<Link href="/top/terms">利用規約</Link>と同様の免責事項が適用されます。
                    </p>
                    <SubTitle>5.プライバシーポリシーの改定</SubTitle>
                    <p>
                        本サービスは、個人情報保護上の必要に応じて、本サービスでの告知ののち、本プライバシーポリシーを改定する場合があります。
                    </p>
                    <div className={classes.eof}>最終更新日: 2019/08/12</div>
                </Paper>
            </Container>
        </div>
    )
}
