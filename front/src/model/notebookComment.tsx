import {NotebookPage, NotebookPageModel} from "./notebookPage";
import Session from "../utils/session";
import {string} from "prop-types";
import {RadarItem} from "../app/common/radar";
import {FetchError, UrlFetch} from "../client/fetch";
import {User, UserModel} from "./user";
import {toDatetimeString} from "../utils/dateformat";
import Linkify from "react-linkify";
import {Link} from "@material-ui/core";
import * as React from "react";

export interface NotebookComment {
    commentId: string
    postId: number
    author: Author
    evaluates: boolean
    values: number[],
    likes: number,
    isLike: boolean,
    comment: string,
    disabled: boolean,
    created: number,
    hasComment: boolean,
    isNew: boolean
}

export interface Author {
    authorId: string
    name: string
    image: string
}

export function asUser(author: Author):User {
    return {
        id: author.authorId,
        name: author.name,
        image: author.image
    }
}

export interface CommentsResponse {
    comments: NotebookComment[],
    next: string
}

export class NotebookCommentModel {
    private page: NotebookPage;
    private comment: NotebookComment;

    constructor(comment: NotebookComment, parent: NotebookPage) {
        this.comment = comment;
        this.page = parent;
    }

    data(): NotebookComment {
        return this.comment;
    }

    parent(): NotebookPage {
        return this.page;
    }

    changeComment(comment: string) {
        this.comment.comment = comment;
        this.comment.hasComment = this.hasComment();
    }

    update(callback: (comment: NotebookComment, error: FetchError) => void): void {
        const model = new NotebookPageModel(this.page);
        const url = model.getUrl("/comments/" + this.comment.commentId);
        UrlFetch.instance.put(url, this.comment, (json: any, error: FetchError) => {
            if(error) {
                callback(null, error);
                return;
            }
            callback(json as NotebookComment, null);
        });
    }

    comments() {
        return this.comment.comment.split("\n").map((elem, key) => {
            return (
                <p key={"page-description-" + key}>
                    <Linkify componentDecorator={(href:string, text:string, key: number) => {
                        if(href.endsWith(".png") || href.endsWith(".jpg") || href.endsWith(".jpeg")) {
                            return (
                                <img src={href} style={{width:"50%"}} />
                            )
                        }
                        return (
                            <Link target="_blank" key={key} href={href}>{text}</Link>
                        )
                    }}>
                        {elem}
                    </Linkify>
                </p>
            )
        })
    }

    author(): UserModel {
        return new UserModel({
            id: this.comment.author.authorId,
            name: this.comment.author.name,
            image: this.comment.author.image
        })
    }

    delete(callback: (error: FetchError) => void) {
        const model = new NotebookPageModel(this.page);
        const url = model.getUrl("/comments/" + this.comment.commentId);
        UrlFetch.instance.delete(url, callback);
    }

    average(): number {
        const length = this.comment.values.length;
        if (length === 0 ) {
            return 0;
        }
        return Math.round((this.comment.values.reduce((a,b) => a + b) / length) * 10) / 10;
    }

    dateString(): string {
        return toDatetimeString(this.comment.created);
    }

    items(): RadarItem[] {
        return this.page.items.map((elem, i) => {
            const e = elem.name;
            if (this.comment.values) {
                const val: number = this.comment.values.length > i ? this.comment.values[i] : 0;
                return {name: e, value: val};
            }
            return {name: e, value: 0};
        })
    }

    isEnabled(): boolean {
        return this.comment.disabled === false;
    }

    hasComment(): boolean {
        return this.isEnabled() && this.comment.comment.length > 0;
    }

    hasChart(): boolean {
        return this.isEnabled() && this.comment.evaluates;
    }

    hasBoth(): boolean {
        return this.hasComment() && this.hasChart();
    }
}

export function createNotebookComment(): NotebookComment {
    const sessId = new Session().getCommentId()
    return {
        commentId: '',
        postId: 0,
        author: {
            authorId: sessId === '' ? 'unknown' : sessId,
            name: '',
            image: ''
        },
        values: [],
        evaluates: false,
        likes: 0,
        isLike: false,
        comment: '',
        disabled: false,
        created: 0,
        hasComment: false,
        isNew: true
    }
}