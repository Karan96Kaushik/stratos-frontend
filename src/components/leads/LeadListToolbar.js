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
import leadFields from '../../statics/leadFields';
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
				<Link to="/app/leads/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Lead
					</Button>
				</Link>
				<Button sx={{mx: 1}} variant="contained" onClick={props.handleExport}>
					Export
				</Button>
			</Box>
			<Box sx={{mt: 1}}>
				<Card>
					<CardContent>
						<Box>
							<Grid container spacing={1}>
								<Grid item md={4} xs={6}>
									<TextField fullWidth label="Select Type" 
										id="leadType"
										onChange={props.handleChange}
										select
										SelectProps={{native: true}}
										value={props.searchInfo["leadType"]}
										variant="standard">
										<option/> {
										Object.keys(leadFields).map((option) => (
											<option key={option}
												value={option}>
												{leadFields[option]?.name}</option>
										))
									} </TextField>
								</Grid>
								{/* <Grid item md={4} xs={6}>
									<TextField
										fullWidth
										label="Select Search Field"
										id="type"
										value={props.searchInfo["type"]}
										onChange={({target}) => props.setSearch({...props.searchInfo, type:target.value})}
										select
										SelectProps={{ native: true }}
										variant="outlined"
									>
										{([["",""],["Lead ID", "leadID"], ["Name", "name"]]).map((option) => (
											<option
												key={option[0]}
												value={option[1]}
											>
												{option[0]}
											</option>
										))}
									</TextField>
								</Grid> */}
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
								<Grid item item md={4} xs={6}>
									<Filters search={props.searchInfo} setSearch={props.setSearch} type={props.searchInfo["leadType"]} fields={leadFields}/>
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
