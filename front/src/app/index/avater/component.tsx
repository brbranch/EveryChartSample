import * as React from 'react';
import SettingIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {Box, Button, Container, Fab, Grid, Link, Paper} from "@material-ui/core";
import Test from '../../../sample/containers/testContainer'
import TestApi from '../../../sample/containers/testApiContainer'
import {AvaterActions} from "./container";
import {AvaterState} from "./state";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Session from "../../../utils/session";
import {AccountLink, AccountType} from "../../../model/account";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            position: "relative"
        },
        button : {
            width: "80%",
            fontWight: 900,
            color: "white",
            margin: theme.spacing(1),
        },
        hr : {
            borderTop: "2px dashed #cccccc"
        },
        settings: {
            position: "absolute",
            color: "#888",
            top: theme.spacing(-1),
            left: theme.spacing(-1)
        }
    }),
);

interface OwnProps {
}

type AvaterProps = OwnProps & AvaterState & AvaterActions;

export const Component: React.FC<AvaterProps> = (props: AvaterProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const session = new Session();

    var twitterAccount = (link: AccountLink, idx:number) => {
        return (
            <div key={idx}><Link href={'https://twitter.com/' + link.account} target="_blank"><FontAwesomeIcon icon={['fab', 'twitter']}/>&nbsp;{"@" + link.account}</Link></div>
        )
    }

    var account = (link: AccountLink, idx: number) => {
        const type: any = link.type;
        if (type === AccountType[AccountType.twitter] as string) {
            return twitterAccount(link, idx);
        }
    }

    var accounts = () => {
        return Object.entries(props.account.links).map((elem, idx) => account(elem[1], idx))
    }

    var settings = () => {
        if(session.isSameAccount(props.account.id)) {
            return (
                <Button href="/home/settings" size="small" aria-label="add" className={classes.settings}>
                    <SettingIcon/>&nbsp;設定
                </Button>
            )
        }
    }

    var showRanking = () => {
        if(session.isSameAccount(props.account.id)) {
            return (
                <React.Fragment>
                    <hr className={classes.hr} />
                    <Button href={"/" + props.account.id + "/notebooks/new"} variant="contained" color="primary" className={classes.button}>ノート作成</Button>
                </React.Fragment>
            )
        }
    }

    return (
        <div className={classes.root}>
            <div>
                <img src={props.account.image} />
            </div>
            <div>
                <Typography variant="h5">
                    {props.account.name}
                </Typography>
            </div>
            {accounts()}
            {settings()}
        </div>
    );
}
