import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import SalesAddForm from 'src/components/sales/SalesAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Sales Lead | TMS</title>
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
						<SalesAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
