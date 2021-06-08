import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import TaskListToolbar from 'src/components/tasks/TaskListToolbar';
import TaskList from 'src/components/tasks/TaskList';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
    const [data, setData] = React.useState({type: '', rows:[]})
    const args = React.useRef({})
	
	const goSearch = () => {
        authorizedReq({ route: "/api/tasks/search", creds: loginState.loginState, data:{serviceType: args.current.serviceType}, method: 'get' })
            .then(_data => setData({type: args.current.serviceType, rows: _data}))
    }

	const handleChange = (event) => {
		if(event.target.id == 'serviceType'){
			if(event.target.value == '') {
				setData({type: '', rows:[]})
				return
			}
			args.current[event.target.id] = event.target.value
			goSearch()
		}
	}
	
	return (<>
		<Helmet>
			<title>Tasks | TMS</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<TaskListToolbar searchinfo={args} handleChange={handleChange} goSearch={goSearch} />
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<TaskList data={data} />				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
