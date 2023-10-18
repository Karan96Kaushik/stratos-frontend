import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import TicketAddForm from 'src/components/tickets/TicketAddForm';
import TicketMessenger from 'src/components/tickets/TicketMessenger';

const TicketAdd = () => {

	const isUpdate = Boolean(location.pathname.includes("edit"))

	return (
	<>
		<Helmet>
			<title>Ticket | TMS</title>
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
						<TicketAddForm/>
					</Grid>
					<Grid item lg={8} md={6} xs={12}>
						{isUpdate && <TicketMessenger/>}
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
)};

export default TicketAdd;
