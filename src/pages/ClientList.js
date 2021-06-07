import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import ClientListToolbar from 'src/components/clients/ClientListToolbar';
import ClientList from 'src/components/clients/ClientList';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
    const [data, setData] = React.useState({type: '', rows:[]})
    const args = React.useRef({})
	console.info("DATA", data)

    const loadData = (args={}) => {
        authorizedReq({ route: "/api/clients/", creds: loginState.loginState, data:{...args}, method: 'get' })
            .then(data => setData({type: args.clientType, rows: data}))
            // .catch(err => console.info(err))
    }

	const goSearch = () => {
		console.info("ARGS", args.current)
        authorizedReq({ route: "/api/clients/", creds: loginState.loginState, data:{clientType: args.current.clientType}, method: 'get' })
            .then(_data => setData({type: args.current.clientType, rows: _data}))
    }

	const handleChange = (event) => {
		if(event.target.id == 'clientType'){
			// if(event.target.value == '')
			// 	setData({type: '', rows:[]})
			// else 
				setData({type: event.target.value, rows:[]})
			// loadData({serviceType: event.target.value})
		}
		args.current[event.target.id] = event.target.value 	
	}
	
	return (<>
		<Helmet>
			<title>Clients | TMS</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<ClientListToolbar loadData={loadData} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<ClientList data={data} />				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
