import { Helmet } from 'react-helmet';
import { Box, Container, Card, CardContent, CardHeader, Divider, Typography, Grid } from '@material-ui/core';
import SettingsNotifications from 'src/components/settings/SettingsNotifications';
import SettingsPassword from 'src/components/settings/SettingsPassword';

const ReraInstruction = () => {
	window.postMessage({ hi:'a' })
	return (
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
					<Grid sx={{paddingLeft:10, paddingBottom:5}} item xs={12}>
						<Typography color='textPrimary'>
							Status: <span id='statusCheck'>Not Installed</span>
						</Typography>
					</Grid>
					<Grid item xs={12}>
							<Typography gutterBottom>
								<a href="https://github.com/user-attachments/files/16145818/en-ext.zip" download >
									1. Download Chrome Extension
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
				</Grid>



			</CardContent>
		</Card>
	  </Container>
	</Box>
  </>
)};

export default ReraInstruction;
