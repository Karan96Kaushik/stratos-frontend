import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import PaymentsAddForm from 'src/components/payments/PaymentsAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Payment | TMS</title>
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
						<PaymentsAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
