import * as React from "react";
import Room from "./containers/Room";
import Auth from "./containers/Auth";
import RoomsList from "./containers/RoomsList";
import {Redirect, Route} from "react-router-dom";
import {StoreState} from "@state/types";
import {connect} from "react-redux";
import {goBack} from "react-router-redux";
import history from './history';

interface RoutesProps {
    authorized: boolean;
    prevPath: any;
}


let lastAuthorized = false,
    pathBeforeAuthorized = '/';

const
    onAuthorized = (authorized: boolean): boolean => {
        if (!authorized) {
            pathBeforeAuthorized = history.location.pathname;
        }

        return authorized;
    },

    compare = (authorized: boolean) => {
        lastAuthorized = authorized;
        return authorized;
    },

    UnauthorizedRedirect = (props: RoutesProps) => (
        !props.authorized ? <Redirect to={'/'} /> : (
            compare(props.authorized) ? <Redirect to={pathBeforeAuthorized} /> : <div />
        )
    ),

    stateToProps = (state: StoreState) => ({
        authorized: onAuthorized(!!state.user.name)
    });

export default connect(
    stateToProps
)(UnauthorizedRedirect);