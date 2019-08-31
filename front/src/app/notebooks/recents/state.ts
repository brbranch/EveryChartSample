import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {act} from "react-dom/test-utils";
import {Notebook} from "../../../model/notebook";
import {FetchError, UrlFetch} from "../../../client/fetch";

export interface RecentNotebooks {
    books: Notebook[];
    cursor: string;
    hasNext: boolean;
    first: boolean;
}

export function initialRecentNotebooks(): RecentNotebooks {
    return {
        books: [],
        cursor: "",
        hasNext: false,
        first: true,
    }
};

interface RecentNotebookResponse {
    items: Notebook[],
    next: string
}

export class RecentNotebooksModel {
    private books : RecentNotebooks = null;

    constructor(books: RecentNotebooks) {
        this.books = books || initialRecentNotebooks();
    }

    get(callback: (error: FetchError) => void) {
        if (!this.hasNext()) {
            callback(null);
            return;
        }
        this.books.first = false;
        let path = "/index/notebooks.json";
        if (this.books.cursor) {
            path += "?cursor=" + this.books.cursor;
        }

        UrlFetch.instance.get(path, (json: any, error: FetchError) => {
            if (error) {
                callback(error);
                return;
            }
            const resp = json as RecentNotebookResponse;
            this.merge(resp);
            console.log(this.books);
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

    data(): RecentNotebooks {
        return {...this.books}
    }

    private merge(resp: RecentNotebookResponse) {
        this.books.cursor = resp.next;
        this.books.hasNext = resp.next.length > 0;
        this.books.books = this.books.books.concat(resp.items);
    }

}

