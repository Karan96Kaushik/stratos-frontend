import {configureStore} from '@reduxjs/toolkit'
import filtersReducer from './reducers/filtersSlice'
import membersReducer from './reducers/membersSlice'

export default configureStore({
    reducer:{
        filters: filtersReducer,
        members: membersReducer,
    }
})