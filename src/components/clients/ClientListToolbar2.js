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
import clientFields from 'src/statics/clientFields';

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
							<Grid container spacing={3}>
								<Grid item md={4} xs={6}>
									<TextField fullWidth label="Select Client Type" 
										id="clientType"
										onChange={props.handleChange}
										required
										select
										SelectProps={{native: true}}
										value={props.searchInfo["clientType"]}
										variant="standard">
										<option/> {
										Object.keys(clientFields).map((option) => (
											<option key={option}
												value={option}>
												{clientFields[option]?.name}</option>
										))
									} </TextField>
								</Grid>
								<Grid item md={4} xs={6}>
									<TextField
										fullWidth
										label="Select Search Field"
										id="type"
										value={props.searchInfo["type"]}
										onChange={({target}) => props.setSearch({...props.searchInfo, type:target.value})}
										select
										SelectProps={{ native: true }}
										variant="standard"
									>
										{([["",""],["Client ID", "clientID"], ["Name", "name"]]).map((option) => (
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
									<TextField
										fullWidth
										label="Phrase"
										id="text"
										value={props.searchInfo["text"]}
										onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
										variant="standard"
									/>
								</Grid>

								<Grid item md={4} xs={12}>
									<Button
										fullWidth
										variant="contained"
										color="primary"
										style={{margin:0, padding:10}}
									>
										Search <SearchIcon style={{padding:0}} />
									</Button>
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
