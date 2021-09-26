import {createSlice} from '@reduxjs/toolkit'

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
            console.log("updating", state, state.filters, action)
            state.filters = {...state.filters, ...action.payload}
        },
        clearFilters:(state,action) => {
            state.filters = {}
        }
    }
})

export const { getFilters, updateFilter } = filtersSlice.actions
export const updateFilterService = (filter)=>{
    return async (dispatch, getState)=>{
        try {
            console.log(filter)
            dispatch(updateFilter(filter))
        }
        catch (err) {
            console.log(err)
        }
    }
}

export const selectFilters = state => state.filters.filters;

export default filtersSlice.reducer;