import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import AgentsTable from 'src/components/customer/AgentsTable';
import ProjectsTable from 'src/components/customer/ProjectsTable';
import LitigationsTable from 'src/components/customer/LitigationsTable';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
    const [rows, setRows] = React.useState([])
	const [tab, setTab] = React.useState(-1);

    const loadData = (args) => {
        authorizedReq({ route: "/api/clients/", creds: loginState.loginState, data:{...args}, method: 'get' })
            .then(data => setRows(data))
    }

	React.useEffect(() => {
		switch (tab) {
			case 0:
				loadData({clientType:'agent'})			
				break;
			case 1:
				loadData({clientType:'project'})
				break;
			case 2:
				loadData({clientType:'litigation'})		
				break;
		}
	}, [tab]);

	const handleChange = (event, newValue) => {
		setTab(newValue);
	};
	
	return (<>
		<Helmet>
			<title>Customers | TMS</title>
		</Helmet>
		<Box
			sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}
		>
			<Container maxWidth={false}>
				<CustomerListToolbar loadData={loadData} />
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<Tabs
							value={tab}
							indicatorColor="primary"
							textColor="primary"
							onChange={handleChange}
							aria-label="disabled tabs example"
							variant="scrollable"
						>
							<Tab label="Agents - Technical" />
							<Tab label="Projects - Technical" />
							<Tab label="Litigation - Technical" />
							<Tab label="Disabled" disabled />
							<Tab label="Active" />
						</Tabs>
					</Paper>
					{tab == 0 && (
						<AgentsTable rows={rows} />
					)}	
					{tab == 1 && (
						<ProjectsTable rows={rows} />
					)}	
					{tab == 2 && (
						<LitigationsTable rows={rows} />
					)}	
					
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
