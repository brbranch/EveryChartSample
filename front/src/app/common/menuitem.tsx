
import InfoIcon from '@material-ui/icons/Info'
import * as React from "react";
import {ListItem, ListItemText, SvgIcon} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import {Link} from "react-router-dom";
import {SvgIconProps} from "@material-ui/core/SvgIcon/SvgIcon";
import {MenuItemProps} from "@material-ui/core/MenuItem";


export interface MenuItemProp {
    to : string,
    click : () => void,
    icon  : React.ReactElement,
    text : string
}

export default class MenuItem extends React.Component<MenuItemProp> {
    render() {
        return (
            <ListItem button component={Link} to={this.props.to} onClick={this.props.click}>
                <ListItemIcon>
                    {this.props.icon}
                </ListItemIcon>
                <ListItemText primary={this.props.text} />
            </ListItem>
        )
    }
}

