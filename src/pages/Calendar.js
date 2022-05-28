import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import HearingDateCalendar from 'src/components/HearingDateCalendar';

const Account = () => (
	<>
		<Helmet>
			<title>Calendar</title>
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
						<HearingDateCalendar/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default Account;
