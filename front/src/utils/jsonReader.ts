
export default class JsonReader {

    static read<T>(dataName: string): T | undefined {
        const doc = document.getElementById("data-" + dataName);
        if (doc) {
            const json = doc.getAttribute("data-json");
            return JSON.parse(json) as T;
        }
        return undefined;
    }
}