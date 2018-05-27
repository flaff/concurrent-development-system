import * as React from "react";
import * as ReactDOM from "react-dom";
import Auth from "./containers/Auth";

import {createStore, combineReducers, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import {routerMiddleware, routerReducer} from "react-router-redux";
import {Router, Route} from "react-router-dom";

import {StoreState} from "@state/types";
import {simulationReducer, userReducer} from "@state/reducers";

import "./styles.global.scss";
import RoomsList from "./containers/RoomsList";
import Room from "./containers/Room";

import history from './history';
import UnauthorizedRedirect from './routes';

const
    middleware = routerMiddleware(history),

    reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
            applyMiddleware(middleware)
        ),

    store = createStore<StoreState, any, any, any>(
        combineReducers({
            user: userReducer,
            routing: routerReducer,
            simulation: simulationReducer
        }),

        reduxDevTools || applyMiddleware(middleware)
    );

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <div>
                <UnauthorizedRedirect />
                <Route exact path={"/"} component={Auth}/>
                <Route exact path={"/rooms"} component={RoomsList}/>
                <Route path={"/rooms/:roomId"} component={Room}/>
            </div>
        </Router>
    </Provider>,
    document.getElementById("root") as HTMLElement
);
