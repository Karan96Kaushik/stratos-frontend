import {
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import taskFields from 'src/statics/taskFields';
import Filters from '../FiltersDialog'

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
									<TextField fullWidth label="Select Service Type" 
										id="serviceType"
										onChange={props.handleChange}
										required
										select
										SelectProps={{native: true}}
										value={props.searchInfo["serviceType"]}
										variant="standard">
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
										label="Search"
										id="text"
										value={props.searchInfo["text"]}
										onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
										variant="standard"
									/>
								</Grid>
								<Grid item md={4} xs={6}>
									<Filters fields={taskFields} setSearch={props.setSearch} search={props.searchInfo}/>
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
