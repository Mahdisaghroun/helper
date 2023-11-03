import axios from 'axios';
import { GET_ADMIN, GET_ERRORS ,LOGOUT} from './types';
import jwt_decode from 'jwt-decode';
import setAdminToken from '../utils/setAdminToken';

export const loginAdmin = (isAdmin) => (dispatch) => {
   

  
        dispatch(getAdmin(isAdmin));
   
    
};

export const getAdmin = (isAdmin) => {
    return {
        type: GET_ADMIN,
        isAdmin
       
    }   
}
export const logOut = () => {
    localStorage.clear()
    return {
        type: LOGOUT,
       
    }   
}

export const logoutAdmin = () => (dispatch) => {
    // Clear Errors
    dispatch(logOut());
    // remove the token from the local storage
 
    // delete the authorization header
    
    // remove the admin by setting isAuthenticated to false by sending an empty payload
   
};


export const clearErrors = () => {
    return {
        type: GET_ERRORS,
        payload: {}
    };
}