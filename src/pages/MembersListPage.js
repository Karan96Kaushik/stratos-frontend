import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import MemberListToolbar from 'src/components/members/MemberListToolbar';
import MemberList from 'src/components/members/MemberList';
import {authorizedReq} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
	const {loading, setLoading} = React.useContext(LoadingContext)
    const [rows, setRows] = React.useState([])
	const snackbar = useSnackbar()

    const loadData = () => {
		setLoading({...loading, isActive:true})
        authorizedReq({ route: "/api/members/", creds: loginState.loginState, data:{}, method: 'get' })
            .then(data => {
				setRows(data)
				setLoading({...loading, isActive:false})
			})
			.catch((err) => {
				console.debug(err)
				console.debug(err?.response?.data, err.message)
				snackbar.showMessage(
					err?.response?.data ?? err.message ?? err,
				)
			})
    }

	React.useEffect(() => {
		loadData()
	}, []);
	
	return (<>
		<Helmet>
			<title>Members | TMS</title>
		</Helmet>
		<Box
			sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}
		>
			<Container maxWidth={false}>
				<MemberListToolbar loadData={loadData} />
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<MemberList rows={rows} />				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
