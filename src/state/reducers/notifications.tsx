import {USER_LOGIN, USER_RESTORE} from "@state/constants/user";
import {NotificationsState} from "@state/types/notifications";

export function user(state: NotificationsState, action): NotificationsState {
    switch (action.type) {
        default:
            return state || [];
    }
}