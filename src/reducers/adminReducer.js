import { GET_ADMIN, LOGOUT } from '../actions/types';
import IsEmpty from '../validation/IsEmpty';

const initialState = {
    isAuthenticated: localStorage.getItem('isAuthenticated'),
    admin: {},
    isAdmin: true,
    features: []
}

const adminReducer = (state = initialState, action) => {

    switch (action.type) {

        case GET_ADMIN:
            {

                return {
                    ...state,
                    isAuthenticated: localStorage.setItem('isAuthenticated', true),
                    isAdmin: action.isAdmin


                }
            }
        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,

            }

        default:
            return state;
    }

}

export default adminReducer;