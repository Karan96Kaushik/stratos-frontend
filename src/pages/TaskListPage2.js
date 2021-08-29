import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import TaskListToolbar from 'src/components/tasks/TaskListToolbar2';
import {authorizedReq} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import taskFields, { allStatuses } from '../statics/taskFields';
import GeneralList from '../components/GeneralList'
import ViewDialog from '../components/ViewDialog'

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
	const [memberRows, setMemberRows] = useState([{userName:"", memberID:"", _id:""}]);

	const [data, setData] = useState({type: '', rows:[]})
    // const args = useRef({})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const query = useQuery();
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage})

	useEffect(() => {
		loadData()
		getMembers()
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
		navigate("/app/tasks?" + serialize(queryParams));
		if(search.text == "" || search.text?.length > 2 || !search?.text)
			goSearch();
	}, [search])

	const goSearch = (rmk) => {
		loadData()
    }

	const getMembers = async () => {
		try {
			let response = await authorizedReq({ route: "/api/members/search", creds: loginState.loginState, data: {}, method: 'get' })
			response = [
				{},
				...response
			]
			setMemberRows(response)
			return response

		} catch (err) {
			snackbar.showMessage(
				"Error getting members - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
	};

	const loadData = async () => {
		try{
			let others = {...search}
			others.filters = {...others.filters}

			if(!others?.serviceType?.length)
				others.searchAll = true

			if(others.filters && others.filters.memberName) {
				others.filters._memberID = memberRows.find(m => others.filters.memberName == m.userName + ` (${m.memberID})`)._id
				delete others.filters.memberName
			}

			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/tasks/search", 
				creds: loginState.loginState, 
				data:{...others}, 
				method: 'post'
			})
			setData({rows:_data})

		} catch (err) {
			snackbar.showMessage(
				String(err.message ?? err?.response?.data ?? err),
			)
		}
		setLoading({...loading, isActive:false})
	}

	const handleChange = (event) => {
		if (event.target.id == 'serviceType'){
			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
		}
	}
	
	const extraFields = [
		{name:"Date", id: "createdTime"},
		{name:"Task ID", id: "taskID"},
		{name:"Client Name", id: "clientName"},
		{name:"Member Assigned", id: "memberName"},
	]

	const defaultFields = {
		texts:[
			{label:"Type", id: "serviceType"},
			{label:"Status", id: "status", options: allStatuses},
			{label:"Priority", id:"priority", options: ["", "High", "Medium", "Low"]},
			{label:"Deadline", id:"deadline", type:"date"},
		],
		checkboxes:[]
	}

	const commonFilters = {texts :[
		{label:"Member Assigned", id: "memberName", options: memberRows.map(val => val.userName ? val.userName + ` (${val.memberID})` : "")},
	]}

	if(!search.serviceType)
		commonFilters.texts.push(
			{label:"Status", id: "status", options: allStatuses},
			{label:"Priority", id:"priority", options: ["", "High", "Medium", "Low"]}
		)

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={taskFields} otherFields={extraFields} typeField={'serviceType'} titleID={"taskID"} />
		)
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
				<TaskListToolbar commonFilters={commonFilters} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={extraFields} 
							type={null}//{search.serviceType} 
							fields={taskFields} 
							defaultFields={defaultFields} 
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
							setSortState={setSortState}
							additional={[renderViewButton]}
							sortState={sortState}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
