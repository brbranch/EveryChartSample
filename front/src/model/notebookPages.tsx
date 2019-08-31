import {NotebookPage} from "./notebookPage";
import {FetchError, UrlFetch} from "../client/fetch";
import {Notebook, NotebookModel} from "./notebook";

export interface NotebookPages {
    pages: NotebookPage[];
    cursor: string;
    hasNext: boolean;
    first: boolean;
}

export function initialNotebookPages(): NotebookPages {
    return {
        pages: [],
        cursor: "",
        hasNext: false,
        first: true,
    }
};

interface NotebookPageResponse {
    items: NotebookPage[],
    next: string
}

export class NotebookPagesModel {
    private book: NotebookModel = null;
    private pages : NotebookPages = null;

    constructor(book: Notebook, pages?: NotebookPages) {
        this.book = new NotebookModel(book);
        this.pages = pages || initialNotebookPages();
    }

    get(callback: (error: FetchError) => void) {
        if (!this.hasNext()) {
            callback(null);
            return;
        }
        this.pages.first = false;
        let path = this.book.getUrl("/pages/instances.json");
        if (this.pages.cursor) {
            path += "?cursor=" + this.pages.cursor;
        }

        UrlFetch.instance.get(path, (json: any, error: FetchError) => {
            if (error) {
                callback(error);
                return;
            }
            const resp = json as NotebookPageResponse;
            this.merge(resp);
            console.log(this.pages);
            callback(null);
        });
    }

    hasNext(): boolean {
        return this.pages.first || this.pages.hasNext;
    }

    hasNextCursor(): boolean {
        return this.pages.cursor && this.pages.cursor.length > 0;
    }

    hasData(): boolean {
        return this.pages.pages.length  > 0;
    }

    list(): NotebookPage[] {
        return this.pages.pages
    }

    data(): NotebookPages {
        return {...this.pages}
    }

    clone(): NotebookPagesModel {
        return new NotebookPagesModel(this.book.notebook(), this.pages);
    }

    private merge(resp: NotebookPageResponse) {
        this.pages.cursor = resp.next;
        this.pages.hasNext = resp.next.length > 0;
        this.pages.pages = this.pages.pages.concat(resp.items);
    }

}
