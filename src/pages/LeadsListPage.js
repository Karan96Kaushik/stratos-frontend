import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import LeadListToolbar from 'src/components/leads/LeadListToolbar';
import LeadList from 'src/components/leads/LeadList';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import leadFields from '../statics/leadFields';
import GeneralList from '../components/GeneralList'

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

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 2);
	const [search, setSearch] = useState({...query, page, rowsPerPage})

	useEffect(() => {
		if(Object.keys(query).length) {
			loadData()
		}
	}, [])

	useEffect(async () => {
		setSearch({...search, page, rowsPerPage})
	}, [page, rowsPerPage])

	useEffect(async () => {
		navigate("/app/leads?" + serialize(search));
		goSearch("PG");
	}, [search])

	const goSearch = (rmk) => {
		loadData()
    }

	const loadData = async () => {
		try{
			const _data = await authorizedReq({
				route: "/api/leads/search", 
				creds: loginState.loginState, 
				data:{...search}, 
				method: 'get'
			})
			setData({rows:_data})

		} catch (err) {
			snackbar.showMessage(err.message)
		}
    }

	const handleChange = (event) => {
		if (event.target.id == 'leadType'){
			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
		}
	}
	
	const extraFields = [
		{name:"Lead ID", id: "leadID"},
		{name:"memberID", id: "memberID"},
	]

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
						<GeneralList
							extraFields={extraFields} 
							type={search.leadType} 
							fields={leadFields} 
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
