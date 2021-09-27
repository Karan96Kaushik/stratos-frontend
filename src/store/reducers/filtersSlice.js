import {createSlice} from '@reduxjs/toolkit'
import * as _ from 'lodash';

export const filtersSlice = createSlice({
    name: 'filters',
    initialState:{
        filters:{},
    },
    reducers: {
        getFilters:(state,action)=>{
            state.filters = action.payload
        },
        updateFilter:(state,action) => {
            state.filters = _.merge(state.filters, action.payload)
        },
        clearFilters:(state,action) => {
            state.filters[action.payload.type] = {}
        },
    }
})

export const { getFilters, updateFilter, clearFilters } = filtersSlice.actions
export const updateFilterService = (filter, type)=>{
    return async (dispatch, getState)=>{
        try {
            dispatch(updateFilter({[type]: filter}))
        }
        catch (err) {
            console.log(err)
        }
    }
}
export const clearFiltersService = (type)=>{
    return async (dispatch, getState)=>{
        try {
            dispatch(clearFilters({type}))
        }
        catch (err) {
            console.log(err)
        }
    }
}


// Gets all filters
export const selectFilters = state => state.filters.filters;

// Gets filters for the initialised type
export const selectFilterFor = (type) => (
    ((state) => (state.filters.filters[type] ?? {}))
);

export default filtersSlice.reducer;