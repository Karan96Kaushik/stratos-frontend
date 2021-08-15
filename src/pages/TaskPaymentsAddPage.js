import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import TaskPaymentsAddForm from 'src/components/tasks/TaskPaymentsAddForm';

const Account = () => (
	<>
		<Helmet>
			<title>Add Task | Material Kit</title>
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
						<TaskPaymentsAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
