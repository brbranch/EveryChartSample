import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css'
import {register} from './registerServiceWorker';
import Store from './store';

// Material-UI
import { createMuiTheme, MuiThemeProvider  } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/deepOrange';
import orange from '@material-ui/core/colors/orange';

// Redux関連
import { Provider } from 'react-redux';

// Router関連
import { BrowserRouter as Router } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas, faCheckSquare, faCoffee , faExclamation , faHeart, faComment, faChartArea, faInfoCircle, faExclamationCircle, faTrash, faUserLock, faFileAlt, faStar} from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'; //fontawesomeのregularアイコンのインポート

import { createBrowserHistory } from "history"
import { routerMiddleware, ConnectedRouter } from 'connected-react-router'
import { Switch } from "react-router-dom"
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import Root from './app/routerContainer'

const history = createBrowserHistory()
export const store = createStore(
    Store(history),
    applyMiddleware(thunk, routerMiddleware(history))
)

library.add(fab, fas, far, faTwitter, faCoffee, faHeart, faComment, faCheckSquare, faExclamation, faExclamationCircle, faChartArea, faInfoCircle, faTrash, faUserLock, faFileAlt, faStar);

// Material-UIテーマカスタマイズ
const theme = createMuiTheme({
    typography : {
        h1: {
          fontSize: "2em",
          color: "#333333",
        },
        h2: {
          fontSize: "1.5em",
          color: "#333333",
        },
    },
    palette: {
        type: 'light', // light or dark
        primary: orange, // primaryのカラー
        secondary: red, // secondaryのカラー
    }
});

ReactDOM.render(
<Provider store={store}>
            <MuiThemeProvider theme={theme} >
                <ConnectedRouter history={history}>
                    <Root/>
                </ConnectedRouter>
            </MuiThemeProvider>
        </Provider>,
    document.getElementById('app')
);

// キャッシュを有効にする
register();