import {
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
} from '@material-ui/core';
import {Search as SearchIcon} from 'react-feather';
import {Link} from 'react-router-dom';
import clientFields from 'src/statics/clientFields';
import Filters from '../FiltersDialog'
import PasswordDialog from '../passwordDialog';
import React from 'react';

const CustomerListToolbar = (props) => {
	const [open, setOpen] = React.useState(false)

	const getExport = async () => {
		setOpen(true)
	}

	return (
		<>
		<PasswordDialog protectedFunction={props.handleExport} open={open} setOpen={setOpen} />
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
				<Button sx={{mx: 1}} variant="contained" onClick={getExport}>
					Export
				</Button>
			</Box>
			<Box sx={{mt: 1}}>
				<Card>
					<CardContent>
						<Box>
							<Grid container spacing={3}>
								<Grid item md={4} xs={6}>
									<TextField fullWidth label="Select Type" 
										id="clientType"
										onChange={props.handleChange}
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
										label="Search"
										id="text"
										value={props.searchInfo["text"]}
										onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
										variant="standard"
									/>
								</Grid>
								<Grid item item md={4} xs={6}>
									<Filters search={props.searchInfo} setSearch={props.setSearch} type={props.searchInfo["clientType"] ?? "all"} fields={clientFields}/>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
		</>
	)
};

export default CustomerListToolbar;
