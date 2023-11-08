import {createSlice} from '@reduxjs/toolkit'
import * as _ from 'lodash';

export const userSlice = createSlice({
    name: 'user',
    initialState:{
        user:{},
    },
    reducers: {
        updateUser:(state,action) => {
            state.user = _.merge(state.user, action.payload)
        },
        clearUser:(state,action) => {
            state.user = {}
        },
    }
})

export const { updateUser, clearUser } = userSlice.actions
export const updateUserService = (userInfo)=>{
    return async (dispatch, getState)=>{
        try {
            dispatch(updateUser(userInfo))
        }
        catch (err) {
            console.error(err)
        }
    }
}


// Gets all user
export const selectUser = state => state.user.user;

export default userSlice.reducer;