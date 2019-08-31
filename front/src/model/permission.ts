import {string} from "prop-types";
import Session from "../utils/session";
import {isNotebook, Notebook} from "./notebook";
import {NotebookPage} from "./notebookPage";

export class Permission {
    private editable: string = "";
    private private: boolean = true;
    private authorId: string = "";
    private ownerId: string = "";
    private session: Session;
    private comment: boolean;
    private evaluate: boolean;

    constructor(permission: Notebook | NotebookPage) {
        this.session = new Session();
        if (permission === undefined || permission === null) {
            return;
        }
        if (isNotebook(permission)) {
            this.setNotebook(permission);
        } else {
            this.setNotebookPage(permission as NotebookPage);
        }
    }

    private setNotebook(notebook: Notebook) {
        this.editable = notebook.editable;
        this.authorId = notebook.account.id;
        this.ownerId = notebook.account.id;
        this.private = notebook.private;
    }

    private setNotebookPage(page: NotebookPage) {
        this.setNotebook(page.notebook);
        this.authorId = page.author.authorId;
        this.comment = page.comment;
        this.evaluate = page.evaluate;
    }

    isOwner(): boolean {
      return this.ownerId !== "" && this.ownerId === this.session.getId();
    }

    isAuthor(): boolean {
        return this.authorId !== "" && this.authorId === this.session.getId();
    }

    isCreateOwnerOnly(): boolean {
        return this.editable === 'self';
    }

    hasCreatePermission(): boolean {
        if (this.isOwner()) {
            return true;
        }
        return this.hasPermission(this.editable);
    }

    hasEditPermission(): boolean {
        if (this.isOwner()) {
            return true;
        }
        if (this.authorId === '') {
            return false;
        }
        const id = this.session.getId();
        return id === this.authorId;
    }

    hasReadPermission(): boolean {
        return this.private === false || this.isOwner();
    }

    hasCommentPermission(): boolean {
        return this.comment;
    }

    hasChartPermission(): boolean {
        return this.evaluate;
    }

    private hasPermission(value: string): boolean {
        const id = this.session.getId();
        if(this.ownerOnly(value)) {
            return id === this.ownerId;
        }
        return this.session.isLoggedIn();
    }

    private shouldLoggedIn(value: string): boolean {
        return value === 'loggedin';
    }

    private ownerOnly(value: string): boolean {
        return value === 'self';
    }
}