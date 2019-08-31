import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";

interface OwnProps {
    text: string
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        newEvaluate: {
            background: "#fff",
            border: "solid 1px #ccc",
            borderRadius: "5px",
            margin: theme.spacing(1.5),
            padding: theme.spacing(1.0),
            boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
            textAlign: "center"
        },
        newEvaluateImage: {
            borderRadius: "5px",
            padding: theme.spacing(2.0),
        },
    }
));

export const LogoPanel: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const logo = Math.floor(Math.random() * Math.floor(5)) + 1;
    const colors = ["#ffeaa3", "#d0eac1", "#c1eae0" , "#f4d9f1"][Math.floor(Math.random() * 4)];

    return (
        <div className={classes.newEvaluate}>
            <div>
                <div className={classes.newEvaluateImage} style={{
                    background: colors,
                }}>
                    <img src={"/static/images/logo"+ logo +".png"} width="50%" height="50%"
                         style={{
                             filter: "drop-shadow(0px 0px 8px rgba(0,0,0,.3)",
                         }}/>
                </div>
                <p>{props.text}</p>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}
