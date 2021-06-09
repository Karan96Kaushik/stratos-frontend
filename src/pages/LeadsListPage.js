import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import LeadListToolbar from 'src/components/leads/LeadListToolbar';
import LeadList from 'src/components/leads/LeadList';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
    const [data, setData] = React.useState({type: '', rows:[]})
    const args = React.useRef({})
	
	const goSearch = () => {
        authorizedReq({ route: "/api/leads/search", creds: loginState.loginState, data:{clientType: args.current.clientType}, method: 'get' })
            .then(_data => setData({type: args.current.clientType, rows: _data}))
    }

	const handleChange = (event) => {
		if(event.target.id == 'serviceType'){
			setData({type: event.target.value, rows:[]})
		}
		args.current[event.target.id] = event.target.value 	
	}
	

	return (<>
		<Helmet>
			<title>Leads | TMS</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<LeadListToolbar searchInfo={args} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<LeadList data={data} />				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
