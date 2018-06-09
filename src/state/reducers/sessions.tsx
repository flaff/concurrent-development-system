import {SessionsState} from "@state/types/sessions";

const
    defaultState: SessionsState = {
        list: [],
        shouldRefresh: false
    };

export default function sessionsReducer(state: SessionsState, action: any) {
    switch (action.type) {
        default:
            return state || defaultState;
    }
}
