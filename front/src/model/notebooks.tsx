import {Notebook} from "./notebook";
import {FetchError, UrlFetch} from "../client/fetch";

export interface Notebooks {
    books: Notebook[];
    cursor: string;
    hasNext: boolean;
    first: boolean;
}

export function initialNotebooks(): Notebooks {
    return {
        books: [],
        cursor: "",
        hasNext: false,
        first: true,
    }
};

interface NotebookResponse {
    items: Notebook[],
    next: string
}

export class NotebooksModel {
    private accountId: string = "";
    private books : Notebooks = null;

    constructor(accountId: string, books?: Notebooks) {
        this.accountId = accountId;
        this.books = books || initialNotebooks();
    }

    get(callback: (error: FetchError) => void) {
        if (!this.hasNext()) {
            callback(null);
            return;
        }
        this.books.first = false;
        let path = "/"+ this.accountId +"/notebooks/instances.json";
        if (this.books.cursor) {
            path += "?cursor=" + this.books.cursor;
        }

        UrlFetch.instance.get(path, (json: any, error: FetchError) => {
            if (error) {
                callback(error);
                return;
            }
            const resp = json as NotebookResponse;
            this.merge(resp);
            callback(null);
        });
    }

    hasNext(): boolean {
        return this.books.first || this.books.hasNext;
    }

    hasNextCursor(): boolean {
        return this.books.cursor && this.books.cursor.length > 0;
    }

    hasData(): boolean {
        return this.books.books.length  > 0;
    }

    notebooks(): Notebook[] {
        return this.books.books;
    }

    data(): Notebooks {
        return {...this.books}
    }

    clone(): NotebooksModel {
        return new NotebooksModel(this.accountId, this.books);
    }

    private merge(resp: NotebookResponse) {
        this.books.cursor = resp.next;
        this.books.hasNext = resp.next.length > 0;
        this.books.books = this.books.books.concat(resp.items);
    }

}
