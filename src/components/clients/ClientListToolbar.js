import {
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	SvgIcon
} from '@material-ui/core';
import {Search as SearchIcon} from 'react-feather';
import {Link} from 'react-router-dom';
import clientFields from '../../statics/clientFields';

const CustomerListToolbar = (props) => {

	return (
		<Box {...props}>
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
				<Link to="/app/clients/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Client
					</Button>
				</Link>
			</Box>
			<Box sx={{mt: 1}}>
				<Card>
					<CardContent>
						<Box>
							<Grid container spacing={1}>
								<Grid item md={4} xs={12}>
									<TextField fullWidth label="Select Type" id="clientType"
										onChange={props.handleChange}
										required
										select
										SelectProps={{native: true}}
										variant="outlined">
										<option/> {
										Object.keys(clientFields).map((option) => (
											<option key={option}
												value={option}>
												{clientFields[option]?.name}</option>
										))
									} </TextField>
								</Grid>
								<Grid item md={4} xs={6}>
									<TextField fullWidth label="Select Type" id="clientType"
										onChange={props.handleChange}
										required
										select
										SelectProps={{native: true}}
										variant="outlined">
										<option/> {
										Object.keys(clientFields).map((option) => (
											<option key={option}
												value={option}>
												{clientFields[option]?.name}</option>
										))
									} </TextField>
								</Grid>
								<Grid item md={4} xs={6}>
									{/* <Grid container spacing={0}>
										<Grid item md={10} xs={10}> */}
											<TextField fullWidth
												InputProps={{
														endAdornment: (
															<InputAdornment position="start" style={{padding:0, margin:0}} onClick={props.goSearch}>
																<SvgIcon fontSize="small" color="action">
																	<SearchIcon/>
																</SvgIcon>
															</InputAdornment>
														)
													}}
												placeholder="Search Clients"
												onChange={props.handleChange}
												id={'search'}
												variant="outlined"/>
										{/* </Grid> */}
										{/* <Grid item md={2} xs={2}>
											<Button variant="contained">Search</Button>
										</Grid> */}
									{/* </Grid> */}
								</Grid>
								
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default CustomerListToolbar;
