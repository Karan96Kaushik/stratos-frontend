import {
	Box, Button, Grid, Card,
	CardContent, TextField, InputAdornment,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import FiltersDialog from '../FiltersDialog';
import PasswordDialog from '../passwordDialog';
import React from 'react';
import procurementFields from 'src/statics/procurementFields';

const ProcurementsListToolbar = (props) => {

	const [open, setOpen] = React.useState(false)

	const getExport = async () => {
		setOpen(true)
	}
	
	const commonFilters = {
		texts: [
			// {label:"Balance", id: "balanceStatus", options:["", "Nil", "Pending"]},
			...(props?.commonFilters?.texts ?? [])
			// ...props.fields?.texts
		],
		checkboxes: [
			// {label:"Form 5", id: "Form 5"},
			// {label:"Include Archived", id:"archived"},
			{label:"Only Archived", id: "onlyarchived"},
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
				<Link to="/app/procurement/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Procurement
					</Button>
				</Link>
				<Link to="/app/vendor/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Vendor
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
										InputLabelProps={{ shrink: (props.searchInfo["text"]?.length) ? true : undefined }}
										onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
										variant="standard"
									/>
								</Grid>
								<Grid item md={4} xs={6}>
									<FiltersDialog forView={props.forView || "procurements"} commonFilters={commonFilters} search={props.searchInfo} setSearch={props.setSearch} type={'all'} fields={procurementFields}/>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default ProcurementsListToolbar;
