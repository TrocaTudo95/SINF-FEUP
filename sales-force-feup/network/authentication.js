import {HOST_FLASK} from './constants'
import {fetchRequest,fetchRequestMethod} from '../utils/utils'

export const signup = (salesmanCode, password) => {
    
    return fetchRequest(fetchRequestMethod.POST, `${HOST_FLASK}auth/signup`, {salesmanCode: salesmanCode, password: password}) 

}

export const login = (salesmanCode, password) => {

    return fetchRequest(fetchRequestMethod.POST, `${HOST_FLASK}auth/login`, {salesmanCode: salesmanCode, password: password}) 

}

export const logout = (userId, sessionToken) => {

    return fetchRequest(fetchRequestMethod.POST, `${HOST_FLASK}auth/logout`, {userId: userId, sessionToken: sessionToken}) 

}

export const loginWithToken = (userId, sessionToken) => {

    return fetchRequest(fetchRequestMethod.POST, `${HOST_FLASK}auth/loginWithToken`, {userId: userId, sessionToken: sessionToken}) 

}

