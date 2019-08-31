import {defaultNotebook, Notebook, NotebookModel} from "./notebook";
import {RadarItem} from "../app/common/radar";
import {NotebookPageEditState} from "../app/pages/edit/state";
import {FetchError, UrlFetch} from "../client/fetch";
import {asUser, Author, CommentsResponse, NotebookComment, NotebookCommentModel} from "./notebookComment";
import Session from "../utils/session";
import {toDatetimeString} from "../utils/dateformat";
import * as React from "react";
import {UserModel} from "./user";
import Linkify from "react-linkify";
import {Link} from "@material-ui/core";

export interface NotebookPage {
    notebook: Notebook
    author: Author
    id: string
    title: string
    description: string
    image: string
    radarImage: string
    likes: number,
    isLike: boolean,
    items: NotebookPageItem[],
    summaries: NotebookPageSummary[],
    commentCounts: number,
    chartCounts: number,
    posts: number,
    average: number,
    private: boolean,
    comment: boolean,
    evaluate: boolean,
    createdAt: number,
    updatedAt: number,
}

export interface NotebookPageItem {
    name: string
    value: number
}

export interface NotebookPageSummary {
    name: string
    value: number
    count: number
}

const sessId = new Session().getCommentId()

export const defaultNotebookPage: NotebookPage = {
    notebook: {...defaultNotebook},
    author: {
        authorId: sessId === '' ? 'unknown' : sessId,
        name: '',
        image: ''
    },
    id: '',
    title: '',
    description: '',
    image: '',
    radarImage: '',
    likes: 0,
    isLike: false,
    items: [],
    summaries: [],
    commentCounts: 0,
    chartCounts: 0,
    average: 0,
    private: true,
    posts: 0,
    comment: true,
    evaluate: true,
    createdAt: 0,
    updatedAt: 0,
}

export function isNotebookPage(arg: any): arg is NotebookPage {
    return arg !== null &&
        typeof arg === "object" &&
        typeof arg.posts === "number"
}

export class NotebookPageModel extends NotebookModel {
    private page: NotebookPage

    constructor(page: NotebookPage) {
        super(page.notebook);
        this.page = page
    }

    getUrl(suffix: string): string {
        if (this.page.id.length) {
            return super.getUrl("pages/" + this.page.id + suffix)
        }
        return super.getUrl("pages" + suffix)
    }

    getNoteUrl(): string {
        return super.getUrl("");
    }

    author(): UserModel {
        return new UserModel(asUser(this.page.author));
    }

    authorName(): string {
        return this.page.author.name;
    }

    authorImage(): string {
        return this.page.author.image;
    }

    editComment(callback: (comment: NotebookComment, error: FetchError) => void) {
        const session = new Session();
        UrlFetch.instance.get(this.getUrl("/newComment/" + session.getCommentId()) , (json, err) => {
            if (err) {
                callback(null, err);
                return;
            }
            callback(json as NotebookComment, null);
        });
    }

    editEvaluate(callback: (comment: NotebookComment, error: FetchError) => void) {
        const session = new Session();
        UrlFetch.instance.get(this.getUrl("/post/" + session.getCommentId()) , (json, err) => {
            if (err) {
                callback(null, err);
                return;
            }
            callback(json as NotebookComment, null);
        });
    }

    getComments(cursor: string, callback: (resp: CommentsResponse, error: FetchError) => void) {
        let url = this.getUrl("/comments/instances.json");
        if (cursor.length > 0) {
            url += "?cursor=" + cursor;
        }

        UrlFetch.instance.get(url, (json, error) => {
           if (error) {
               callback(null, error);
               return;
           }
           console.log(url, json);
           callback(json as CommentsResponse, null);
        });
    }

    dateString(): string {
        return toDatetimeString(this.page.createdAt);
    }

    hasImage(): boolean {
        return this.page.image && this.page.image.length > 0;
    }

    image(): string {
        return this.page.image;
    }

    descriptionText(max? : number) {
        const tmp = max ? this.page.description.substr(0,max) : this.page.description;
        const description = tmp.length === this.page.description.length ? tmp : tmp + "...";
        return description.split("\n").map((elem, key) => {
            return (
                <p key={"page-desc-" + key}>{elem}</p>
            )
        });
    }

    description() {
        return this.page.description.split("\n").map((elem, key) => {
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
        });
    }

    data(): NotebookPage {
        return this.page;
    }

    canEditLike(): boolean {
        return new Session().isLoggedIn();
    }

    toggleLike(callback: (likes: number, error: FetchError) => void): void {
        const commentId = new Session().getCommentId();
        const url = this.getUrl("/like/" + commentId)
        UrlFetch.instance.post(url, {}, (json, err) => {
            if (err) {
                callback(0, err);
            }
            callback(json.likes as number, err);
        });
    }

    asRadarData(): RadarItem[] {
        return this.page.items;
    }

    average(): number {
        return Math.round(this.page.average * 10) / 10;
    }

    asSummaryData(): RadarItem[] {
        return this.page.summaries.map(e => {
            return {name: e.name, value: e.value}
        });
    }

    appendComment(comment: NotebookComment) {
        this.appendSummary([comment]);
        if (comment.isNew) {
            const model = new NotebookCommentModel(comment, this.page);
            if(model.hasChart()) {
                this.page.chartCounts++
            }
            if(model.hasComment()) {
                this.page.commentCounts++;
            }
        }
    }

    isPublic() {
        return this.page.private === false;
    }

    deletePage(callback: (error: FetchError) => void) {
        if (this.page.id.length === 0) {
            callback(null);
            return;
        }
        UrlFetch.instance.delete(this.getUrl(""), callback)
    }

    removeSummary(comment: NotebookComment): NotebookPageSummary[] {
        const summary = this.page.summaries;
        const res: NotebookPageSummary[] = [];
        summary.forEach((e, i) => {
            let total = e.value * e.count;
            let count = e.count;
            const model = new NotebookCommentModel(comment,this.page);
            if (model.hasChart()) {
                const val = comment.values;
                if (val.length > i) {
                    count--;
                    total -= Math.min(val[i], 5);
                }
            }
            res.push({
                name: e.name,
                value: count === 0 ? 0 : total / count,
                count: count
            });
        });
        this.page.summaries = res;
        this.reCalcAverage();
        return res;
    }

    appendSummary(comments: NotebookComment[]): NotebookPageSummary[] {
        const summary = this.page.summaries;
        const res: NotebookPageSummary[] = [];
        summary.forEach((e, i) => {
            let total = e.value * e.count;
            let count = e.count;
            comments.forEach(comment => {
                const model = new NotebookCommentModel(comment,this.page);
                if (!model.hasChart()) {
                    return;
                }
                const val = comment.values;
                if (val.length > i) {
                    count++;
                    total += Math.min(val[i], 5);
                }
            });
            res.push({
                name: e.name,
                value: count === 0 ? 0 : total / count,
                count: count
            });
        });
        this.page.summaries = res;
        this.reCalcAverage();
        return res;
    }

    private reCalcAverage() {
        let allTotal = 0;
        let allCount = 0;
        this.page.summaries.forEach(e => {
            let total = e.value * e.count;
            let count = e.count;
            allTotal += total;
            allCount += count;
        });
        if(allCount > 0) {
            this.page.average = allTotal / allCount;
        }
    }

    names(): string[] {
        return this.page.items.map(e => e.name);
    }

}

export class NotebookEditPageModel extends NotebookPageModel {
    private state: NotebookPageEditState

    constructor(state: NotebookPageEditState) {
        super(state.page);
        this.state = state;
    }

    editPageTitle(): string {
        return this.state.isNew ? "新しいページ作成" : "ページを編集する";
    }

    update(callback: (state: NotebookPage, error: FetchError) => void) {
        const fetchCallback = (json: any, error: any) => {
            if(error) {
                callback(null, error);
                return;
            }
            callback(json as NotebookPage, null);
        };

        if (this.state.isNew) {
            UrlFetch.instance.post(super.getUrl(""), this.state, fetchCallback);
            return;
        }
        UrlFetch.instance.put(super.getUrl(""), this.state, fetchCallback);
    }

}
