import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren, useState} from "react";
import {Collapse} from "@material-ui/core";
import {LazyLoader} from "./lazyLoader";

interface OwnProps {
    show?: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root : {
        marginLeft: "10px",
        position: "relative",
        padding: "16px",
        borderRadius: "5px",
        marginBottom: theme.spacing(1),
        background: "rgba(255,160,50,0.87)",
        color: "rgb(146, 75, 10)",

        '&:after' : {
            position: "absolute",
            width: 0,
            height: 0,
            left: 0,
            top: "-19px",
            marginLeft: "10px",
            border: "solid transparent",
            borderColor: "rgba(51, 204, 153, 0)",
            borderBottomColor: "rgba(255,160,50,0.87)",
            borderWidth: "10px",
            pointerEvents: "none",
            content: '" "',
        }
    },
}));


export const AllowBox: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [test, setTest] = useState(false)

    if (!props.show) {
        return (
            <div></div>
        )
    }


    return (
        <LazyLoader onLoad={() => {
            setInterval(()=> {
                setTest(true);
            },300)
        }}>
            <Collapse in={test}>
                <div className={classes.root}>
                    {props.children}
                </div>
            </Collapse>
        </LazyLoader>
    )
}
