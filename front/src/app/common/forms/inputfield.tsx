import * as React from "react";
import FieldProps from './fieldprops'
import {ChangeEvent} from "react";

export interface Classes {
    titleClass : string
    fieldClass : string
    errorClass : string
    errorText : string
}

interface InnerState {
    hasError: string | undefined
}

type Own = Classes & FieldProps;

export default class BaseInputField<T> extends React.Component<T & Own, InnerState> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: undefined }
    }

    onChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        if(this.props.onChange) {
            this.props.onChange(value);
        }
    }

    validate() : boolean {
        const value = this.props.value;
        if(this.props.required && (this.props.value === undefined || this.props.value.length === 0)) {
            this.showError(this.props.required);
            return false;
        }
        if(this.props.rule) {
            const error = this.props.rule(this.props.value);
            if (error) {
                this.showError(error);
                return false;
            }
        }
        this.setState({hasError: undefined})
        return true;
    }

    showError(error: string | undefined) {
        this.setState({hasError: error})
    }

    getCss(): string {
        const css: string = this.state.hasError ? this.props.errorClass : this.props.fieldClass;
        return css
    }

    getError() {
        if(this.state.hasError) {
            return (
                <div className={this.props.errorText}>{this.state.hasError}</div>
            )
        }
    }

}