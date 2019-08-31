import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";

interface OwnProps {
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
            root: {},
            title: {
                textAlign:"left",
                background:"#f82",
                fontWeight: 700,
                fontSize: "1.5em",
                position: "relative",
                color: "white",
                borderRadius: "5px",
                padding: theme.spacing(0.5),
                paddingLeft: theme.spacing(1),
                marginBottom: theme.spacing(1.5),
                width: "100%",
            },
        }
    ));

export const Title: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className={classes.title}>
            {props.children}
        </div>
    )
}
