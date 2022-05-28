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
			<Container maxWidth="xl">
                <HearingDateCalendar/>
			</Container>
		</Box>
	</>
);

export default Account;
