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

    const loadData = (args={}) => {
        authorizedReq({ route: "/api/tasks/", creds: loginState.loginState, data:{...args}, method: 'get' })
            .then(data => setData({type: args.serviceType, rows: data}))
    }

	const handleChange = (event) => {
		if(event.target.id == 'serviceType'){
			if(event.target.value == '') {
				setData({type: '', rows:[]})
				return
			}
			loadData({serviceType: event.target.value})
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
				<TaskListToolbar loadData={loadData} handleChange={handleChange} />
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
