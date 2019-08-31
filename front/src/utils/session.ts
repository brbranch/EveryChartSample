import {generateUuid} from "./generator";


export default class Session {
    private commentId: string = "";
    private accountId: string = "";
    private image: string = "";
    private loggedIn: boolean = false;

    constructor() {
        const doc = document.getElementById("data-sessionId");
        if (doc) {
            this.accountId = doc.getAttribute("data-json");
            this.loggedIn = this.accountId.trim().length > 0;
        }
        const comment = document.getElementById("data-commentId");
        if(comment) {
            this.commentId = comment.getAttribute("data-json");
        }
        if (this.commentId.length === 0) {
            // LocalStorageより
            let val = localStorage.getItem("commentId");
            if (val) {
                this.commentId = val;
            } else {
                val = generateUuid();
                localStorage.setItem("commentId", val);
                this.commentId = val;
            }
        }
        const image = document.getElementById("data-loginImage");
        if(image) {
            this.image = image.getAttribute("data-json");
        }
    }

    loginImage() {
        return this.image;
    }

    isSameAccount(accountId: string): boolean {
        return this.accountId !== '' && this.accountId === accountId;
    }

    isSameSession(sessionId: string): boolean {
        return this.commentId !== '' && this.commentId === sessionId;
    }

    getId(): string {
        if (!this.isLoggedIn()) {
            return "";
        }
        return this.accountId
    }

    getCommentId(): string {
        return this.commentId
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }
}


