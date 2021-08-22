import { Helmet } from 'react-helmet';
import { 
	Box, Container, Grid
} from '@material-ui/core';
import DashCard from 'src/components/dashboard/DashCard';
import LatestOrders from 'src/components/dashboard//LatestOrders';
import LatestProducts from 'src/components/dashboard//LatestProducts';
import Sales from 'src/components/dashboard//Sales';
import TasksProgress from 'src/components/dashboard//TasksProgress';
import TotalCustomers from 'src/components/dashboard//TotalCustomers';
import TotalProfit from 'src/components/dashboard//TotalProfit';
import TrafficByDevice from 'src/components/dashboard//TrafficByDevice';
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../utils/request'
import {useRef, useEffect, useState, useContext} from 'react';
import { LoadingContext, LoginContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import {PeopleOutlined, Money} from '@material-ui/icons';
import { red, green, blue } from '@material-ui/core/colors';

const Dashboard = () => {

	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)

	const [data, setData] = useState({type: '', rows:[]})
	const navigate = useNavigate();
	const snackbar = useSnackbar()

	useEffect(() => {
		getData()
	}, [])

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
			<Container maxWidth={false}>
				<Grid container spacing={3}>
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
						<TrafficByDevice sx={{ height: '100%' }} data={data.traffic} />
					</Grid>
					<Grid item lg={3} sm={6} xl={3}	xs={12}>
						{/* <TotalProfit sx={{ height: '100%' }} /> */}
					</Grid>
					<Grid item lg={6} sm={6} xl={6}	xs={12}>
						{/* <Sales /> */}
						{/* <TotalCustomers /> */}
					</Grid>
					<Grid item lg={6} sm={6} xl={6}	xs={12}>
						{/* <LatestProducts sx={{ height: '100%' }} /> */}
					</Grid>
					<Grid item lg={6} sm={6} xl={6}	xs={12}>
						{/* <LatestOrders /> */}
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>)
};

export default Dashboard;
