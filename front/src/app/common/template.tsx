import * as React from "react";
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button/Button";
import {PropsWithChildren} from "react";

interface OwnProps {
}

const useStyles = makeStyles((theme: Theme) => createStyles({

}));


export const XXXPanel: React.FC<OwnProps> = (props: PropsWithChildren<OwnProps>) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (<div></div>)
}
