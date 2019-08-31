import * as React from 'react'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {Box, Grid} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#fff3cd",
            color: "#5f3c36",
            fontWeight: 400,
            border: "1px solid #ffddba"
        },
        container: {
            padding: theme.spacing(2),
        },
        icon: {
            fontSize: "1.5em",
            color: "#d8ab28",
            paddingRight: "18px",
        },
        content: {
            maxWidth: "calc(100% - 30px)"
        }
    })
);

interface Props {
    className?: string
}

export const Notice: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const {children} = props;

    return (
        <div className={props.className}>
            <Box borderRadius="borderRadius" className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    className={classes.container}
                >
                    <Grid item className={classes.icon}>
                        <FontAwesomeIcon icon='exclamation'/>
                    </Grid>
                    <Grid item className={classes.content}>
                        <strong>{children}</strong>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}
