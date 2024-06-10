import {useRef, useEffect, useState, useContext} from 'react';
import {
	Button,
	Dialog, DialogTitle,
	DialogContent, DialogActions,
    TableContainer,
    Table, TableRow, TableCell, TableBody,
    TableFooter, Paper, TableHead
} from '@material-ui/core';
// import { Description, FindInPage, PanoramaFishEye, ViewAgendaRounded, Visibility } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq } from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
// import { createFilterOptions } from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
	root: {
        marginTop:20,
        marginBottom:20,
	},
    title: {
        fontWeight:1000
	},
}));

export default function ViewDialog({ event, setEvent, setEditEvent, setEditOpen, allEvents, setAllEvents }) {
    const classes = useStyles();
	const snackbar = useSnackbar()

    const {loading, setLoading} = useContext(LoadingContext)
	const loginState = useContext(LoginContext)

    const approveMeetingsPermission = loginState?.loginState?.permissions?.page?.includes('Approve Meetings')
    // console.log(event)
	const handleClose = () => {
		setEvent(null);
	};

	const handleEdit = () => {
		setEditEvent(event);
		setEditOpen(true);
        handleClose()
	};

    const handleDelete = async () => {
        try {

			const resp = confirm("Are you sure you want to delete this entry?")
			if(!resp)
				return
			setLoading({...loading, isActive:true})
            await authorizedReq({
                route:"/api/calendar", 
                data: {_id: event._id}, 
                creds: loginState.loginState, 
                method: 'delete'
            })
            let newEvents = allEvents.filter(e => e.data._id !== event._id)
            setAllEvents(newEvents)
            handleClose()
        }
        catch (err) {
			snackbar.showMessage(
				"Error deleting - " + (err?.response?.data ?? err.message ?? err),
			)
			console.info(err)
        }
        finally {
			setLoading({...loading, isActive:false})
        }
    }

    const handleApprove = async () => {
        try {

			const resp = confirm("Are you sure you want to approve this meeting?")
			if(!resp)
				return
			setLoading({...loading, isActive:true})
            await authorizedReq({
                route:"/api/calendar/approve", 
                data: {_id: event._id, isSales: !event.salesID}, 
                creds: loginState.loginState, 
                method: 'patch'
            })
            allEvents.find(e => (e.data._id == event._id)).data.meetingStatus = 1
            allEvents.find(e => (e.data._id == event._id)).color = undefined
            allEvents.find(e => (e.data._id == event._id)).textColor = undefined
            setAllEvents(allEvents)
            handleClose()
        }
        catch (err) {
			snackbar.showMessage(
				"Error approving - " + (err?.response?.data ?? err.message ?? err),
			)
			console.info(err)
        }
        finally {
			setLoading({...loading, isActive:false})
        }
    }

    let headers = {
        'meetingDate': 'Date',
        'salesID': 'Sales ID',
        'promoterName': 'Promoter',
        'exClientID': 'Client',
        'remarks': 'Remarks',
    }

	return (
		<div>
            {/* <Button sx={{mx: 1}} variant="contained" onClick={() => setOpen(true)}>
                {!isDelete ? 'Add Hearing Date' : 'Delete Event'}
            </Button> */}
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={(event)} 
				onClose={handleClose} 
				aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">
                    <Typography variant="h4">
                        {event && (event.title ?? '')}
                    </Typography>
                </DialogTitle>
				<DialogContent>
                    
                <TableContainer component={Paper}>
                        <Table className={classes.root}>
                            <TableHead>
                                <TableRow>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {event && Object.keys(event).map((key) => headers[key] ? (
                                    <TableRow>
                                        <TableCell align="left"><Typography variant="h5">{headers[key]}</Typography></TableCell>
                                        <TableCell align="left">{event[key]}</TableCell>
                                    </TableRow>
                                ) : '')}
                            </TableBody>
                            <TableFooter>
                                {/* <TableRow>

                                </TableRow> */}
                                </TableFooter>
                        </Table>
                    </TableContainer>
                
				</DialogContent>
				<DialogActions>
					{!event?.salesID && <Button onClick={handleDelete} color="primary">
						Delete
					</Button>}
					{!event?.salesID && <Button onClick={handleEdit} color="primary">
						Edit
					</Button>}
					{(![1, 99].includes(event?.meetingStatus)) && approveMeetingsPermission && <Button onClick={handleApprove} color="primary">
						Approve
					</Button>}
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
				</DialogActions>
				<DialogActions>
				</DialogActions>
			</Dialog>
		</div>
	);
}
