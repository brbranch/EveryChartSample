import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import EditIcon from '@material-ui/icons/Edit'
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home'
import {
    Container,
    Grid,
    Paper,
    Button,
    CardMedia,
    Fab,
    Link,
    Card,
    CardContent,
    CardActions
} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import {Notebook, NotebookModel} from "../../../model/notebook";
import Session from "../../../utils/session";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign:"left",
            marginBottom: theme.spacing(1),
        },
        boxRoot: {
            position: "relative"
        },
        card: {
            marginTop: theme.spacing(1.5),
            width: "100%",
            position: "relative",
            justifyContent: "space-between",
            borderRadius: "5px 5px 5px 5px",
            border: "1px solid #ccc",
            minHeight: "120px",
            boxShadow: "none",
            zIndex: 1,
            padding: theme.spacing(1),
            [theme.breakpoints.down('sm')] : {
                borderRadius: "5px 5px 5px 5px",
            },
            '&:hover' : {
                background: "#ccc"
            }
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        overflowCard: {
        },
        cardTitle: {
            fontWeight: 900,
            color: "#ff6632"
        },
        cardDetail: {
            color: "#666",
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1)
        },
        content: {
            padding: theme.spacing(1),
            '&:last-child' : {
                padding: theme.spacing(1)
            }
        },
        button: {
            position: "absolute",
            top: -theme.spacing(1),
            right: -theme.spacing(2),
            color: "#fff"
        },
        nextButton: {
            width: "100%",
            textAlign: "center",
        },
        defaultImage : {
            position: "absolute",
            width: "200px",
            right: "-30px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.25,
            zIndex: -1
        },
        labelR18: {
            fontSize: "0.6em",
            color: "white",
            background: "red",
            borderRadius: "5px",
            padding: "2px 5px",
            marginLeft: theme.spacing(0.5)
        }
    }),
);

interface Props {
    books: Notebook[]
    showNext: boolean
    onClickNext?: () => void;
    showEdit: boolean
    disabled?: boolean
    chips? : boolean
}

type OwnProps = Props;

export const NotebookList : React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const showEdit = props.showEdit || false;
    const session = new Session();
    const disable = props.disabled || false;
    const chips = props.chips === undefined ? true : props.chips;

    function showText(text:string, maxLength: number) {
        if(text.length <= maxLength) {
            return text;
        }
        return text.substr(0, maxLength - 1) + "...";
    }

    function renderNoteImage(book: Notebook, key: number) {
        if (book.imageUrl.length) {
            return (
                <div><img className={classes.defaultImage} src={book.imageUrl}/></div>
            );
        }
        const images = (key % 5) + 1;

        return (
            <div><img className={classes.defaultImage} src={"/static/images/logo"+ images +".png"}/></div>
        )
    };

    function renderEditButton(book :Notebook) {
        if(showEdit && session.isLoggedIn() && book.account.id === session.getId()) {
            return (
                <Fab href={"/" +  book.account.id + "/notebooks/" + book.id + "/edit"} className={classes.button} color="primary" aria-label="Edit">
                    <EditIcon fontSize="small" />
                </Fab>
            )
        }
    }

    function r18(book: Notebook) {
        if (book.adult) {
            return <span className={classes.labelR18}>R18</span>
        }
    }

    function showPrivate(book: Notebook) {
        if(book.private) {
            return <span className={classes.labelR18}><FontAwesomeIcon icon={['fas', 'lock']} /></span>
        }
    }

    function renderTableRow(book : Notebook, idx: number) {
        const model = new NotebookModel(book);
        return (
            <div key={idx} className={classes.boxRoot}>
                <Link underline="none" href={"/"+ book.account.id +"/notebooks/" + book.id}>
                    <Card className={classes.card} >
                        {renderNoteImage(book, idx)}
                        <CardContent className={classes.content}>
                            <Typography component="h6" variant="h6" className={classes.cardTitle}>
                                {showText(book.title, 20)}{showPrivate(book)}{r18(book)}
                            </Typography>
                            <div className={classes.cardDetail}>
                                {showText(book.description, 50)}
                            </div>
                        </CardContent>
                        <CardActions>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Grid item>
                                    {chips ? model.author().chip(true, true) : undefined}
                                </Grid>
                                <Grid item>
                                    {model.dateString()} 作成&nbsp;
                                    <FontAwesomeIcon icon={['fas', 'file-alt']}/>&nbsp;{book.pages}
                                </Grid>
                            </Grid>
                        </CardActions>
                    </Card>
                </Link>
            </div>
        );
    };

    function showNextButton() {
        if(props.showNext) {
            return (
                <Button disabled={disable} className={classes.nextButton} onClick={props.onClickNext}>更に読み込む</Button>
            )
        }
    }

    return (
        <div className={classes.root}>
            <div>
                {props.books.map((e, i) => { return renderTableRow(e, i)} )}
            </div>
            {showNextButton()}
        </div>
    );
}
