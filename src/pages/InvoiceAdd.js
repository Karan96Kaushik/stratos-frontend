import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import InvoiceAddForm from 'src/components/invoices/InvoiceAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Invoice | CRM</title>
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
						<InvoiceAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
