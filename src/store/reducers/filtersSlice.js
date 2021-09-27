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
            state.filters = {}
        }
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
export const clearFiltersService = (filter)=>{
    return async (dispatch, getState)=>{
        try {
            dispatch(clearFilters())
        }
        catch (err) {
            console.log(err)
        }
    }
}

export const selectFilters = state => state.filters.filters;
export const selectFilterFor = (type) => {
    console.log(type)
    return ((state) => {console.log("STSTE"); return (state.filters.filters)})
};

export default filtersSlice.reducer;