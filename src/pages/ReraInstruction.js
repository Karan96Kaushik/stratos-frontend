import { Helmet } from 'react-helmet';
import { Box, Container, Card, CardContent, CardHeader, Divider, Typography, Grid } from '@material-ui/core';
import SettingsNotifications from 'src/components/settings/SettingsNotifications';
import SettingsPassword from 'src/components/settings/SettingsPassword';

const ReraInstruction = () => (
  <>
	<Helmet>
	  <title>Settings | TMS</title>
	</Helmet>
	<Box
	  sx={{
		backgroundColor: 'background.default',
		minHeight: '100%',
		py: 3
	  }}
	>
	  <Container maxWidth="lg">
		{/* <SettingsNotifications /> */}
		<Card>
			<CardHeader
			subheader="Available only on desktop google chrome browser"
			title="Setup MahaRERA Access"
			/>
			<Divider />
			<CardContent> 

				<Grid container>
					<Grid sx={{paddingLeft:20, paddingBottom:5}} item xs={12}>
						<Typography color='textPrimary' onClick={window.postMessage({ hi:'a' })}>
							Status Check : <span id='statusCheck'>Not Installed</span>
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<a href="https://github.com/user-attachments/files/16144464/en-chrome-ext.zip" download >
							<Typography gutterBottom>
								1. Download Chrome Extension
							</Typography>
						</a>
					</Grid>
					<Grid item xs={12}>
						<Typography color='textPrimary' gutterBottom>
								2. Extract zip file contents
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography color='textPrimary' gutterBottom>
								3. Open "Manage Extensions" from top right options menu
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ paddingLeft: '50px', // Adjust the indent size as needed
							maxWidth: 500, // Optional: Constraint on the image size
							overflow: 'hidden' }}>
							<img src="/images/RERA-manage-entensions.png" alt="Random" style={{ width: '100%', height: 'auto' }} />
						</Box>
					</Grid>
					<Grid sx={{paddingTop:3}} item xs={12}>
						<Typography color='textPrimary' gutterBottom>
							4. Select "Load Unpacked" option
						</Typography>
					</Grid>
					<Grid  item xs={12}>
						<Box sx={{ paddingLeft: '50px', // Adjust the indent size as needed
							maxWidth: 500, // Optional: Constraint on the image size
							overflow: 'hidden' }}>
						<img src="/images/RERA-load.png" alt="Random" style={{ width: '100%', height: 'auto' }} />
						</Box>
					</Grid>
					<Grid sx={{paddingTop:3}} item xs={12}>
						<Typography color='textPrimary' gutterBottom>
							5. Select extracted folder
						</Typography>
					</Grid>
				</Grid>



			</CardContent>
		</Card>
	  </Container>
	</Box>
  </>
);

export default ReraInstruction;
