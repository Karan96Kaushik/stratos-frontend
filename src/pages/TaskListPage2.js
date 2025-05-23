import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import TaskListToolbar from 'src/components/tasks/TaskListToolbar2';
import {authorizedReq, authorizedDownload} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import taskFields, { allStatuses, legal, technical, clientSourceOptions } from '../statics/taskFields';
import GeneralList from '../components/GeneralList'
import ViewDialog from '../components/ViewDialog'
import { useSelector } from "react-redux";
import {
	selectFilterFor,
} from "../store/reducers/filtersSlice";
import { selectMembers } from 'src/store/reducers/membersSlice';
import * as _ from 'lodash';
import { correctionTypeOptions } from '../statics/taskFields';

function useQuery(url) {
	const {search} = new URL(url);
	let entries =  new URLSearchParams(search);
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

const TaskList = (props) => {

	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)
	const [data, setData] = useState({type: '', rows:[]})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const filters = useSelector(selectFilterFor("tasks"))
	const memberRows = useSelector(selectMembers)
	const query = useQuery(window.location.href);

	if (query.serviceType)
		query.serviceType = query.serviceType?.split(',') ?? []

	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage})

	useEffect(() => {
		loadData()
		// getMembers()
	}, [])

	useEffect(async () => {
		setSearch({...search, page, rowsPerPage, ...sortState})
	}, [page, rowsPerPage])


	useEffect(async () => {
		const query = useQuery(window.location.href);
		if((query.text !== search.text))
			setSearch({...search, text:query.text || ''})
	}, [useLocation().search])

	useEffect(async () => {
		// Don't update Page num to 1 on FIRST RENDER
		if(sortState.sortDir == -1 && sortState.sortID == 'createdTime')
			setSearch({...search, ...sortState})
		// If another sort state is set to neutral (0); revert to default sortState
		else if(!sortState.sortDir)
			setSortState({sortID:'createdTime', sortDir:-1})
		// reset to page 1 when sort state is changed
		else if(page != 1)
			setPage(1)
		// If page is reset to 1, search useEffect will automatically trigger
		else
			setSearch({...search, ...sortState})
	}, [sortState])

	useEffect(async () => {
		const query = useQuery(window.location.href);
		let queryParams = Object.assign({}, query, search)
		delete queryParams.filters
		navigate("/app/tasks?" + serialize(queryParams));
		if(search.text == "" || search.text?.length > 2 || !search?.text)
			goSearch();
	}, [search])

	const goSearch = (rmk) => {
		loadData()
    }

	const loadData = async () => {
		try{
			let others = {...search}
			others.filters = _.merge({}, filters)

			if(!others?.serviceType?.length)
				others.searchAll = true

			if(others.filters && others.filters._membersAssigned) {
				others.filters._membersAssigned = memberRows.find(m => others.filters._membersAssigned == m.userName + ` (${m.memberID})`)._id
			}

			if(others.filters && others.filters._membersAllocated) {
				others.filters._membersAllocated = memberRows.find(m => others.filters._membersAllocated == m.userName + ` (${m.memberID})`)._id
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
			console.error(err)
			snackbar.showMessage(
				String(err.message ?? err?.response?.data ?? err),
			)
		}
		setLoading({...loading, isActive:false})
	}

	const handleChange = (event) => {
		if (event.target.name == 'serviceType'){
			if (event.target.value.includes('Legal') && !(search.serviceType ?? []).includes('Legal'))
				event.target.value.push(...legal)
			else if (!event.target.value.includes('Legal') && (search.serviceType ?? []).includes('Legal'))
				event.target.value = event.target.value.filter(s => !legal.includes(s))

			if (event.target.value.includes('Technical') && !(search.serviceType ?? []).includes('Technical'))
				event.target.value.push(...technical)
			else if (!event.target.value.includes('Technical') && (search.serviceType ?? []).includes('Technical'))
				event.target.value = event.target.value.filter(s => !technical.includes(s))

			event.target.value = [...new Set(event.target.value)]

			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.name]: event.target.value, type:"", text:""})
		}
	}

	const handleExport = async (password) => {
		try {
			let others = {...search}
			others.filters = _.merge({}, filters)
	
			if(!others?.serviceType?.length)
				others.searchAll = true
	
			if(others.filters && others.filters._membersAssigned) {
				others.filters._membersAssigned = memberRows.find(m => others.filters._membersAssigned == m.userName + ` (${m.memberID})`)._id
			}

			if(others.filters && others.filters._membersAllocated) {
				others.filters._membersAllocated = memberRows.find(m => others.filters._membersAllocated == m.userName + ` (${m.memberID})`)._id
			}
	
			await authorizedDownload({
				route: "/api/tasks/export", 
				creds: loginState.loginState, 
				data:{...others, password}, 
				method: 'post'
			}, "tasksExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err.message ?? err?.response?.data ?? err),
			)
		}
	}

	const dashBoardFields = [
		{name:"Date", id: "createdTime"},
		{name:"Task ID", id: "taskID"},
		{name:"Client Name", id: "clientName"},
		// {name:"Members Assigned", id: "membersAssigned"},
		{name:"Members Allocated", id: "membersAllocated"},
	]

	const commonViewFields = [
		...dashBoardFields,
		// {name:"Members Allocated", id: "membersAllocated"},
		{name:"Correction Type", id: "correctionTaskType", type: "array"},
		{name:"Members Assigned", id: "membersAssigned"},
		{name:"Added By", id:"addedByName"},
		{name:"Ready For Submission", id:"readyForSubmission"},
	]

	const defaultFields = {
		texts:[
			{label:"Type", id: "serviceType"},
			{label:"Promoter", id: "promoter"},
			{label:"Status", id: "status", options: allStatuses},
			{label:"As On Date", id: "asOnDate"},
			{label:"Priority", id:"priority", options: ["", "High", "Medium", "Low"]},
			// {label:"Confirmation Date", id:"confirmationDate", type:"date"},
			{label:"Payment Status", id:"paymentStatus"},
			// {label:"Deadline", id:"deadline", type:"date"},
		],
		checkboxes:[]
	}

	const commonFilters = {
		texts :[
			{label:"Member Assigned", id: "_membersAssigned", options: ([{},...memberRows]).map(val => val.userName ? val.userName + ` (${val.memberID})` : "")},
			{label:"Member Allocated", id: "_membersAllocated", options: ([{},...memberRows]).map(val => val.userName ? val.userName + ` (${val.memberID})` : "")},
			{label:"Branch", id:"branch", options: ["", "Mumbai", "Pune"]},
			{label:"Client Source", id:"clientSource", options:clientSourceOptions},
			{label:"Correction Type", id:"correctionTaskType", options: correctionTypeOptions},
            {label:"Department", id:"department", options:['', 'Package', 'Registration', 'Others - Tech']},
		],
		checkboxes:[
			{label:"Include Archived", id:"archived"},
			{label:"Only Archived", id: "onlyarchived"},
			{label:"Only Removed from Accounts", id: "onlyremovedfromaccounts"},
		]
	}

	if(!search.serviceType)
		commonFilters.texts.push(
			{label:"Status", id: "status", options: allStatuses},
			{label:"Priority", id:"priority", options: ["", "High", "Medium", "Low"]}
		)

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={taskFields} otherFields={commonViewFields} typeField={'serviceType'} titleID={"taskID"} />
		)
	}

	return (<>
		<Helmet>
			<title>Tasks | CRM</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<TaskListToolbar  handleExport={handleExport} commonFilters={commonFilters} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={dashBoardFields} 
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

export default TaskList;
