import {useRef, useEffect, useState, useContext} from 'react';
import {
	Button, Box, Divider,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions,
    TextField, Autocomplete, TableContainer,
    Table, TableRow, TableCell, TableBody,
    TableFooter, Paper, TableHead
} from '@material-ui/core';
// import { Description, FindInPage, PanoramaFishEye, ViewAgendaRounded, Visibility } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
	root: {
        marginTop:20,
        marginBottom:20,
	},
    title: {
        fontWeight:1000
	},
}));

export default function ViewDialog({ event, setEvent }) {
    const classes = useStyles();

	const handleClose = () => {
		setEvent(null);
	};

    let headers = {
        'hearingDate': 'Date',
        'taskID': 'Task ID',
        'clientName': 'Client Name',
        'court': 'Court',
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
					{/* <Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						{isDelete ? 'Delete' : 'Save'}
					</Button> */}
				</DialogActions>
				<DialogActions>
				</DialogActions>
			</Dialog>
		</div>
	);
}
