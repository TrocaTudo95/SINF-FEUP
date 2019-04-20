import {combineReducers} from 'redux'
import {ACTION_TYPES} from './actions'

const tasksReducer = (state = [], action) => {

    switch(action.type) {

        case ACTION_TYPES.TASKS.GET_TASKS:
            return action.payload

        default:
            return state
    }

}

const userReducer = (state = {}, action) => {

    switch(action.type) {

        case ACTION_TYPES.AUTH.UPDATE_USER:
            return action.payload

        default:
            return state

    }

}

const productsReducer = (state = [], action) => {

    switch(action.type) {

        case ACTION_TYPES.PRODUCTS.UPDATE_PRODUCTS:
            return action.payload

        default:
            return state

    }

}

const productsPicsReducer = (state = {}, action) => {

    switch(action.type) {

        case ACTION_TYPES.PRODUCTS.UPDATE_PRODUCT_PICTURE:
            return action.payload

        default:
            return state

    }

}

const opportunitiesReducer = (state = [], action) => {

    switch(action.type) {
        case ACTION_TYPES.OPPORTUNITIES.UPDATE_OPPORTUNITIES:
            return action.payload
 
         default:
             return state
    }
}

const costumersReducer = (state = [], action) => {

    switch(action.type) {

        case ACTION_TYPES.CUSTOMERS.UPDATE_CUSTOMERS:
            return action.payload

        default:
            return state

    }

}

const reducer = combineReducers({
    tasks: tasksReducer,
    user: userReducer,
    products: productsReducer,
    opportunities: opportunitiesReducer,
    customers: costumersReducer,
    productsPics: productsPicsReducer
})


export default reducer