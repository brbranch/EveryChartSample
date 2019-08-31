import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";

interface OwnProps {
    title: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        descriptionArea: {
            borderRadius: "5px",
            border: "2px solid #fa4",
            background: "#fa4",
            marginLeft: theme.spacing(1.5),
            marginRight: theme.spacing(1.5),
            marginBottom: theme.spacing(1.5),
            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",


        },
        descriptionTitle: {
            borderRadius: "5px 5px 0px 0px",
            background: "#fa4",
            color: "#fff",
            fontSize: "1.2em",
            fontWeight: 900,
            padding: theme.spacing(1),
        },
        description: {
            background: "#fff",
            padding: theme.spacing(1),
            wordBreak: "break-all"
        },
        }
    ));

export const CustomPage: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className={classes.descriptionArea}>
            <div className={classes.descriptionTitle}>
                {props.title}
            </div>
            <div className={classes.description}>
                {props.children}
            </div>
        </div>
    )
}
