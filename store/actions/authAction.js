import ActionTypes from '../Constant/Constant'
import { StackActions, NavigationActions } from 'react-navigation';


export function setDataReducer(state, data) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            dispatch({ type: ActionTypes[state], payload: data })
            resolve(true)
        })
    }
}