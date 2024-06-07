import { Helmet } from 'react-helmet';
import { 
	Box, Container, Grid,
	Tabs, Tab,
	Typography,
	Popover,
	Button,
	IconButton
} from '@material-ui/core';
import DashCard from 'src/components/dashboard/DashCard';
import DatePicker from 'src/components/DatePicker';
import LatestOrders from 'src/components/dashboard/LatestOrders';
import LatestProducts from 'src/components/dashboard/LatestProducts';
import Sales from 'src/components/dashboard/Sales';
import TasksProgress from 'src/components/dashboard/TasksProgress';
import TasksBreakdown from 'src/components/dashboard/TasksBreakdown';
import TotalCustomers from 'src/components/dashboard/TotalCustomers';
import TotalProfit from 'src/components/dashboard/TotalProfit';
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../utils/request'
import {useRef, useEffect, useState, useContext} from 'react';
import { LoadingContext, LoginContext } from "../myContext"
import { useLocation, useNavigate } from 'react-router-dom'
import { PeopleOutlined, Money } from '@material-ui/icons';
import { red, green, blue } from '@material-ui/core/colors';
import GeneralListCard from 'src/components/dashboard/GeneralListCard';
import { personalDashboards, adminDashboards } from 'src/statics/dashboard';
import { DateRangePicker } from "materialui-daterange-picker";
import './dashboard.css';
import MultiDashCard from 'src/components/dashboard/MultiDashCard';
import { Calendar } from 'react-feather';
import moment from 'moment';

const Dashboard = () => {
	
	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)

	const userDept = loginState.loginState.department

	const [activeDash, setActiveDash] = useState({title:'Main'})
	const [data, setData] = useState({type: '', rows:[]})
	const [customData, setCustomData] = useState({})

	// Default 7 days
	const [dateRange, setDateRange] = useState({startDate: moment(new Date()).add({days:-7}), endDate: new Date()});

	const navigate = useNavigate()
	const snackbar = useSnackbar()

	let allDashboards = _.merge({}, personalDashboards.dashboards)

	if (userDept == 'Administration') {
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
			if (!customData?.[c] && typeof comp !== 'undefined' && comp.dateUsed)
				data[c] = await getCustomData(c, comp.api)
		}))
		setCustomData({...customData, ...data})
	}, [dateRange])

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
				<Grid item lg={6} sm={6} xl={6}	xs={12} >
				<Tabs value={activeDash.title} onChange={handleDashChange} centered={false}>
					<Tab label='Main' value={'Main'}/>
					{personalDashboards.departments[userDept]?.dashboards?.map(d => <Tab label={d} value={d}/>)}
					{userDept == 'Administration' && Object.keys(adminDashboards?.dashboards ?? {})?.map(d => <Tab label={d} value={d}/>)}
				</Tabs>
				</Grid>
				<Grid item lg={6} sm={6} xl={6}	xs={12}  textAlign='right' sx={{paddingRight:10}}>

					<DatePicker setDateRange={setDateRange} dateRange={dateRange} />


				</Grid>
			</Grid>
			<Container maxWidth={false}>
				<Grid container spacing={3}>
					{Object.keys(activeDash.components ?? {}).map(title => (
						<>
						{(activeDash.components[title].type == 'list') && <Grid item lg={6} sm={6} xl={6} xs={12}>
							<GeneralListCard fields={activeDash.components[title].fields} data={customData?.[title]} title={title} />
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
