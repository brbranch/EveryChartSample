import * as React from 'react';
import { TestState } from '../states/testState';
import { TestApiActions } from '../containers/testApiContainer';

interface OwnProps {}

type TestProps = OwnProps & TestState & TestApiActions;

export const TestApiComponent: React.FC<TestProps> = (props: TestProps) => {
    return (
        <div>
            <div className="field">
                <input
                    type="text"
                    placeholder="name"
                    value={props.name}
                    onChange={(e) => props.submit()}
                />
            </div>
            <div className="field">
                <input
                    type="email"
                    placeholder="email"
                    value={props.email}
                    onChange={(e) => props.submit()}
                />
            </div>
            <div>
                {props.name}, {props.email}
            </div>
        </div>
    );
};