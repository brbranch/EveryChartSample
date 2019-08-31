import {ChangeEvent} from "react";
import Validator from "./valiator";


export default interface FieldProps {
    id? : string
    title? : string
    value? : string
    required? : string
    rule? : (value: string) => string
    disabled? : boolean
    validate? : Validator
    onChange? : (newValue : string) => void
}