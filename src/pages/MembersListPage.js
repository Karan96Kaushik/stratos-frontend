import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import MemberListToolbar from 'src/components/members/MemberListToolbar';
import MemberList from 'src/components/members/MemberList';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
    const [rows, setRows] = React.useState([])
	const snackbar = useSnackbar()

    const loadData = () => {
        authorizedReq({ route: "/api/members/", creds: loginState.loginState, data:{}, method: 'get' })
            .then(data => setRows(data))
			.catch(() => {
				snackbar.showMessage(
					"Error: " + err?.response?.data ?? err,
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
