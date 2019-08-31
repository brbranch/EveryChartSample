import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";
import LazyLoad from "react-lazyload";

interface OwnProps {
    className?: string;
    onLoad?: () => void;
    once?: boolean
    height?: number
}

const useStyles = makeStyles((theme: Theme) => createStyles({

}));

const InternalLazyLoader: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const [isLoad, setLoad] = React.useState(false);

    if (!isLoad && props.onLoad) {
        props.onLoad();
        setLoad(true);
    }
    return (
        <div className={props.className}>
            {props.children}
        </div>
    )
}


export const LazyLoader: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <LazyLoad once={props.once} height={props.height}>
            <InternalLazyLoader {...props}/>
        </LazyLoad>
    )
}
