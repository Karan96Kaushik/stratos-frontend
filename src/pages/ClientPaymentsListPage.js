import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import TaskPaymentsListToolbar from 'src/components/tasks/TaskPaymentsListToolbar';
import { authorizedDownload, authorizedReq} from '../utils/request'
import { LoginContext, LoadingContext } from "../myContext"
import {useLocation, useNavigate, Link} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
// import paymentFields from '../statics/paymentFields';
import {allStatuses, allTasks} from '../statics/taskFields';
import GeneralList from '../components/GeneralList'
import { Add } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import ViewDialog from 'src/components/ViewDialog';
import paymentFields from 'src/statics/paymentFields';


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
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const query = useQuery();
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage, ...sortState})

	useEffect(() => {
		loadData()
	}, [])

	useEffect(async () => {
		console.log("Page num updated")
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
		console.log(search)
		let queryParams = Object.assign({}, search)
		delete queryParams.filters
		navigate("/app/clientaccounts?" + serialize(queryParams));
		if(search?.text?.length > 3 || search?.text?.length == 0 || !search?.text)
			goSearch();
	}, [search])

	const goSearch = () => {
		loadData()
    }

	const loadData = async () => {
		try{
			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/clients/payments/search", 
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
		setData({rows:[]})
		setPage(1)
		setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
	}
	
	const extraFields = []

	const otherFields = [
        {name:"Client Name", id: "name"},
        {name:"Type", id: "clientType"},
        {name:"Total", id: "total"},
        {name:"Task List", id: "taskList"},
        {name:"Balance", id: "balance"},
        {name:"Promoter", id:"promoter"},
        {name:"Remarks", id:"remarks"},
	]

	const defaultFields = {
			texts:[
                {label:"Client Name", id: "name"},
                {label:"Type", id: "clientType"},
                {label:"Total", id: "total"},
                {label:"Balance", id: "balance"},
                {label:"Promoter", id:"promoter"},
                {label:"Remarks", id:"remarks"},
            ],
			checkboxes:[]
	}

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={defaultFields} otherFields={otherFields} typeField={null}/>
		)
	}

	const handleExport = async (password) => {
		try {
			await authorizedDownload({
			route: "/api/client/payments/export", 
			creds: loginState.loginState, 
			data:{...search, password}, 
			method: 'post'
		}, "taskPaymentsExport" + ".xlsx")
	}
	catch (err) {
		snackbar.showMessage(
			String(err?.response?.data ?? err.message ?? err),
		)
	}
	}

	// Add payment button
	const renderButton = (val) => {
		return (				
			<Link to={`/app/payments/add?clientID=${val.clientID}`}>
				<IconButton aria-label="expand row" size="small">
					<Add />
				</IconButton>
			</Link>
		)
	}

	return (<>
		<Helmet>
			<title>Client Accounts | TMS</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<TaskPaymentsListToolbar handleExport={handleExport} fields={extraFields} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={extraFields} 
							defaultFields={defaultFields} 
							type={null} 
							fields={{}} 
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
							setSortState={setSortState}
							sortState={sortState}
							additional={[renderViewButton, renderButton]}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
