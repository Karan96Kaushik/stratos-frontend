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
import invoiceFields from '../../statics/invoiceFields';

const CustomerListToolbar = (props) => {

	return (
		<Box {...props}>
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
				<Link to="/app/quotations/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Quotation
					</Button>
				</Link>
			</Box>
			<Box sx={{mt: 1}}>
				<Card>
					<CardContent>
						<Box>
							<Grid container spacing={1}>
								<Grid item md={6} xs={6}>
									<TextField
										fullWidth
										label="Select Search Field"
										id="type"
										value={props.searchInfo["type"]}
										onChange={({target}) => props.setSearch({...props.searchInfo, type:target.value})}
										select
										SelectProps={{ native: true }}
										variant="filled"
									>
										{([["",""],["Quote ID", "quoteID"], ["Name", "name"]]).map((option) => (
											<option
												key={option[0]}
												value={option[1]}
											>
												{option[0]}
											</option>
										))}
									</TextField>
								</Grid>

								<Grid item md={6} xs={6}>
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
										value={props.searchInfo["text"]}
										placeholder="Search"
										onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
										id={'text'}
										variant="filled"
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
