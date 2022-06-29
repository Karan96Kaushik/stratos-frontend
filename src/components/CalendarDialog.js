import {useRef, useEffect, useState, useContext} from 'react';
import {
	Button, Box, Divider,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions,
    TextField, Autocomplete
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import hearingDateFields from '../statics/hearingDateFields'

export default function ViewDialog({ setEvents, events, isDelete=false }) {
	const [open, setOpen] = useState(false)
    const [values, setValues] = useState({})
	const [searchInfo, setSearchInfo] = useState({type:"", text:""});
	const [clientRows, setClientRows] = useState([{clientID:"", name: "", _id: ""}]);
	const [taskRows, setTaskRows] = useState([{taskID:'', packageID:'', _id: ""}]);
	const [placeholder, setPlaceholder] = useState({
		task: {taskID:"", _id: ""}, 
		client: {clientID:"", name: "", _id: ""}
	});

	const loginState = useContext(LoginContext)

	const snackbar = useSnackbar()

	const handleClose = () => {
		setOpen(false);
	};

    const handleChange = (e) => {
		let change = {}
		let others = {}

		if (e.target.id == '_clientID' && e.target.value) {
			getTasks(e.target.value)
			others["_clientID"] = e.target.value
			others["clientID"] = clientRows.find(val => e.target.value == val._id)
			setPlaceholder({client:others["clientID"]})
			others["clientName"] = others["clientID"].name
			others["clientID"] = others["clientID"].clientID
		}
		else if (e.target.id == '_taskID' && e.target.value) {
			getTasks(e.target.value)
			others["_taskID"] = e.target.value
			let task = taskRows.find(val => e.target.value == val._id)
			setPlaceholder({...placeholder, task})
			others["promoter"] = task.promoter
			others["clientName"] = task.clientName
			others["taskID"] = task.taskID
		}
		else {
			change = { [e.target.id]: e.target.type != 'checkbox' ? e.target.value : e.target.checked }
		}

		setValues({
			...values,
			...change,
			...others
		});
	};

	const handleChangeClient = (e) => {
		let target = e?.target
		if(!target)
			return

		if(target?.value?.length > 3) {
			setSearchInfo({...searchInfo, text: target.value})
		}
		if(target?.value?.length == 0) {
			setClientRows([])
		}
	}

	useEffect(async () => {
		if(searchInfo.text.length > 3)
			getClients()
		if(searchInfo.text.length == 0)
			setClientRows([])
	}, [searchInfo])

	const getClients = async () => {
		try {
			let response = await authorizedReq({ route: "/api/clients/search", creds: loginState.loginState, data: {...searchInfo, searchAll:true, ignorePermissions:true}, method: 'post' })
			setClientRows(response)

		} catch (err) {
			snackbar.showMessage(
				"Error getting clients - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
	};

	// gets both tasks and packages
	const getTasks = async (_clientID) => {
		try {
			let tasks = await authorizedReq({ route: "/api/tasks/search/all", creds: loginState.loginState, data: {_clientID}, method: 'get' })
			// let packages = await authorizedReq({ route: "/api/packages/payments/search", creds: loginState.loginState, data: {_clientID}, method: 'get' })
			// setTaskRows([...tasks, ...packages])
			setTaskRows(tasks)

		} catch (err) {
			snackbar.showMessage(
				"Error getting tasks - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
	};

	const handleSubmit = async () => {
		try {
			// validateForm()
			if (!values.title)
				throw new Error("Enter Title")
			
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
					title: values.title || values.taskID,
					data: values
					// url: '/app/tasks?text=' + values.taskID
				})
			} 
			else {
				newEvents = newEvents.filter(t => t.title !== values.taskID)
			}

            setEvents(newEvents)
			setValues({})
			setSearchInfo({type:"", text:""})
			setClientRows([{clientID:"", name: "", _id: ""}]);
			setTaskRows([{taskID:'', packageID:'', _id: ""}]);
			setPlaceholder({
				task: {taskID:"", _id: ""}, 
				client: {clientID:"", name: "", _id: ""}
			});
			
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

	const filterOptions = createFilterOptions({
		stringify: option => option.promoter + option.name + option.location + option.clientID + option.userID,
	});

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

						{<Grid item md={6} xs={12}>
							<Autocomplete
								id="_clientID"
								options={clientRows}
								value={placeholder.client}
								// disabled={isEdit}
								getOptionLabel={(row) => row.name?.length ? row.name + ` (${row.clientID})` : ""}
								onInputChange={handleChangeClient}
								onChange={(e,value) => handleChange({target:{id:"_clientID", value:value?._id, name:value?.name}})}
								fullWidth
								filterOptions={filterOptions}
								renderInput={(params) => <TextField {...params} label="Select Client" variant="standard" />}
							/>
						</Grid>}

						{<Grid item md={6} xs={12}>
							<Autocomplete
								id="_taskID"
								options={taskRows}
								value={placeholder.task}
								getOptionLabel={(row) => (row.taskID ?? "")}
								// getOptionLabel={(row) => (row.taskID ?? row.packageID) + (row.billAmount ? ` - ₹${row.billAmount}` : row.amount ? ` - ₹${row.amount}` : "")}
								disabled={((values?._clientID?.length || 0) < 3)}
								onInputChange={handleChangeClient}
								onChange={(e,value) => handleChange({target:{id:value?.taskID ? "_taskID" : "_packageID", value:value?._id, name:value?.name}})}
								fullWidth
								// filterOptions={filterTaskOptions}
								renderInput={(params) => <TextField {...params} label="Select Task" variant="standard" />}
							/>
						</Grid>}

						{hearingDateFields.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									inputProps={field.type == "file" ? { multiple: true } : {}}
									InputLabelProps={{ shrink: (field.type == "date" || field.type == "file") ? true : undefined }}
									id={field.id}
									required={field.isRequired}
									// error={errors[field.id]}
									onChange={handleChange}
									value={field.id != "files" ? values[field.id] ?? '' : undefined}
									variant="outlined"
								>
									{(field.options ?? []).map((option) => (
										<option key={option}
											value={option}>
											{option}
										</option>
									))}
								</TextField>
							</Grid>))}

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
