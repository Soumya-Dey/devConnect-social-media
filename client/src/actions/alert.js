import { v4 as uuidv4 } from "uuid";

import { SET_ALERT, REMOVE_ALERT } from "./types";

// func for dispatching alert msg actions
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
    const id = uuidv4();

    // set the alert
    dispatch({
        type: SET_ALERT,
        payload: {
            msg,
            alertType,
            id,
        },
    });

    // remove the alert after 3s
    setTimeout(() => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id,
        });
    }, timeout);
};
