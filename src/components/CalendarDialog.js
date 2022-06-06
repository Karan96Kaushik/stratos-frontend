import {useRef, useEffect, useState, useContext} from 'react';
import {
	Button, Box, Divider,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions,
    TextField
} from '@material-ui/core';
// import { Description, FindInPage, PanoramaFishEye, ViewAgendaRounded, Visibility } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"

const useStyles = makeStyles((theme) => ({
	root: {
        marginTop:20,
        marginBottom:20,
	},
    title: {
        fontWeight:1000
	},
}));

export default function ViewDialog({ setEvents, events, isDelete=false }) {
	const [open, setOpen] = useState(false)
    const [values, setValues] = useState({})

	const loginState = useContext(LoginContext)

	const snackbar = useSnackbar()

	const handleClose = () => {
		setOpen(false);
	};

    const handleChange = (e) => {
		let change = { [e.target.id]: e.target.type != 'checkbox' ? e.target.value : e.target.checked }
		setValues({
			...values,
			...change
		});
	};

	const handleSubmit = async () => {
		try {
			// validateForm()
			if (!taskID)
				throw new Error("Enter Task ID")
			
			await authorizedReq({
				route:"/api/hearingdates", 
				data: values, 
				creds:loginState.loginState, 
				method: isDelete ? 'delete' : 'post'
			})

			let newEvents = [...events]

			if (!isDelete) {
				newEvents.push({
					date: values.hearingDate,
					interactive: true,
					title: values.taskID,
					url: '/app/tasks?text=' + values.taskID
				})
			} 
			else {
				newEvents = newEvents.filter(t => t.title !== values.taskID)
			}

            setEvents(newEvents)
			setValues({})
			snackbar.showMessage(
				`Successfully ${!isDelete ? "added" : "deleted"} date!`,
			)
			handleClose()
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
		}
	};

	return (
		<div>
            <Button sx={{mx: 1}} variant="contained" onClick={() => setOpen(true)}>
                {!isDelete ? 'Add Hearing Date' : 'Delete Event'}
            </Button>
			<Dialog
				fullWidth={true}
				maxWidth={'sm'}
				open={open} 
				onClose={handleClose} 
				aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">
                    <Typography variant="h4">
                        {!isDelete ? 'Add Hearing Date' : 'Delete Event'}
                    </Typography>
                </DialogTitle>
				<DialogContent>
                    
                    <Grid container spacing={3}>

                        {!isDelete && <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                label="Hearing Date"
                                type="date"
                                // inputProps={field.type == "file" ? { multiple: true } : {}}
                                InputLabelProps={{ shrink: true }}
                                id="hearingDate"
                                required={true}
                                // error={errors[field.id]}
                                onChange={handleChange}
                                value={values['hearingDate']}
                                variant="outlined"
                            />
                        </Grid>}

                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                label="Task ID"
                                type="text"
                                // inputProps={field.type == "file" ? { multiple: true } : {}}
                                InputLabelProps={{ shrink: undefined }}
                                id="taskID"
                                required={true}
                                // error={errors[field.id]}
                                onChange={handleChange}
                                value={values['taskID']}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						{isDelete ? 'Delete' : 'Save'}
					</Button>
				</DialogActions>
				<DialogActions>
				</DialogActions>
			</Dialog>
		</div>
	);
}
