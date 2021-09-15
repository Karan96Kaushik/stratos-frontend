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
		navigate("/app/taskaccounts?" + serialize(queryParams));
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
				route: "/api/tasks/payments/search", 
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
		{name:"Task Date", id: "createdTime"},
		{name:"Task ID", id: "taskID"},
		{name:"Type", id: "serviceType", options:["",...allTasks]},
		{name:"Client Name", id: "clientName"},
		{name:"Status", id: "status", options:allStatuses},
		{name:"Promoter", id: "promoter"},
		{name:"Remarks", id: "remarks"},
		{name:"Bill Amount", id:"billAmount", type:"number"},
		{name:"GST", id:"gst", type:"number"},
		{name:"SRO Fees", id:"sroFees", type:"number"},
		{name:"Government Fees", id:"govtFees", type:"number"},
		{name:"Total", id:"total", type:"number"},
		{name:"Received", id:"received", type:"number"},
		{name:"Balance", id:"balance", type:"number"},
	]

	const defaultFields = {
			texts:[
				{label:"Task Date", id: "createdTime"},
				{label:"Task ID", id: "taskID"},
				{label:"Type", id: "serviceType", options:["",...allTasks]},
				{label:"Client Name", id: "clientName"},
				{label:"Promoter", id: "promoter"},
				{label:"Status", id: "status", options:allStatuses},
				// {label:"Remarks", id: "remarks"},
				// {label:"Bill Amount", id:"billAmount", type:"number"},
				// {label:"GST", id:"gst", type:"number"},
				// {label:"SRO Fees", id:"sroFees", type:"number"},
				// {label:"Government Fees", id:"govtFees", type:"number"},
				{label:"Total", id:"total", type:"number"},
				{label:"Received", id:"received", type:"number"},
				{label:"Balance", id:"balance", type:"number"},
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
			route: "/api/tasks/payments/export", 
			creds: loginState.loginState, 
			data:{...search}, 
			method: 'post',
			password
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
			<Link to={`/app/payments/add?taskID=${val.taskID}`}>
				<IconButton aria-label="expand row" size="small">
					<Add />
				</IconButton>
			</Link>
		)
	}

	return (<>
		<Helmet>
			<title>Task Accounts | TMS</title>
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
