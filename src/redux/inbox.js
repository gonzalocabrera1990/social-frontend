import * as ActionTypes from "./ActionTypes";

export const Inbox = (
    state = {
        isLoading: false,
        errMess: null,
        inbox: null,
        read: false
    },
    action
) => {
    switch (action.type) {
        case ActionTypes.INBOX_SUCCESS:
            return { ...state, isLoading: false, errMess: null, inbox: action.payload, read: action.read};

        case ActionTypes.INBOX_LOADING:
            return { ...state, isLoading: true, errMess: null, inbox: null, read: false };

        case ActionTypes.INBOX_FAILED:
            return {
                ...state,
                isLoading: false,
                errMess: action.payload,
                inbox: null,
                read: false
            };

        default:
            return state;
    }
};
