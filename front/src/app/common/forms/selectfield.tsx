import * as React from 'react'
import {makeStyles, useTheme, Theme, fade , createStyles, withStyles} from '@material-ui/core/styles';
import {compose} from "redux";
import FieldProps from './fieldprops'
import { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import {TextField, Box, MenuItem} from "@material-ui/core";
import {ChangeEvent} from "react";
import BaseInputField from './inputfield'
import {Classes} from './inputfield'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            border: '1px solid #e2e2e1',
            borderRadius: 4,
            backgroundColor: "white",
            width: '100%'
        },
        textFieldError: {
            border: '2px solid #ff6666',
            borderRadius: 4,
            backgroundColor: "#ffeeee",
            width: '100%'
        },
        errorText: {
            color: "red",
            textAlign: "right"
        },
        title: {
            fontWieght: "bold",
        },
        menu: {
            width: 200,
        },
        focused: {},
    }),
);

export interface SelectOption {
    value: string
    label: string
}

interface Props {
    menu : SelectOption[]
}

interface PropClass {
    menuClass: string
}

class Component extends BaseInputField<Props & PropClass> {
    render () {
        if(this.props.validate) {
            this.props.validate.addRule(this.validate.bind(this))
        }

        return (
            <React.Fragment>
                <Box textAlign="left" m={1}>
                    <div className={this.props.titleClass}><strong>{this.props.title}</strong></div>
                    <TextField
                        id={this.props.id}
                        select
                        className={this.getCss()}
                        value={this.props.value}
                        onChange={this.onChange.bind(this)}
                        SelectProps={{
                            MenuProps: {
                                className: this.props.menuClass,
                            },
                        }}
                        variant="outlined"
                    >
                        {this.props.menu.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    {this.getError()}
                </Box>
            </React.Fragment>
        );
    }
}

type SelectProps = FieldProps & Props;
type OwnProps = SelectProps & PropClass & Classes;

export const Select : React.FC<SelectProps> = (props: SelectProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const pp : OwnProps = {
        titleClass: classes.title,
        fieldClass: classes.textField,
        errorClass: classes.textFieldError,
        errorText: classes.errorText,
        menuClass: classes.menu,
        ...props,
    }

    return (
        <Component {...pp} />
    );
}