import {
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	SvgIcon,
	IconButton
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
										value={props.searchInfo.current.clientType ?? " "}
										variant="outlined">
										<option/> {
										Object.keys(clientFields).map((option) => (
											<option key={option}
												value={option}>
												{clientFields[option]?.name}</option>
										))} 
									</TextField>
								</Grid>
								<Grid item md={4} xs={6}>
									<TextField fullWidth label="Search Field" id="searchType"
										onChange={props.handleChange}
										select
										value={props.searchInfo.current.searchType ?? " "}
										SelectProps={{native: true}}
										variant="outlined">
										<option/> 
										{(["ID", "Name"]).map((option) => (
											<option key={option}
												value={option}>
												{option}
											</option>
										))} 
									</TextField>
								</Grid>
								<Grid item md={4} xs={6}>
									<TextField fullWidth
										InputProps={{
												endAdornment: (
													<InputAdornment position="start" style={{padding:0, margin:0}} onClick={props.goSearch}>
														<Button
															variant="contained"
															color="primary"
															style={{margin:0}}
														>
															<SearchIcon style={{padding:0}} />
														</Button>
													</InputAdornment>
												)
											}}
										placeholder="Search"
										onChange={props.handleChange}
										id={'search'}
										variant="outlined"/>
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
