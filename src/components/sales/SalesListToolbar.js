import {
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import salesFields from '../../statics/salesFields';
import Filters from '../FiltersDialog'
import PasswordDialog from '../passwordDialog';
import React from 'react';
import taskFields from "../../statics/taskFields"
import { useSelector } from "react-redux";
import { selectMembers } from 'src/store/reducers/membersSlice';
import SalesUploadDialog from '../SalesUploadDialog';

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D', 'General')
services.unshift('')

const CustomerListToolbar = (props) => {

	const memberRows = useSelector(selectMembers)
	const memberNames = memberRows.map(m => m.userName)
	// memberNames.unshift('')

	const [open, setOpen] = React.useState(false)
	const [openDialog, setOpenDialog] = React.useState(false)

	const getExport = async () => {
		setOpen(true)
	}
	const openUploadPopup = async () => {
		setOpenDialog(true)
	}

	const commonFilters = {
		texts: [
            {label:"Service Type", id:"serviceType", options: services, isRequired:true},
		],
		checkboxes: [
		]
	}

	return (
		<Box {...props}>
		<PasswordDialog protectedFunction={props.handleExport} open={open} setOpen={setOpen} />
		<SalesUploadDialog open={openDialog} setOpen={setOpenDialog} />
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
                <Button sx={{mx: 1}} variant="contained" onClick={openUploadPopup}>
                    Upload Sales File
                </Button>
				<Link to="/app/sales/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Sales Lead
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
								<Grid item md={4} xs={6}>
									<Filters forView="sales" commonFilters={commonFilters} search={props.searchInfo} setSearch={props.setSearch} type={props.searchInfo["saleType"]} fields={salesFields}/>
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
