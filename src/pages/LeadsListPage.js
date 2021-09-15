import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import LeadListToolbar from 'src/components/leads/LeadListToolbar';
import {authorizedReq, authorizedDownload} from '../utils/request'
import { LoginContext, LoadingContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import leadFields from '../statics/leadFields';
import GeneralList from '../components/GeneralList'
import ViewDialog from 'src/components/ViewDialog';

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
	const {loading, setLoading} = useContext(LoadingContext)
    const [data, setData] = useState({type: '', rows:[]})
    // const args = useRef({})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const query = useQuery();
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25
	if(!query.leadType)
		query.leadType = 'developer'

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage, ...sortState})

	useEffect(() => {
		if(query.leadType) {
			loadData()
		}
	}, [])

	useEffect(async () => {
		setSearch({...search, page, rowsPerPage, ...sortState})
	}, [page, rowsPerPage])

	useEffect(async () => {
		if(!sortState.sortDir) {
			setSortState({sortID:'createdTime', sortDir:-1})
			return
		}
		if(page != 1)
			setPage(1)
		else
			setSearch({...search, ...sortState})
	}, [sortState])

	useEffect(async () => {
		let queryParams = Object.assign({}, search)
		delete queryParams.filters
		navigate("/app/leads?" + serialize(queryParams));
		if(search.leadType)
			goSearch();
	}, [search])

	const goSearch = (rmk) => {
		loadData()
    }

	const loadData = async () => {
		try{
			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/leads/search", 
				creds: loginState.loginState, 
				data:{...search}, 
				method: 'post'
			})
			setData({rows:_data})

		} catch (err) {
			snackbar.showMessage(
				err?.response?.data ?? err.message ?? err,
			)
		}
		setLoading({...loading, isActive:false})
	}

	const handleChange = (event) => {
		if (event.target.id == 'leadType'){
			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
		}
	}

	const handleExport = async (password) => {
		try {
			await authorizedDownload({
				route: "/api/leads/export", 
				creds: loginState.loginState, 
				data:{...search, password}, 
				method: 'post',
				password
			}, "leadsExport-" + search.leadType + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
	}
	
	const extraFields = [
		{name:"Date", id: "createdTime"},
		{name:"Lead ID", id: "leadID"},
		{name:"Member Assigned", id: "memberName"},
		{name:"Type", id: "leadType"},
	]

	const defaultFields = {
		texts:[
            {label:"Lead Responsibility", id:"leadResponsibility", isHidden:false},
			{label:"Status", id: "status"},
		],
		checkboxes:[]
	}

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={leadFields} otherFields={extraFields} typeField={'leadType'}/>
		)
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
				<LeadListToolbar handleExport={handleExport} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={extraFields} 
							type={null}//search.leadType} 
							fields={leadFields} 
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							defaultFields={defaultFields} 
							additional={[renderViewButton]}
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
							setSortState={setSortState}
							sortState={sortState}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
