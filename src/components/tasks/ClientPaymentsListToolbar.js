import {
	Box, Button, Grid, Card,
	CardContent, TextField, InputAdornment,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import Filters from '../FiltersDialog'
import PasswordDialog from '../passwordDialog';
import React from 'react';

const PaymentsListToolbar = (props) => {
	const [open, setOpen] = React.useState(false)

	const getExport = async () => {
		setOpen(true)
	}

	const commonFilters = {
		texts: [
			{label:"Payment Status", id: "paymentStatus", options:["", "Nil", "Pending"]}
		]
	}

	return (
		<Box {...props}>
		<PasswordDialog protectedFunction={props.handleExport} open={open} setOpen={setOpen} />
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
				<Link to="/app/payments/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Payment
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
							<Grid container spacing={1}>
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
                                {/* <Grid item md={4} xs={6}>
									<Filters type={"all"} fields={props.fields} commonFilters={commonFilters} setSearch={props.setSearch} search={props.searchInfo}/>
								</Grid> */}
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default PaymentsListToolbar;
