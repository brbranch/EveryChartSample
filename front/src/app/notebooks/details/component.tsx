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
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import MenuItem from "../../common/menuitem";
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import {Container, Grid, Paper, Button, Link, Fab, Breadcrumbs} from "@material-ui/core";
import { Route, Switch } from 'react-router-dom';
import {Actions} from "./container";
import {NotebookDetailState} from "./state";
import {NotebookModel} from "../../../model/notebook";
import {NotebookPage, NotebookPageModel} from "../../../model/notebookPage";
import {RadarChart} from "../../common/radar";
import {Permission} from "../../../model/permission";
import {ShareLink} from "../../common/sharelink";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {RadarIcon} from "../../common/radarIcon";
import {LogoPanel} from "../../common/logoPanel";
import {PagePanels} from "../../common/pagePanel";
import {Title} from "../../common/title";
import {CustomPage} from "../../common/customPage";
import {Notice} from "../../common/notice";
import {TopPanel} from "../../common/toppanel";
import Session from "../../../utils/session";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        container : {
            padding: 0
        },
        button : {
            width: "100%",
            fontWight: "bold",
            color: "#fff",
        },
        imageDiv: {
            textAlign: "center",
        },
        image : {
            maxWidth: "90%",
            border: "solid 1px #ccc",
            background: "#fff",
            boxShadow: "0 0 5px #777",
        },
        share: {
            margin: theme.spacing(1.5),
        },
        editButton: {
            color: "#fff",
        },
        addButton: {
            position: "absolute",
            bottom: -theme.spacing(2),
            right: theme.spacing(0),
            color: "#fff",
            zIndex: 2
        },
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
            background: "#ffeaa3",
            padding: theme.spacing(2.0),
        },
        breadcrumbs : {
            marginLeft: theme.spacing(1),
            marginBottom: theme.spacing(1)
        },
        authorInfo : {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        notice: {
            margin: theme.spacing(1.5),
        },
        addArea: {
            textAlign: "center",
            padding: theme.spacing(1.5)
        },
        addContainer : {
            background: "#fff",
            border: "solid 2px #f82",
            borderRadius: "5px",
            padding: theme.spacing(1),
            '& .image' : {
                maxWidth: "100px",
                border: "solid 1px #ccc",
                borderRadius: "5px",
                padding: theme.spacing(2),
                background: "#afdeb0"
            },
            '& .image img' : {
                width: "100%"
            },
            '& .content': {
                paddingLeft: theme.spacing(1),
                textAlign: "left"
            }
        },
    }),
);

interface Props {}

type OwnProps = Props & Actions & NotebookDetailState;

export const Component: React.FC<OwnProps> = (props: OwnProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const model = new NotebookModel(props.notebook);
    const [done, setDone] = React.useState(false);
    const permission = new Permission(props.notebook);
    const session = new Session();

    if (done === false) {
        props.getPages(props.notebook, () => {
            setDone(true);
        });
    }

    const progress = done ? '' : <div>取得中</div>;

    function showPages() {
        if (props.pages == null) {
            return;
        }

        if (props.pages.hasData()) {
            return (
                <div>
                    <PagePanels
                        pages={props.pages.list()}
                        showNext={props.pages.hasNext()}
                        onClickNext={() => {props.nextPages(props.pages);}}
                        showRank
                    />
                </div>
            );
        }

        if(permission.hasCreatePermission() === false || done === false) {
            return (<div></div>);
        }

        return (
            <Button href={model.getUrl("pages/new")} aria-label="Add">
                <LogoPanel text={"推しの評価を作成しちゃおう"}></LogoPanel>
            </Button>
        )
    }

    function showImage() {
        if (model.hasImage()) {
            return (
                <div className={classes.imageDiv}>
                    <img src={model.image()} className={classes.image}/>
                </div>
            )
        }
    }

    function edit() {
        if(permission.hasEditPermission()) {
            return <Button href={model.getUrl("edit")} color="primary" className={classes.editButton} aria-label="Edit">|<EditIcon/>&nbsp;編集</Button>
        }
    }

    function accountLink() {
        if(permission.isOwner()) {
            return (
                <Link href={"/home"}>ホーム</Link>
            )
        }
        return (<Link href={"/" + props.notebook.account.id }>{props.notebook.account.name}</Link>);
    }

    function evalTitle() {
        return "評価一覧";
    }
    
    function privateIcon() {
      if (model.isPublic() === false) {
          return (
              <FontAwesomeIcon icon={['fas' , 'user-lock']}/>
          )
      }
    }

    function showSharePanel() {
        if (model.isPublic()) {
            return (<ShareLink
                key="share"
                className={classes.share}
                title="この一覧をシェア"
                path={model.getUrl("")}
                shareText={props.notebook.title + "の評価リスト (by " + props.notebook.account.name + ")"}/>)
        }
        return (
            <Notice className={classes.notice}>
                現在非公開設定となっているためこのノートは公開されません。
            </Notice>
        )
    }

    function showAddFab() {
        if (permission.hasCreatePermission()) {
            return (
                <Fab href={model.getUrl("pages/new")} color="secondary" className={classes.addButton} aria-label="Add">
                    <AddIcon/>
                </Fab>
            )
        }
    }

    function showCreateButton() {
        if (permission.isOwner()) {
            return (
                <div className={classes.addArea}>
                    <Button className={classes.button} variant="contained" color="primary" href={model.getUrl("pages/new")}>
                        <AddIcon/>&nbsp;新しい評価を作成
                    </Button>
                </div>
            )
        }
        if (permission.hasCreatePermission()) {
            return (
                <div className={classes.addArea}>
                    <Grid className={classes.addContainer} wrap="nowrap"container direction="row" justify="flex-start" alignItems="center">
                        <Grid item className="image">
                            <img src="/static/images/addlogo.png" />
                        </Grid>
                        <Grid item xs className="content">
                            <p>
                            ここだけの話、 このノートは誰でもページを投稿できるんです。
                            </p>

                            <Button className={classes.button} variant="contained" color="primary" href={model.getUrl("pages/new")} >
                                <AddIcon/>&nbsp;新しい評価を作成
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )
        }

        if (permission.isCreateOwnerOnly() === false) {
            return (
                <div className={classes.addArea}>
                    <Grid className={classes.addContainer} style={{marginBottom: theme.spacing(1)}} wrap="nowrap"container direction="row" justify="flex-start" alignItems="center">
                        <Grid item className="image">
                            <img src="/static/images/addlogo.png" />
                        </Grid>
                        <Grid item xs className="content">
                            <p>
                                ここだけの話、 このノートはログイン者は誰でもページを投稿できるんです。
                            </p>
                            <Button className={classes.button} variant="contained" color="primary" href={"/top"} >
                                5秒で登録＆投稿しよう
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            )
        }
    }

    return (
            <Container maxWidth={"md"} className={classes.container} fixed>
                <div className={classes.breadcrumbs}>
                    <Breadcrumbs maxItems={2} separator="›">
                        {accountLink()}
                        <Typography color="textPrimary">ノート</Typography>
                    </Breadcrumbs>
                </div>
                <Title>
                    {props.notebook.title}&nbsp;
                    {privateIcon()}
                    {edit()}
                </Title>
                <Grid container className={classes.authorInfo} direction="row" wrap="nowrap" justify="space-between" alignItems="center">
                    <Grid item>
                        {model.author().chip(false)}
                    </Grid>
                    <Grid item>
                        {model.dateString()}
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={6} lg={5}>
                        {showImage()}
                        <CustomPage title="詳細">
                            {model.description()}
                        </CustomPage>
                        {showSharePanel()}
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={7}>
                        <Title>
                            {evalTitle()}
                            {showAddFab()}
                        </Title>
                        {progress}
                        {showPages()}
                        {showCreateButton()}
                    </Grid>
                </Grid>
            </Container>
    );
}
