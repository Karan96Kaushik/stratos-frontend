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
import taskFields from '../../statics/taskFields';

const CustomerListToolbar = (props) => {

	return (
		<Box {...props}>
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
				<Link to="/app/tasks/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Task
					</Button>
				</Link>
			</Box>
			<Box sx={{mt: 1}}>
				<Card>
					<CardContent>
						<Box>
							<Grid container spacing={1}>
								<Grid item md={4} xs={6}>
									<TextField fullWidth label="Select Service" id="serviceType"
										onChange={props.handleChange}
										required
										select
										SelectProps={{native: true}}
										variant="outlined">
										<option/> {
										Object.keys(taskFields).map((option) => (
											<option key={option}
												value={option}>
												{taskFields[option]?.name}</option>
										))
									} </TextField>
								</Grid>
								<Grid item md={4} xs={6}>
									<TextField
										fullWidth
										label="Select Search Field"
										onChange={({target}) => {props.searchinfo.current.type = target.value}}
										select
										SelectProps={{ native: true }}
										variant="outlined"
									>
										<option />
										{([["ID", "clientID"], ["Project/Client Name", "name"]]).map((option) => (
											<option
												key={option[0]}
												value={option[1]}
											>
												{option[0]}
											</option>
										))}
									</TextField>
								</Grid>
								<Grid item md={4} xs={6}>
									<TextField fullWidth
										InputProps={{
												endAdornment: (
													<InputAdornment position="end" onClick={props.goSearch}>
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
										onChange={({target}) => {props.searchinfo.current.text = target.value}}
										id={'search'}
										variant="outlined"
									/>
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
