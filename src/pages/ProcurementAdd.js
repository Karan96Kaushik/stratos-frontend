import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import ProcurementAddForm from 'src/components/procurements/ProcurementAddForm';

const ProcurementAdd = () => (
	<>
		<Helmet>
			<title>Add Procurement | CRM</title>
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
						<ProcurementAddForm/>
					</Grid>
				</Grid>
			</Container>
		</Box>
	</>
);

export default ProcurementAdd;
