import {configureStore} from '@reduxjs/toolkit'
import filtersReducer from './reducers/filtersSlice'

export default configureStore({
    reducer:{
        filters: filtersReducer,
    }
})