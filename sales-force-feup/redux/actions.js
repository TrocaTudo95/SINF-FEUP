export const ACTION_TYPES = {

    TASKS: {
        GET_TASKS: 'GET_TASKS'
    },

    AUTH: {
        UPDATE_USER: 'UPDATE_USER'
    },

    PRODUCTS: {
        UPDATE_PRODUCTS: 'UPDATE_PRODUCTS',
        UPDATE_PRODUCT_PICTURE: 'UPDATE_PRODUCT_PICTURE'
    },

    OPPORTUNITIES: {
        UPDATE_OPPORTUNITIES: 'GET_OPPORTUNITIES'
    },
    
    CUSTOMERS: {
        UPDATE_CUSTOMERS: 'UPDATE_CUSTOMERS'
    }

}

export class taskActions {

    static updateTasks = tasks => ({
    
        type: ACTION_TYPES.TASKS.GET_TASKS,
        payload: tasks

    })

}

export class authActions {

    static updateUser = user => ({
        type: ACTION_TYPES.AUTH.UPDATE_USER,
        payload: user
    })

}

export class productsActions {

    static updateProducts = products => ({

        type: ACTION_TYPES.PRODUCTS.UPDATE_PRODUCTS,
        payload: products

    })

    static updateProductPic = product => ({
        type: ACTION_TYPES.PRODUCTS.UPDATE_PRODUCT_PICTURE,
        payload: product
    })

}

export class opportunityActions {

    static updateOpportunities = opportunities => ({

        type: ACTION_TYPES.OPPORTUNITIES.UPDATE_OPPORTUNITIES,
        payload: opportunities
    })
}

export class customersActions {

    static updateCustomers = customers => ({

        type: ACTION_TYPES.CUSTOMERS.UPDATE_CUSTOMERS,
        payload: customers

    })
}