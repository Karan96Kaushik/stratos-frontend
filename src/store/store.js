import {configureStore} from '@reduxjs/toolkit'
import filtersReducer from './reducers/filtersSlice'
import membersReducer from './reducers/membersSlice'
import userReducer from './reducers/userSlice'

export default configureStore({
    reducer:{
        filters: filtersReducer,
        members: membersReducer,
        user: userReducer,
    }
})