import * as React from 'react'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {Box, Grid, IconButton, Snackbar} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import CloseIcon from '@material-ui/icons/Close'
import {SyntheticEvent} from "react";

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
        },
        close: {
            padding: theme.spacing(0.5),
        }
    })
);

interface Props {
}

export const Toast: React.FC<Props> = (props) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [open, setOpen] = React.useState(false)
    const {children} = props;

    function handleClose(event?: SyntheticEvent, reason?: string) {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{children}</span>}
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>,
            ]}
        />
    )
}
