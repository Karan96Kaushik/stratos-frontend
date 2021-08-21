import {
	Box, Button,
	Card, CardContent, TextField,
	InputAdornment, SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { Link } from 'react-router-dom';

const CustomerListToolbar = (props) => {

	return (
		<Box {...props}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end'
				}}
			>
				<Link to="/app/members/add">
					<Button sx={{ mx: 1 }} variant="contained">
						Add Member
				</Button>
				</Link>
				<Button sx={{mx: 1}} variant="contained" onClick={props.handleExport}>
					Export
				</Button>
			</Box>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<Box sx={{ maxWidth: 500 }}>
							{/* <TextField
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SvgIcon
												fontSize="small"
												color="action"
											>
												<SearchIcon />
											</SvgIcon>
										</InputAdornment>
									)
								}}
								placeholder="Search member"
								variant="outlined"
							/> */}
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default CustomerListToolbar;
