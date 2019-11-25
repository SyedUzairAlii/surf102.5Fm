import actionTypes from '../Constant/Constant'

const INITIAL_STATE = {
  
    USER: null,
   
}

export default (states = INITIAL_STATE, action) => {
    switch (action.type) {
      
        case 'USER':
            return ({
                ...states,
                USER: action.payload
            })
        default:
            return states;
    }
}