import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import LeadListToolbar from 'src/components/leads/LeadListToolbar';
import LeadList from 'src/components/leads/LeadList';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'

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

	const loginState = useContext(LoginContext)
    const [data, setData] = useState({type: '', rows:[]})
    const args = useRef({})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	
	const query = useQuery();
	const [search, setSearch] = useState({...query})

	useEffect(() => {
		if(Object.keys(query).length) {
			loadData()
		}
	}, [])

	const goSearch = () => {
		console.log(search)
		loadData()
		navigate("/app/leads?" + serialize(search))
    }

	const loadData = async () => {
		try{
			const _data = await authorizedReq({
				route: "/api/leads/search", 
				creds: loginState.loginState, 
				data:{...search}, 
				method: 'get'
			})
			setData({type: search.leadType, rows: _data})

		} catch (err) {
			snackbar.showMessage(err.message)
		}
    }

	const handleChange = (event) => {
		if(event.target.id == 'leadType'){
			setData({rows:[]})
			setSearch({[event.target.id]: event.target.value, type:"", text:""})
		}
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
				<LeadListToolbar searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<LeadList data={data} search={search} />				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
