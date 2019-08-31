import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";
import clsx from 'clsx'

interface OwnProps {
    num: number
    title?: string
    className?: string
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        filter: "drop-shadow(3px 3px 5px rgba(0,0,0,0.4));"
    },
    cls0: {
        opacity: 0.2
    },
    cls1: {
    },
    cls2: {
    },
    cls3: {
        fontSize: "45.6px",
        fontFamily: "Arial-BoldMT, Arial",
        fontWeight: 700
    }
}));

interface RankColor {
    fill: string,
    stroke: string,
    font: string
}

export const RankStar: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const className = props.className ? clsx(props.className, classes.root) : classes.root;
    const transformX = props.num >= 10 ? 24.5 : 36.5;

    const colors : {[key:number]:RankColor} = {
        1: {
            fill: "#ffe644",
            stroke: "#e08a00",
            font: "#825330"
        },
        2: {
            fill: "#e5e5e5",
            stroke: "#727272",
            font: "#666666"
        },
        3: {
            fill: "#d6a685",
            stroke: "#8e5e1e",
            font: "#472e1c"
        },
        4: {
            fill: "#f7931e",
            stroke: "#895106",
            font: "#ffffff"
        }
    }

    const color = props.num > 4 ? colors[4] : colors[props.num];
    const title = props.title || "ranking " + props.num;

    return (
        <svg className={className} id="RankLayer" width={50} height={50} data-name="RankLayer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <defs>
                <linearGradient id={"g1"} gradientTransform={"rotate(45)"}>
                    <stop offset="0" stopColor={color.fill}/>
                    <stop offset="1" stopColor={color.stroke}/>
                </linearGradient>
            </defs>
            <title>{title}</title>
            <path className={classes.cls1} style={{fill: color.fill}} d="M72.58,87.53a3.29,3.29,0,0,1-.54,0L50.72,83.34a3.74,3.74,0,0,0-1.44,0L28,87.48a3.29,3.29,0,0,1-.54,0,2.79,2.79,0,0,1-2.76-2.45L22,63.52a3.75,3.75,0,0,0-.45-1.37L11,43.15a2.8,2.8,0,0,1,1.26-3.88L32,30.08a3.52,3.52,0,0,0,1.17-.85L48,13.36a2.78,2.78,0,0,1,4.08,0L66.86,29.23a3.52,3.52,0,0,0,1.17.85l19.68,9.19A2.8,2.8,0,0,1,89,43.15l-10.52,19A3.75,3.75,0,0,0,78,63.52L75.34,85.08a2.79,2.79,0,0,1-2.76,2.45Z"/>
            <path className={classes.cls0} fill={"url(#g1)"} d="M72.58,87.53a3.29,3.29,0,0,1-.54,0L50.72,83.34a3.74,3.74,0,0,0-1.44,0L28,87.48a3.29,3.29,0,0,1-.54,0,2.79,2.79,0,0,1-2.76-2.45L22,63.52a3.75,3.75,0,0,0-.45-1.37L11,43.15a2.8,2.8,0,0,1,1.26-3.88L32,30.08a3.52,3.52,0,0,0,1.17-.85L48,13.36a2.78,2.78,0,0,1,4.08,0L66.86,29.23a3.52,3.52,0,0,0,1.17.85l19.68,9.19A2.8,2.8,0,0,1,89,43.15l-10.52,19A3.75,3.75,0,0,0,78,63.52L75.34,85.08a2.79,2.79,0,0,1-2.76,2.45Z"/>
            <path className={classes.cls2} style={{fill: color.stroke}} d="M50,13a2.25,2.25,0,0,1,1.67.73L66.49,29.58a4.52,4.52,0,0,0,1.33,1l19.67,9.18a2.22,2.22,0,0,1,1.21,1.37,2.27,2.27,0,0,1-.17,1.82L78,61.91a4.23,4.23,0,0,0-.51,1.55L74.85,85a2.3,2.3,0,0,1-2.27,2,3.13,3.13,0,0,1-.44,0L50.82,82.85a4.24,4.24,0,0,0-1.64,0L27.86,87a3.13,3.13,0,0,1-.44,0,2.3,2.3,0,0,1-2.27-2L22.5,63.46A4.23,4.23,0,0,0,22,61.91l-10.52-19a2.27,2.27,0,0,1-.17-1.82,2.22,2.22,0,0,1,1.21-1.37l19.67-9.18a4.52,4.52,0,0,0,1.33-1L48.32,13.7A2.29,2.29,0,0,1,50,13m0-1a3.28,3.28,0,0,0-2.41,1L32.78,28.89a3.38,3.38,0,0,1-1,.74L12.08,38.82a3.28,3.28,0,0,0-1.48,4.57l10.52,19a3.38,3.38,0,0,1,.38,1.19l2.66,21.56A3.3,3.3,0,0,0,27.42,88a3.36,3.36,0,0,0,.63-.06l21.32-4.14a3.34,3.34,0,0,1,1.26,0L72,88a3.36,3.36,0,0,0,.63.06,3.3,3.3,0,0,0,3.26-2.89L78.5,63.58a3.38,3.38,0,0,1,.38-1.19l10.52-19a3.28,3.28,0,0,0-1.48-4.57L68.24,29.63a3.38,3.38,0,0,1-1-.74L52.41,13A3.28,3.28,0,0,0,50,12Z"/>
            <text className={classes.cls3} style={{fill: color.font}} transform={"translate("+ transformX + ", 68.78)"}>{props.num}</text>
        </svg>
    )
}
