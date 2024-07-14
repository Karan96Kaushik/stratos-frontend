import { Helmet } from 'react-helmet';
import { 
	Box, Container, Grid,
	Tabs, Tab,
	TextField,
} from '@material-ui/core';
import DashCard from 'src/components/dashboard/DashCard';
import DatePicker from 'src/components/DatePicker';
import TasksProgress from 'src/components/dashboard/TasksProgress';
import TasksBreakdown from 'src/components/dashboard/TasksBreakdown';
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../utils/request'
import {useEffect, useState, useContext} from 'react';
import { LoadingContext, LoginContext } from "../myContext"
import { Money } from '@material-ui/icons';
import { green, blue } from '@material-ui/core/colors';
import GeneralListCard from 'src/components/dashboard/GeneralListCard';
import { personalDashboards, adminDashboards } from 'src/statics/dashboard';
import './dashboard.css';
import MultiDashCard from 'src/components/dashboard/MultiDashCard';
import moment from 'moment';
import { useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
import { selectMembers } from 'src/store/reducers/membersSlice';

const Dashboard = () => {
	
	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)

	const memberRows = useSelector(selectMembers).filter(m => !m.userName.includes('Department')) //.unshift()

	const userDept = loginState.loginState.department

	const [activeDash, setActiveDash] = useState({title:'Main'})
	const [data, setData] = useState({type: '', rows:[]})
	const [customData, setCustomData] = useState({})
	const [member, setMember] = useState(false)

	// Default 7 days
	const [dateRange, setDateRange] = useState({startDate: moment(new Date()).add({days:-7}).toDate(), endDate: new Date()});

	const snackbar = useSnackbar()

	let allDashboards = _.merge({}, personalDashboards.dashboards)

	let isAdmin = userDept == 'Administration'

	if (isAdmin) {
		allDashboards = {...allDashboards, ...adminDashboards.dashboards}
	}

	const handleDashChange = (e, v) => {
		const components = allDashboards[v]?.components
		setActiveDash({title: v, components})
	}

	useEffect(() => {
		getData()
	}, [])

	useEffect(async () => {
		const data = {}
		await Promise.all(Object.keys(activeDash.components ?? {}).map(async c => {
			const comp = activeDash.components?.[c]
			if (typeof comp !== 'undefined' && comp.dateUsed)
				data[c] = await getCustomData(c, comp.api)
		}))
		setCustomData({...customData, ...data})
	}, [dateRange, member])

	useEffect(async () => {
		const data = {}
		await Promise.all(Object.keys(activeDash.components ?? {}).map(async c => {
			const comp = activeDash.components?.[c]
			if (!customData?.[c] && typeof comp !== 'undefined')
				data[c] = await getCustomData(c, comp.api)
		}))
		setCustomData({...customData, ...data})
	}, [activeDash.title])


	const getCustomData = async (title, api) => {
		try{
			let params = dateRange
			if (member) params._memberId = member

			console.debug(">>>>", member)

			let data = await authorizedReq({
				route: api, 
				creds: loginState.loginState, 
				method: 'get',
				data:dateRange
			})

			return data

		} catch (err) {
			snackbar.showMessage(
				String(err.message ?? err?.response?.data ?? err),
			)
		}
	}

	console.debug(customData)

	const getData = async () => {
		try{
			setLoading({...loading, isActive:true})

			let resp = await authorizedReq({
				route: "/api/dashboard", 
				creds: loginState.loginState, 
				method: 'get'
			})
			resp.completed = ((resp?.taskStatus?.["Completed"] ?? 0) / resp.assigned) * 100
			resp.traffic = {
				values:[],
				labels:[],
			}
			Object.keys(resp?.taskStatus).forEach((val,i) => {
				resp.traffic.values.push(resp?.taskStatus[val])
				resp.traffic.labels.push(val)
			})
			setData(resp)

		} catch (err) {
			snackbar.showMessage(
				String(err.message ?? err?.response?.data ?? err),
			)
		}
		setLoading({...loading, isActive:false})
	}

	return (<>
		<Helmet>
			<title>Dashboard | TMS</title>
		</Helmet>
		<Box sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 3 }}>
			<Grid container spacing={3} sx={{paddingBottom:2}}>

				<Grid item lg={7} sm={7} xl={7}	xs={12} >
					<Tabs value={activeDash.title} onChange={handleDashChange} centered={false}>
						<Tab label='Main' value={'Main'}/>
						{personalDashboards.departments[userDept]?.dashboards?.map(d => <Tab label={d} value={d}/>)}
						{userDept == 'Administration' && Object.keys(adminDashboards?.dashboards ?? {})?.map(d => <Tab label={d} value={d}/>)}
					</Tabs>
				</Grid>

				{/* <Grid item lg={1} sm={1} xl={1}	xs={12}  textAlign='right' sx={{}}>
				</Grid> */}

				{/* <Grid item lg={3} sm={3} xl={3}	xs={12} alignContent='right' textAlign='right' sx={{}}>
					{isAdmin && <TextField
						fullWidth
						label="Member"
						id="_members"
						value={''}
						select={true}
						SelectProps={{ native: true }}
						// onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
						variant="outlined"
					>
						{([{},...(memberRows ?? [])]).filter(m => !m.isDept).map((m) => (
							<option
								key={m.userName}
								value={m._id}
							>
								{m.userName}
							</option>
						))}
					</TextField>}
				</Grid> */}

				{activeDash.title !== 'Main' && userDept == 'Administration' && 
					<>
						<Grid item lg={2} sm={7} xl={7}	xs={12}  textAlign='right' sx={{paddingRight:3, paddingLeft:0}}>
							<TextField
								fullWidth
								select='true'
								SelectProps={{ native: true }}
								label='Member'
								type='text'
								// inputProps={field.type == "file" ? { multiple: true } : {}}
								// InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
								// required={field.isRequired}
								id='_memberId'
								onChange={(e) => {setMember(e.target.value)}}
								// value={field.id != "files" ? values[field.id] ?? '' : undefined}
								variant="standard"
							>
								{[...(memberRows ?? []), {_id:'', userName:''}].map((option) => (
									<option
										key={option._id}
										value={option._id}
									>
										{option.userName}
									</option>
								))}
							</TextField>
						</Grid>
						<Grid item lg={3} sm={6} xl={6}	xs={12}  textAlign='right' sx={{paddingRight:3, paddingLeft:0}}>
							<DatePicker setDateRange={setDateRange} dateRange={dateRange} />
						</Grid>
					</>}

			</Grid>
			<Container maxWidth={false}>
				<Grid container spacing={3}>
					{Object.keys(activeDash.components ?? {}).map(title => (
						<>
						{(activeDash.components[title].type == 'list') && <Grid item lg={6} sm={6} xl={6} xs={12}>
							<GeneralListCard fields={activeDash.components[title].fields} data={customData?.[title]} title={title} linkpre={activeDash.components[title].linkpre} linkfield={activeDash.components[title].linkfield}/>
						</Grid>}
						{(activeDash.components[title].type == 'multicard') && <Grid item lg={6} sm={6} xl={6} xs={12}>
							<MultiDashCard title={title} data={customData?.[title]} fields={activeDash.components[title].fields} />
						</Grid>}
						</>
					))}
						{/* <Grid item lg={6} sm={6} xl={6}	xs={12}>
							 <Budget />
						</Grid> */}
					{activeDash.title == 'Main' && <>
						<Grid item lg={3} sm={6} xl={3}	xs={12}>
							<DashCard 
								title={"ASSIGNED TASKS"} 
								subtitle={data.assigned} 
								iconColor={blue[200]} 
								icon={<Money/>}
							/>
						</Grid>
						<Grid item lg={3} sm={6} xl={3}	xs={12}>
							<DashCard 
								title={"ADDED TASKS"} 
								subtitle={data.added} 
								// body={"by user"} 
								iconColor={blue[600]} 
								icon={<Money/>}
							/>
						</Grid>
						<Grid item lg={3} sm={6} xl={3}	xs={12}>
							<TasksProgress percent={data.completed} />
						</Grid>
						<Grid item lg={3} sm={6} xl={3}	xs={12}>
							<DashCard 
								title={"ADDED CLIENTS"} 
								subtitle={data.addedClients} 
								// body={"by user"} 
								iconColor={green[600]} 
								icon={<Money/>}
							/>
						</Grid>
						<Grid item lg={12} sm={12} xl={12}	xs={12}>
							<TasksBreakdown sx={{ height: '100%' }} data={data.traffic} />
						</Grid>
					</>}
				</Grid>
			</Container>
		</Box>
	</>)
};

export default Dashboard;
