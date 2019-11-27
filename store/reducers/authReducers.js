import ActionTypes from '../Constant/Constant'

const INITIAL_STATE = {

    USER: null,
    SWITCH: null

}

export default (states = INITIAL_STATE, action) => {
    switch (action.type) {

        case ActionTypes.USER:
            return ({
                ...states,
                USER: action.payload
            })
        case ActionTypes.SWITCH:
            return ({
                ...states,
                SWITCH: action.payload
            })
        default:
            return states;
    }
}