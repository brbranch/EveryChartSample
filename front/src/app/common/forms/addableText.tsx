import * as React from "react";
import {ChangeEvent} from "react";
import Validator from "./valiator";
import FieldProps from './fieldprops'
import {makeStyles, useTheme, Theme, fade , createStyles, withStyles} from '@material-ui/core/styles';
import {Box, Fab, Grid, IconButton, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

type callback = () => string;
interface Callback {
    id: string
    callback: callback
}

class TextReducer {
    private callbacks: Callback[] = [];

    public reduce(): string[] {
        let result: string[] = [];
        this.callbacks.map(elem => {
            const value = elem.callback();
            if(value !== undefined) {
                result.push(value);
            }
        })
        return result;
    }

    public addCallback(id: string, callback: callback) {
        var found = this.callbacks.find(elem => {
            return elem.id === id;
        })
        if (found === undefined) {
            this.callbacks.push({ id: id, callback: callback });
        }
    }
}

export interface Classes {
    titleClass : string
    fieldClass : string
    errorClass : string
    errorText : string
}

export interface AddableFieldProps {
    id? : string
    title? : string
    dateKey: number
    values : string[]
    placeholders? : string[]
    minItems? : number
    maxItems? : number
    required? : string
    rule? : (value: string) => string
    validate? : Validator
    onChanges? : (newValue : string[]) => void
    onAdd : ()=>void
}

interface InternalProps {
    reducer: TextReducer
    placeholder? : string
    showDelete: boolean
}

interface InnerState {
    hasError: string | undefined
}

interface InnerListState {
    hasError: string | undefined
}

type Own = Classes & FieldProps & InternalProps;
type OwnList = Classes & AddableFieldProps;


export class AddableTextField extends React.Component<Own, InnerState> {
    private value: string = '';
    private delete: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = { hasError: undefined};
        this.value = this.props.value;
    }

    onChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        this.value = value;
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

    deleteBtn() {
        if (!this.props.showDelete) {
            return;
        }
        return (
            <IconButton style={{margin: "6px"}} aria-label="Delete" onClick={()=>{
                this.delete = true;
                if(this.props.onChange) {
                    this.props.onChange(undefined);
                }
            }}>
                <DeleteIcon/>
            </IconButton>
        );
    }

    getError() {
        if(this.state.hasError) {
            return (
                <div className={this.props.errorText}>{this.state.hasError}</div>
            )
        }
    }

    reduce(): string {
        if(this.delete) {
            return undefined;
        }
        return this.value;
    }

    render() {
        if(this.props.validate) {
            this.props.validate.addRule(this.validate.bind(this))
        }
        this.delete = false;
        this.props.reducer.addCallback(this.props.id , this.reduce.bind(this));

        return (
            <React.Fragment>
                <div style={{ marginTop: "10px" }}>
                    <TextField
                        id={this.props.id}
                        className={this.getCss()}
                        value={this.value}
                        onChange={this.onChange.bind(this)}
                        placeholder={this.props.placeholder}
                        variant="outlined"
                    />
                    {this.deleteBtn()}
                </div>
                {this.getError()}
            </React.Fragment>
        )
    }
}

export class AddableTextFields extends React.Component<OwnList, InnerListState> {
    private reduser: TextReducer = new TextReducer();
    private num: number;
    private listNum: number;
    private validator: Validator;

    constructor(props: any) {
        super(props);
        this.state = { hasError: undefined };
        this.validator = new Validator();
        this.listNum = this.props.values.length;
        this.num = this.props.minItems || 1;
    }

    validate() : boolean {
        const result = this.validator ? this.validator.validate() : true;
        return result;
    }

    getError() {
        if(this.state.hasError) {
            return (
                <div className={this.props.errorText}>{this.state.hasError}</div>
            )
        }
    }

    handleChange(v: any) {
        const values: string[] = this.reduser.reduce();
        if(this.props.onChanges) {
            this.props.onChanges(values);
        }
    }

    createFields() {
        var list: any[] = [];
        for(var i = 0; i < this.listNum; i++) {
            list.push(this.createField(i));
        }
        return list;
    }

    getValue(key: number): string {
        if (this.props.values && this.props.values.length > key) {
            return this.props.values[key];
        }
        return "";
    }

    getPlaceholders(key: number): string {
        if(this.props.placeholders && this.props.placeholders.length > key) {
             return this.props.placeholders[key];
        }
        return "項目" + (key + 1);
    }

    createField(key: number) {
        const _key = this.props.dateKey + key;
        return (
            <AddableTextField
                key={_key}
                value={this.getValue(key)}
                id={this.props.id + "-" + key}
                validate={this.validator}
                required={this.props.required}
                titleClass={this.props.titleClass}
                fieldClass={this.props.fieldClass}
                errorClass={this.props.errorClass}
                errorText={this.props.errorText}
                showDelete={key >= this.num}
                onChange={this.handleChange.bind(this)}
                placeholder={this.getPlaceholders(key)}
                reducer={this.reduser}/>
        )
    }

    clickAdd() {
        this.props.onAdd();
    }

    render() {
        if(this.props.validate) {
            this.props.validate.addRule(this.validate.bind(this))
            this.validator = new Validator();
        } else {
            this.validator = undefined;
        }
        this.reduser = new TextReducer();
        this.listNum = this.props.values.length;
        const disable = this.props.maxItems ? this.props.maxItems <= this.listNum : false;

        return (
            <React.Fragment>
                <Box textAlign="left" m={2}>
                    <Grid container direction="row" alignItems="center" className={this.props.titleClass}>
                        <strong>{this.props.title}</strong>
                        <Button size="medium" color="secondary"
                                disabled={disable}
                                onClick={this.clickAdd.bind(this)} aria-label="Add">
                            <AddIcon />
                            項目追加
                        </Button>
                    </Grid>
                    {this.createFields()}
                    {this.getError()}
                </Box>
            </React.Fragment>
        );
    }

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            border: '1px solid #e2e2e1',
            borderRadius: 4,
            backgroundColor: "white",
            marginRight: '8px',
            width: 'calc(100% - 76px)',
        },
        textFieldError: {
            border: '2px solid #ff6666',
            borderRadius: 4,
            backgroundColor: "#ffeeee",
            marginRight: '8px',
            width: 'calc(100% - 76px)',
        },
        errorText: {
            color: "red",
            textAlign: "left"
        },
        title: {
            fontWieght: "bold",
        },
        focused: {},
    }),
);

export const InputTextList : React.FC<AddableFieldProps> = (props: AddableFieldProps) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const pp : OwnList = {
        titleClass: classes.title,
        fieldClass: classes.textField,
        errorClass: classes.textFieldError,
        errorText: classes.errorText,
        ...props,
    }

    return (
        <AddableTextFields {...pp} />
    );
}
