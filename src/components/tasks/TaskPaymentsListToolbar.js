import {
	Box, FormControl,
	Button, InputLabel,
	Grid, MenuItem,
	Card, Input, Checkbox,
	CardContent, Select,
	TextField, ListItemText
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import taskFields, { allStatuses, legal, technical } from '../../statics/taskFields';
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
			{label:"Balance", id: "balanceStatus", options:["", "Nil", "Pending"]},
			...props.fields?.texts,
			{label:"Team", id: "team", options: ["", "Registration 1", "Registration 2"]},
		],
		checkboxes: [
			{label:"Include Archived", id: "archived"},
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
									<FormControl fullWidth >	
									<InputLabel fullWidth >Services</InputLabel>
									<Select multiple fullWidth
										id="serviceType"
										name="serviceType"
										value={Array.isArray(props.searchInfo["serviceType"]) ? props.searchInfo["serviceType"] : []}
										onChange={props.handleChange}
										input={<Input />}
										placeholder="Services"
										renderValue={(selected) => (selected ?? []).join(', ')}
										>
										<MenuItem key={'Technical'} value={'Technical'}>
											<Checkbox checked={(props.searchInfo["serviceType"] ?? []).indexOf("Technical") > -1} />
											<ListItemText primary={'Technical'} />
										</MenuItem>
										{ technical.map((option) => (
											<MenuItem 
												key={option} 
												value={option}
												style={{
													left: 20
												}}>
												<Checkbox checked={(props.searchInfo["serviceType"] ?? []).indexOf(option) > -1} />
												<ListItemText primary={option} />
											</MenuItem>
										))}
										<MenuItem key={'Legal'} value={'Legal'}>
											<Checkbox checked={(props.searchInfo["serviceType"] ?? []).indexOf("Legal") > -1} />
											<ListItemText primary={'Legal'} />
										</MenuItem>
										{ legal.map((option) => (
											<MenuItem 
												key={option} 
												value={option}
												style={{
													left: 20
												}}>
												<Checkbox checked={(props.searchInfo["serviceType"] ?? []).indexOf(option) > -1} />
												<ListItemText primary={option} />
											</MenuItem>
										))}
									</Select>
									</FormControl>
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
									<Filters forView="taskaccounts"  commonFilters={commonFilters} type={"all"} fields={props.fields} setSearch={props.setSearch} search={props.searchInfo}/>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default PaymentsListToolbar;
