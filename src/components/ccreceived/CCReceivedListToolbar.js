import {
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import ccreceivedFields from '../../statics/ccreceivedFields';
// import {statusOptions} from '../../statics/ccreceivedFields';
import Filters from '../FiltersDialog'
import PasswordDialog from '../passwordDialog';
import React from 'react';
// import taskFields from "../../statics/taskFields"
import { useSelector } from "react-redux";
import { selectMembers } from 'src/store/reducers/membersSlice';
import UploadDialog from '../UploadDialog';

// let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D', 'General')
// services.unshift('')

const CCReceivedListToolbar = (props) => {

	const memberRows = useSelector(selectMembers)
	let memberNames = memberRows.map(m => m.userName)
	memberNames = memberNames.filter(m => !m.includes('Department'))
	memberNames.unshift('')

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
            // {label:"Service Type", id:"serviceType", options: services, isRequired:true},
            // {label:"Assigned Member", id:"membersAssigned", options: memberNames},
            // {label:"Rating", id:"rating", options:['',1,2,3,4,5]},
            // {label:"Form 4", id:"form4", options:['', 'Y', 'N']},
            // {label:"Status", id: "status", options: statusOptions},
            // {label:"OC", id:"oc", options:['', 'Y', 'N']},

            // {label:"Certificate Date", id:"certificateDate", type:"date"},
            // {label:"Completion Date", id:"completionDate", type:"date"},
            // {label:"FollowUp Date", id:"followUpDate", type:"date"},
            // {label:"Meeting Date", id:"meetingDate", type:"date"},

		],
		checkboxes: [
		]
	}

	return (
		<Box {...props}>
		<PasswordDialog protectedFunction={props.handleExport} open={open} setOpen={setOpen} />
		<UploadDialog loadData={props.loadData} open={openDialog} setOpen={setOpenDialog} section='ccreceived' title='CC Received' />
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
                <Button sx={{mx: 1}} variant="contained" onClick={openUploadPopup}>
                    Upload CC Received File
                </Button>
				<Link to="/app/ccreceived/add">
					<Button sx={{mx: 1}} variant="contained">
						Add CC Received
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
									<Filters forView="ccreceived" commonFilters={commonFilters} search={props.searchInfo} setSearch={props.setSearch} type={"all"} fields={ccreceivedFields}/>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default CCReceivedListToolbar;
