import * as React from "react";
import {Avatar, Button, Chip, Link} from "@material-ui/core";
import {Author} from "./notebookComment";

export interface User {
    id: string
    name: string
    image: string
}

export class UserModel {
    private user : User;

    constructor(user: User) {
        this.user = user;
    }

    isAnonymous(): boolean {
        return this.user.id === '' || this.user.id === 'anonymous';
    }

    chip(small: boolean | undefined, nolink?: boolean | undefined, className?: string) {
        const size = small ? "small" : "medium";

        if (this.isAnonymous()) {
            return (
                <Chip className={className} avatar={<Avatar>匿</Avatar>} size={size} label={this.name()}/>
            )
        }
        if (nolink) {
            return (
                <Chip className={className} avatar={<Avatar src={this.image()} />} variant="outlined" size={size} label={this.name()}/>
            )
        }
        return (
            <Link className={className} style={{textTransform: 'none'}} href={"/" + this.user.id} underline="none">
                <Chip avatar={<Avatar src={this.image()} />} size={size} label={this.name()}/>
            </Link>
        )
    }

    image(): string {
        if(this.isAnonymous()) {
            return '';
        }
        return this.user.image;
    }

    name(): string {
        if(this.isAnonymous()) {
            return '匿名';
        }
        return this.user.name;
    }

};
