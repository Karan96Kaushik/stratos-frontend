import {createSlice} from '@reduxjs/toolkit'
import { authorizedReq } from 'src/utils/request'

export const membersSlice = createSlice({
    name: 'members',
    initialState:{
        members:[],
    },
    reducers: {
        setMembers:(state,action)=>{
            state.members = action.payload
        },
    }
})

export const { setMembers } = membersSlice.actions
export const setMembersService = (creds) => {
    return async (dispatch, getState) => {
        try {
            let response = await authorizedReq({ route: "/api/members/list", creds, data: {}, method: 'get' })
			response = [ {}, ...response ]
            dispatch(setMembers(response))
        }
        catch (err) {
            console.error(err)
        }
    }
}

export const selectMembers = state => state.members.members;

export default membersSlice.reducer;