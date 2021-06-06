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
							<Grid container spacing={3}>
								<Grid item md={6} xs={6}>
									<TextField fullWidth
										InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<SvgIcon fontSize="small" color="action">
															<SearchIcon/>
														</SvgIcon>
													</InputAdornment>
												)
											}}
										placeholder="Search Task"
										onChange={props.handleChange}
										id={'search'}
										variant="outlined"/>
								</Grid>
								<Grid item md={6} xs={6}>
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
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default CustomerListToolbar;
