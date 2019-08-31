import {AvaterState} from "../app/index/avater/state";
import * as React from "react";
import {NotebookPage} from "./notebookPage";
import {FetchError, UrlFetch} from "../client/fetch";
import {User, UserModel} from "./user";
import Session from "../utils/session";
import {toDatetimeString} from "../utils/dateformat";
import Linkify from 'react-linkify'
import {Link} from "@material-ui/core";

export interface Notebook {
    account?: User;
    id? : string;
    title: string;
    category: string;
    description: string;
    image: string;
    imageUrl: string;
    adult: boolean,
    items: string[];
    pages: number;
    editable: string;
    private : boolean;
    createdAt: number;
}

export const defaultNotebook: Notebook = {
    id: '',
    title: '',
    category: 'none',
    description: '',
    image: '',
    imageUrl: '',
    adult: false,
    items: ['','',''],
    editable: 'self',
    pages: 0,
    private: false,
    createdAt: 0,
}

export function isNotebook(arg: any): arg is Notebook {
    return arg !== null &&
        typeof arg === "object" &&
        typeof arg.adult === "boolean"
}

export class NotebookModel {
    private book:Notebook;

    constructor(book: Notebook) {
        this.book = book;
    }

    hasImage(): boolean {
        return this.book.imageUrl && this.book.imageUrl.length > 0;
    }

    canAddChart(): boolean {
        const session = new Session();
        if (this.book.editable === 'all') {
            return true;
        }
    }

    deleteNote(callback: (error: FetchError) => void) {
        if (this.book.id === "") {
            callback(null);
            return;
        }
        UrlFetch.instance.delete(this.getUrl(""), callback);
    }

    dateString(): string {
        return toDatetimeString(this.book.createdAt)
    }

    author(): UserModel {
        return new UserModel(this.book.account);
    }

    image() {
        return this.book.imageUrl;
    }

    isPublic() {
        return this.book.private === false;
    }

    notebook() {
        return this.book;
    }

    description() {
        return this.book.description.split("\n").map((elem, key) => {
            return (
                <p key={"description-" + key}>
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
        });
    }

    getUrl(suffix: string): string {
        const joins = [this.book.account.id , "notebooks" , this.book.id]
        if(suffix.length > 0) {
            joins.push(suffix);
        }
        return "/" + joins.join("/")
    }

    fetchPages(callback: (state: NotebookPage[], error: FetchError) => void) {
        UrlFetch.instance.get(this.getUrl("pages/instances.json"), (json: any, error: FetchError) => {
            const res: NotebookPage[] = json ? json as NotebookPage[] : [];
            callback(res, error);
        });
    }

}