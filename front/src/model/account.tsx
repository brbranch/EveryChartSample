export interface Account {
    id: string;
    name: string;
    image: string;
    status: string;
    links: {[key:string]:AccountLink};
    lastLoggedIn: number
}

export interface AccountLink {
    account: string;
    type: AccountType;
}

export enum AccountType {
    twitter
}

export class AccountModel {
    private account: Account;

    constructor(account: Account) {
        this.account = account;
    }


}

export function defaultAccount(): Account {
    return {
        id: "",
        name: "匿名",
        image: "",
        status: "",
        links: {},
        lastLoggedIn:0,
    };
}
