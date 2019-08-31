import EventDispacher from "../eventDispacher";

export interface FetchError {
    code: number
    text: string
};

export class UrlFetch {
    private static _instance : UrlFetch;
    private etag: string = "";
    private token: string = "";

    private constructor() {
    }

    set eTag(value: string) {
        this.etag = value;
    }

    set accessToken(value: string) {
        this.token = value;
    }

    static get instance(): UrlFetch {
        if(!this._instance) {
            this._instance = new UrlFetch();
        }
        return this._instance;
    }

    private handle(response: any): any {
        if (response.ok) {
            return response;
        }
        throw Error("" + response.status);
    }

    private handleErrorStr(error: string):string {
        const map: {[key:string]:string} = {
            "400": "処理中にエラーが発生しました。",
            "401": "処理中にエラーが発生しました。\nこちらの操作の権限がありません。",
            "403": "処理中にエラーが発生しました。\nこちらの操作の権限がありません。",
            "404": "データが見つかりませんでした。",
            "500": "処理中にエラーが発生しました。\n時間をあけてもう一度お試し下さい。",
        }
        if (map.hasOwnProperty(error)) {
            return map[error]
        }
        return map["500"];
    }

    get(path: string, callback: (json:any, error: FetchError) => void) {
        EventDispacher.instance.showProgress();
        fetch(path, {
            method: 'GET',
            credentials: 'include', })
            .then(this.handle)
            .then(res => res.json())
            .then(json => callback(json, null))
            .catch(error => {
                EventDispacher.instance.showToast(this.handleErrorStr(error.message));
                callback(null, {code: parseInt(error.message), text: ""});
            })
            .finally(()=>{
                EventDispacher.instance.hideProgress();
            })
    }

    post(path: string, data: any, callback: (json:any, error: FetchError)=>void) {
        EventDispacher.instance.showProgress();

        fetch(path, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            credentials: 'include', })
            .then(this.handle)
            .then(res => res.json())
            .then(json => callback(json, null))
            .catch(error => {
                EventDispacher.instance.showToast(this.handleErrorStr(error.message));
                callback(null, {code: parseInt(error.message), text: ""});
            })
            .finally(()=>{
                EventDispacher.instance.hideProgress();
            })

    }

    put(path: string, data: any, callback: (json:any, error: FetchError)=>void) {
        EventDispacher.instance.showProgress();

        fetch(path, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            credentials: 'include', })
            .then(this.handle)
            .then(res => res.json())
            .then(json => callback(json, null))
            .catch(error => {
                EventDispacher.instance.showToast(this.handleErrorStr(error.message));
                callback(null, {code: parseInt(error.message), text: ""});
            })
            .finally(()=>{
                EventDispacher.instance.hideProgress();
            })
    }

    delete(path: string, callback: (error: FetchError)=>void) {
        EventDispacher.instance.showProgress();

        fetch(path, { method: 'DELETE', credentials: 'include', })
            .then(this.handle)
            .then(res => res.text())
            .then(json => callback(null))
            .catch(error => {
                EventDispacher.instance.showToast(this.handleErrorStr(error.message));
                callback({code: parseInt(error.message), text: ""});
            })
            .finally(()=>{
                EventDispacher.instance.hideProgress();
            })
    }


}