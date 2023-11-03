import { GET_ADMIN, LOGOUT } from '../actions/types';
import IsEmpty from '../validation/IsEmpty';

const initialState = {
    isAuthenticated: true,
    admin: {},
    isAdmin:true,
    features:[]
}

const adminReducer = (state = initialState, action) => {

    switch(action.type) {

        case GET_ADMIN:
       {
        localStorage.setItem("isAuth","true")
        if(action.isAdmin)
        localStorage.setItem("isAdmin","true")
       
            return {
                ...state,
                isAuthenticated: true,
              isAdmin:action.isAdmin
             
              
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