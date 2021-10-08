import { authorizedDownload } from './request'
import * as _ from 'lodash'

const exportHandler = async (state, password, endpoint) => {
    try {
        let others = {...state.search}
        others.filters = _.merge({}, state.filters)

        // search all - relevant in Tasks, 
        if(!others?.serviceType?.length)
            others.searchAll = true

        // relevant in Tasks, 
        if(others.filters && others.filters._membersAssigned) {
            others.filters._membersAssigned = state.memberRows.find(m => others.filters._membersAssigned == m.userName + ` (${m.memberID})`)._id
        }

        let filename = endpoint.split("/")
        filename = filename.pop() + filename.pop()

        await authorizedDownload({
            route: endpoint, 
            creds: state.loginState.loginState, 
            data:{...others, password}, 
            method: 'post'
        }, filename + ".xlsx")
    }
    catch (err) {
        state.snackbar.showMessage(
            String(err.message ?? err?.response?.data ?? err),
        )
    }
}

export { exportHandler }