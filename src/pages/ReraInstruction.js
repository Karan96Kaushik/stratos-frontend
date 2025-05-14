import { Helmet } from 'react-helmet';
import { Box, Container, Card, CardContent, CardHeader, Divider, Typography, Grid } from '@material-ui/core';
import SettingsNotifications from 'src/components/settings/SettingsNotifications';
import SettingsPassword from 'src/components/settings/SettingsPassword';

const ReraInstruction = () => {
	window.postMessage({ hi:'a' })
	return (
  <>
	<Helmet>
	  <title>RERA Access | CRM</title>
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
						<Typography color='textPrimary'>
							Status: <span id='statusCheck'>Not Installed</span>
						</Typography>
					</Grid>
					<Grid item xs={12}>
							<Typography gutterBottom>
								{/* <a href="/en-ext-v1.1.0.zip" download >
									1. Download Chrome Extension V1.1.0 (29 April 2025)
								</a> */}
								<a href="/en-ext-v3.0.0.zip" download >
									1. Download Chrome Extension V3.0.0 (14 May 2025)
								</a>
							</Typography>

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
								4. Make sure "Developer Mode" is turned on
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ paddingLeft: '50px', // Adjust the indent size as needed
							maxWidth: 500, // Optional: Constraint on the image size
							overflow: 'hidden' }}>
							<img src="/images/rera-dev.png" alt="Random" style={{ width: '100%', height: 'auto' }} />
						</Box>
					</Grid>
					<Grid sx={{paddingTop:3}} item xs={12}>
						<Typography color='textPrimary' gutterBottom>
							5. Select "Load Unpacked" option
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
							6. Select extracted folder "en-ext" (make sure that the selected folder has a file called "manifest.json")
						</Typography>
					</Grid>
					<Grid sx={{paddingTop:0}} item xs={12}>
						<Typography color='textPrimary' gutterBottom>
							7. You should be able to see the installed extension
						</Typography>
					</Grid>
					<Grid  item xs={12}>
						<Box sx={{ paddingLeft: '50px', // Adjust the indent size as needed
							maxWidth: 500, // Optional: Constraint on the image size
							overflow: 'hidden' }}>
						<img src="/images/rera-installed.png" alt="Random" style={{ width: '100%', height: 'auto' }} />
						</Box>
					</Grid>
					<Grid sx={{paddingTop:3}} item xs={12}>
						<Typography color='textPrimary' gutterBottom>
							8. The installation is now completed, refresh the screen and check the installation status at the top of this page
						</Typography>
					</Grid>
					<Grid sx={{paddingLeft:0, paddingTop:5}} item xs={12}>


					<Typography variant="h4" color='textPrimary'>
							Uninstallation
						</Typography>
					</Grid>
					<Grid sx={{paddingTop:3}} item xs={12}>
						<Typography color='textPrimary' gutterBottom>
							1. Uninstallation can be done by selecting the "Remove" option from "Manage Extensions" page from step 5
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ paddingLeft: '50px', // Adjust the indent size as needed
							maxWidth: 500, // Optional: Constraint on the image size
							overflow: 'hidden' }}>
							<img src="/images/uninstall.png" alt="Random" style={{ width: '100%', height: 'auto' }} />
						</Box>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item xs={12}>
						<Typography variant="h4" color='textPrimary'>
							Past Versions
						</Typography>
					</Grid>
					<Grid item xs={12}>
							<Typography gutterBottom>
								<a href="/en-ext-v1.1.0.zip" download >
									1. Download Chrome Extension V1.1.0 (29 April 2025 - Deprecated)
								</a>
							</Typography>

					</Grid>
					<Grid item xs={12}>
						<Typography gutterBottom>
								<a href="/en-ext-v1.0.0.zip" download >
									2. Download Chrome Extension V1.0.0 (Deprecated)
								</a>
							</Typography>
						</Grid>
				</Grid>


			</CardContent>
		</Card>
	  </Container>
	</Box>
  </>
)};

export default ReraInstruction;
