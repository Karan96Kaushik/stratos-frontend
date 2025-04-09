import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import PackagesAddForm from 'src/components/packages/PackagesAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Package | CRM</title>
		</Helmet>
		<Box sx={
			{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}
		}>
			<Container maxWidth="lg">
				<Grid container
					spacing={3}>
					<Grid item lg={8} md={6} xs={12}>
						<PackagesAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
