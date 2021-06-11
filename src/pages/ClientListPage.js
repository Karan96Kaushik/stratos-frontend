import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import ClientListToolbar from 'src/components/clients/ClientListToolbar';
import ClientList from 'src/components/clients/ClientList';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'

function useQuery() {
	let entries =  new URLSearchParams(useLocation().search);
	const result = {}
	for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

const serialize = function(obj) {
	var str = [];
	for (var p in obj)
	  if (obj.hasOwnProperty(p)) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	  }
	return str.join("&");
  }

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
    const [data, setData] = React.useState({type: '', rows:[]})
    const args = React.useRef({})
	const navigate = useNavigate();
	
	const query = useQuery();

	useEffect(() => {
		if(Object.keys(query).length) {
			args.current = query
			loadData()
		}
	}, [])
	
	const goSearch = () => {
		console.log(args.current)
		loadData()	
		navigate("/app/clients?" + serialize(args.current))
	}

	const loadData = () => {
		console.log("ASSA", )
        authorizedReq({
			route: "/api/clients/search", 
			creds: loginState.loginState, 
			data:{clientType: args.current.clientType}, 
			method: 'get'
		})
            .then(_data => setData({type: args.current.clientType, rows: _data}))
    }

	const handleChange = (event) => {
		if(event.target.id == 'clientType'){
			setData({type: event.target.value, rows:[]})
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
				<ClientListToolbar searchInfo={args} handleChange={handleChange} goSearch={goSearch}/>
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
