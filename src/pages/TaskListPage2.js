import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import TaskListToolbar from 'src/components/tasks/TaskListToolbar2';
import {authorizedReq, authorizedDownload} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import taskFields, { allStatuses } from '../statics/taskFields';
import GeneralList from '../components/GeneralList'
import ViewDialog from '../components/ViewDialog'
import { useSelector } from "react-redux";
import {
	selectFilterFor,
} from "../store/reducers/filtersSlice";
import { selectMembers } from 'src/store/reducers/membersSlice';
import * as _ from 'lodash';
import { searchTextHelper, sortHelpler, useQuery } from 'src/utils/helpers';
import { exportHandler } from 'src/utils/handlers';

const TaskList = () => {

	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)
	// let [memberRows, setMemberRows] = useState([{userName:"", memberID:"", _id:""}]);
	const [data, setData] = useState({type: '', rows:[]})
    // const args = useRef({})
	const navigate = useNavigate();
	const snackbar = useSnackbar()

	const filters = useSelector(selectFilterFor("tasks"))
	const memberRows = useSelector(selectMembers)

	const query = useQuery(useLocation);
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage})
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const state = {
		search,			setSearch,
		rowsPerPage, 	setRowsPerPage,
		page, 			setPage,
		sortState, 		setSortState,
		snackbar,
		loginState,
		memberRows,
		filters
	}

	const loadData = async () => {
		try{
			let others = {...search}
			others.filters = _.merge({}, filters)

			if(!others?.serviceType?.length)
				others.searchAll = true

			// Map Member filter string to ID - Multi Select
			if(others.filters?._membersAssigned?.values?.length)
				others.filters._membersAssigned.values = others.filters._membersAssigned.values
					.map(_memberID => (
						memberRows.find(m => _memberID == m.userName + ` (${m.memberID})`)._id
					))
			// Map Member filter string to ID - Single
			else if(others.filters?._membersAssigned?.length)
				others.filters._membersAssigned = memberRows.find(m => others.filters?._membersAssigned == m.userName + ` (${m.memberID})`)._id
			
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

	useEffect(loadData, [])
	useEffect(() => ( setSearch({...search, page, rowsPerPage, ...sortState}) ), 	[page, rowsPerPage])
	useEffect(() => { sortHelpler(state) }, [sortState])
	useEffect(() => { searchTextHelper(state, loadData, "/app/tasks?", navigate) }, [search])

	const handleExport = (password) => ( exportHandler(state, password, "/api/tasks/export") )

	const handleChange = (event) => {
		if (event.target.id == 'serviceType') {
			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
		}
	}

	
	// View Modal and Filters
	const extraFields = [
		{name:"Date", id: "createdTime"},
		{name:"Task ID", id: "taskID"},
		{name:"Client Name", id: "clientName"},
		{name:"Members Assigned", id: "membersAssigned"},
	]

	const defaultFields = {
		texts:[
			{label:"Type", id: "serviceType"},
			{label:"Promoter", id: "promoter"},
			{label:"Status", id: "status", multiSelect:true, options: allStatuses},
			{label:"Priority", id:"priority", multiSelect:true, options: ["", "High", "Medium", "Low"]},
			{label:"Deadline", id:"deadline", type:"date"},
		],
		checkboxes:[]
	}

	const commonFilters = {
		texts :[
			{label:"Member Assigned", id: "_membersAssigned", multiSelect:true, options: (memberRows??[]).map(val => val.userName ? val.userName + ` (${val.memberID})` : "")},
		],
		checkboxes:[
			{label:"Include Archived", id:"archived"}
		]
	}

	if(!search.serviceType)
		commonFilters.texts.push(
			{label:"Status", id: "status", multiSelect:true, options: allStatuses},
			{label:"Priority", id:"priority", multiSelect:true, options: ["", "High", "Medium", "Low"]}
		)

	// View button
	const renderViewButton = (val) => (				
		<ViewDialog data={val} fields={taskFields} otherFields={extraFields} typeField={'serviceType'} titleID={"taskID"} />
	)

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
				<TaskListToolbar  handleExport={handleExport} commonFilters={commonFilters} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={loadData}/>
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

export default TaskList;
