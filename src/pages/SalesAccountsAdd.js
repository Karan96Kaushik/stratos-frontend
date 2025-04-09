import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import SalesAccountAddForm from 'src/components/sales/SalesAccountAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Sales Lead | CRM</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth="lg">
				<Grid container
					spacing={3}>
					<Grid item lg={8} md={6} xs={12}>
						<SalesAccountAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
