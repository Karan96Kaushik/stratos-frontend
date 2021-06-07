import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import ClientAddForm from 'src/components/clients/ClientAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Client | Material Kit</title>
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
						<ClientAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
