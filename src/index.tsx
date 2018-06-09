import * as React from "react";
import * as ReactDOM from "react-dom";
import Auth from "./containers/Auth";

import {createStore, combineReducers, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import {routerMiddleware, routerReducer} from "react-router-redux";
import {Router, Route} from "react-router-dom";

import {StoreState} from "@state/types";
import {simulationReducer, userReducer, roomReducer} from "@state/reducers";

import "./styles.global.scss";
import SessionsList from "./containers/SessionsList";
import SessionSimulation from "./containers/SessionRoom";

import history from './history';
import UnauthorizedRedirect from './routes';
import {OnMessage, OnJoinedRoom, OnLeftRoom, OnRotatedSimulation} from "@request/simulation";
import {ROTATED_SIMULATION} from "@state/constants/simulation";
import {JOINED_ROOM, LEFT_ROOM, MESSAGE} from "@state/constants/room";
import sessionsReducer from "@state/reducers/sessions";
import {SESSION_REFRESH} from "@state/constants/sessions";
import {OnSessionListRefresh} from "@request/sessions";

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
            simulation: simulationReducer,
            sessions: sessionsReducer,
            room: roomReducer
        }),

        reduxDevTools || applyMiddleware(middleware)
    );

OnRotatedSimulation((p) => store.dispatch(ROTATED_SIMULATION(p)));
OnLeftRoom((p) => store.dispatch(LEFT_ROOM(p)));
OnJoinedRoom((p) => store.dispatch(JOINED_ROOM(p)));
OnMessage((p) => store.dispatch(MESSAGE(p)));
OnSessionListRefresh(() => store.dispatch(SESSION_REFRESH()));

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <div>
                <UnauthorizedRedirect />
                <Route exact path={"/"} component={Auth}/>
                <Route exact path={"/sessions"} component={SessionsList}/>
                <Route path={"/sessions/:id"} component={SessionSimulation}/>
            </div>
        </Router>
    </Provider>,
    document.getElementById("root") as HTMLElement
);
