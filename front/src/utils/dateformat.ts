export function toDatetimeString(unixtime: number): string {
    const now = new Date().getTime();
    const diff  =(now - unixtime) / 1000;

    if( diff < 60 ) {
        return Math.round(diff) + "秒前";
    }

    if( diff < 3600) {
        const min = Math.round(Math.max(diff / 60, 0));
        return min + "分前";
    }

    if( diff < (3600 * 24)) {
        const min = Math.round(diff / 3600);
        return min + "時間前";
    }

    if( diff < (3600 * 24 * 7)) {
        const min = Math.round(diff / 86400);
        return min + "日前";
    }

    const date = new Date(unixtime);
    const padding = (num: number) => {
        if(num < 10) {
            return "0" + num;
        }
        return "" + num;
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();
    return padding(month) + "/" + padding(day);
}