

type ValidateRole = ()=>boolean

export default class Validator {
    private map: ValidateRole[] = [];

    public addRule(func:()=>boolean) {
        this.map.push(func)
    }

    public validate(): boolean {
        let result = true;
        for(var i in this.map) {
            if(this.map[i]() === false) {
                result = false;
            }
        }
        return result;
    }
}