import {
	Box, Button,
	Card, CardContent, TextField,
	InputAdornment, SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { Link } from 'react-router-dom';
import PasswordDialog from '../passwordDialog';
import React from 'react';

const CustomerListToolbar = (props) => {
	const [open, setOpen] = React.useState(false)

	const getExport = async () => {
		setOpen(true)
	}
	return (
		<Box {...props}>
		<PasswordDialog handleExport={props.handleExport} open={open} setOpen={setOpen} />
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
				<Button sx={{mx: 1}} variant="contained" onClick={getExport}>
					Export
				</Button>
			</Box>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<Box sx={{ maxWidth: 500 }}>
							<TextField
								fullWidth
								label="Search"
								id="text"
								value={props.searchInfo["text"]}
								onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
								variant="standard"
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default CustomerListToolbar;
