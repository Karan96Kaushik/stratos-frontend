import {
	Box, Button,
	Card, CardContent, TextField,
	InputAdornment, SvgIcon,
	Grid
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { Link } from 'react-router-dom';
import PasswordDialog from '../passwordDialog';
import React from 'react';
import Filters from '../FiltersDialog'

const CustomerListToolbar = (props) => {
	const [open, setOpen] = React.useState(false)

	const commonFilters = {
		texts: [
            {label:"Branch", id:"branch", options:['','Mumbai','Pune']},
		],
		checkboxes: [
		]
	}


	const getExport = async () => {
		setOpen(true)
	}
	return (
		<Box {...props}>
		<PasswordDialog protectedFunction={props.handleExport} open={open} setOpen={setOpen} />
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
						<Grid container>
						<Grid item md={4} xs={6}>
						{/* <Box sx={{ maxWidth: 500 }}> */}
							<TextField
								fullWidth
								label="Search"
								id="text"
								value={props.searchInfo["text"]}
								onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
								variant="standard"
							/>
						{/* </Box> */}
						</Grid>
						<Grid item md={4} xs={6}>
							<Filters forView="members" commonFilters={commonFilters} search={props.searchInfo} setSearch={props.setSearch} type={'all'} fields={{'all':{texts:[],checkboxes:[]}}}/>
						</Grid>
						</Grid>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default CustomerListToolbar;
