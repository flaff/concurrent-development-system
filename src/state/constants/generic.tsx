import {ErrorResponse} from "@request/types/user";

export interface IAction<T> {
    type: string;
    payload: T;
}

export interface IActionCreator<T> {
    (payload?: T): IAction<T>;
    type?: string;
}

export const
    createActionCreator = function <T = void>(type: string): IActionCreator<T> {
        const creator: any = (payload?: T) => ({
            type, payload
        });
        creator.type = type;
        return creator;
    },

    createGenericRequestConsts = function <SuccessType = any, ErrorType = ErrorResponse>(name: string) {
        return {
            SUCCESS: createActionCreator<SuccessType>(`${name}_SUCCESS`),
            ERROR: createActionCreator<ErrorType>(`${name}_ERROR`),
            START: createActionCreator(`${name}_START`)
        };
    };