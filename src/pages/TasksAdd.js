import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import TaskAddForm from 'src/components/tasks/TaskAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Member | Material Kit</title>
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
						<TaskAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
