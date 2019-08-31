import * as React from 'react'
import {makeStyles, useTheme, Theme, fade , createStyles, withStyles} from '@material-ui/core/styles';
import {compose} from "redux";
import FieldProps from './fieldprops'
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import {TextField, Box} from "@material-ui/core";
import {ChangeEvent} from "react";
import BaseInputField from './inputfield'
import {Classes} from './inputfield'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            border: '1px solid #e2e2e1',
            borderRadius: 4,
            backgroundColor: "white",
            width: '100%',
        },
        textFieldError: {
            border: '2px solid #ff6666',
            borderRadius: 4,
            backgroundColor: "#ffeeee",
            width: '100%',
        },
        errorText: {
            color: "red",
            textAlign: "right"
        },
        title: {
            fontWieght: "bold",
        },
        focused: {},
    }),
);

interface InternalTextAreadProps {
    placeholder? : string
    row? : number
}

type TextareaProps = InternalTextAreadProps & FieldProps

class Component extends BaseInputField<InternalTextAreadProps> {
    render () {
        if(this.props.validate) {
            this.props.validate.addRule(this.validate.bind(this))
        }

        const row = this.props.row || 4;

        return (
            <React.Fragment>
                <Box textAlign="left" m={2}>
                    <div className={this.props.titleClass}><strong>{this.props.title}</strong></div>
                    <TextField
                        id={this.props.id}
                        className={this.getCss()}
                        multiline
                        disabled={this.props.disabled || false}
                        rows={row}
                        value={this.props.value}
                        onChange={this.onChange.bind(this)}
                        placeholder={this.props.placeholder}
                        variant="outlined"
                    />{this.getError()}
                </Box>
            </React.Fragment>
        );
    }
}

type OwnProps = TextareaProps & Classes

export const Textarea : React.FC<TextareaProps> = (props: TextareaProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const pp : OwnProps = {
        titleClass: classes.title,
        fieldClass: classes.textField,
        errorClass: classes.textFieldError,
        errorText: classes.errorText,
        ...props,
    }
    return (
        <Component {...pp} />
    );
}