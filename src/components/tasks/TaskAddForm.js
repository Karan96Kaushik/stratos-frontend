import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel,
	DialogActions, DialogContent, Dialog, DialogTitle
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import taskFields from '../../statics/taskFields';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	const [clientRows, setClientRows] = useState([]);
	const [type, setType] = useState("");
	const [open, setOpen] = useState(false);
	
    let isEdit = false;

	const searchInfo = useRef({})

	if (location.pathname.includes("edit")) {
		isEdit = true
		let taskID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/tasks/", data:{_id:taskID}, creds:loginState.loginState, method:"get"})
			data = data[0]
			
			setType(data.serviceType)
			setValues(data)
		}, [])
	}

	const getClients = async () => {
		let response = await authorizedReq({ route: "/api/clients/search", creds: loginState.loginState, data: {...searchInfo.current}, method: 'get' })
		// response = response.map(val => ({id: val._id, label: (val.clientID ?? val.name) + ` (${val._id})`}))
		setClientRows(response)
	};

	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")
		taskFields[type].texts.map(field => {
			if(field.isRequired && !values[field.id]){
				errFields.push(field.label)
				foundErrs[field.id] = true
				errorFlag = true
			}
		})
		console.debug(foundErrs)
		setErrors(foundErrs)
		if(errorFlag)
			throw new Error(errFields.join(", "))
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/tasks/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} task!`,
			)
			navigate('/app/tasks');
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const handleChange = (event) => {
		let others = {};

		if (event.target.id == 'serviceType') {
			setType(event.target.value)
		} else if (event.target.id == 'client' && values?.client?.length > 2) {
			getClients()
		} else if (event.target.id == '_clientID') {
			let client = clientRows.find(c => c._id == event.target.value)
			others.clientName = client.name
		}

		setValues({
			...values,
			...others,
			[event.target.id]: event.target.value || event.target.checked
		});

	};

	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
					title="New Task"
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Dialog open={open} onClose={() => { setOpen(false) }} aria-labelledby="form-dialog-title">
							<DialogTitle id="form-dialog-title">Select Client</DialogTitle>
							<DialogContent>
								<Grid container spacing={1}>
									<Grid item md={12} xs={12}>
										<TextField
											fullWidth
											label="Select Client Search"
											onChange={({target}) => {searchInfo.current.type = target.value}}
											select
											SelectProps={{ native: true }}
											variant="outlined"
										>
											<option />
											{([["ID", "clientID"], ["Project/Client Name", "name"]]).map((option) => (
												<option
													key={option[0]}
													value={option[1]}
												>
													{option[0]}
												</option>
											))}
										</TextField>
									</Grid>
									<Grid item md={12} xs={12}>
										<TextField
											fullWidth
											label="Search Client"
											id="search"
											onChange={({target}) => {searchInfo.current.text = target.value}}
											value={searchInfo.current.text}
											variant="outlined"
										/>
									</Grid>
									<Grid item md={12} xs={12}>
										<Button
											fullWidth
											label="Search Client"
											onClick={getClients}
											variant="contained"
										>
											Search
											</Button>
									</Grid>
									<Grid item md={12} xs={12}>
										<TextField
											fullWidth
											label="Select Client"
											id="_clientID"
											onChange={handleChange}
											required
											select
											SelectProps={{ native: true }}
											variant="outlined"
										>
											<option />
											{clientRows.map((option) => (
												<option
													key={option._id}
													value={option._id}
												>
													{(option.clientID ?? option.name) + ` (${option.name})`}
												</option>
											))}
										</TextField>
									</Grid>
								</Grid>

							</DialogContent>
							<DialogActions>
								<Button onClick={() => {setOpen(false)}} color="primary">
									Cancel
								</Button>
								<Button onClick={() => {setOpen(false)}} color="primary">
									Select
								</Button>
							</DialogActions>
						</Dialog>

						{!isEdit && (<Grid item md={6} xs={12}>
							<TextField
								fullWidth
								label={"Select Client"}
								id="clientName"
								onClick={() => setOpen(true)}
								required
								error={errors.clientName}
								value={values.clientName ?? " "}
								variant="outlined"
							/>
						</Grid>)}

						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Select Service"
								id="serviceType"
								onChange={handleChange}
								required
								error={errors.serviceType}
								defaultValue={!isEdit?"":Object.keys(taskFields)[0]}
								disabled={isEdit}
								value={values.serviceType}
								select
								SelectProps={{ native: true }}
								variant="outlined"
							>
								<option />
								{Object.keys(taskFields).map((option) => (
									<option
										key={option}
										value={option}
									>
										{taskFields[option]?.name}
									</option>
								))}
							</TextField>
						</Grid>

						{taskFields[type]?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									required={field.isRequired}
									error={errors[field.id]}
									id={field.id}
									onChange={handleChange}
									value={values[field.id]}
									variant="outlined"
								>
									{(field.options ?? []).map((option) => (
										<option
											key={option}
											value={option}
										>
											{option}
										</option>
									))}
								</TextField>
							</Grid>))}

						{taskFields[type]?.checkboxes.map((field) => (
							<Grid item md={6} xs={12}>
								<FormControlLabel
									control={<Checkbox
										checked={values[field.id] ? true : false}
										onChange={handleChange}
										id={field.id}
										color="primary"
									/>}
									label={field.label}
								/>
							</Grid>))}
					</Grid>
				</CardContent>
				<Divider />
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
					<Button color="primary" variant="contained" onClick={handleSubmit}>
						Save details
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default TaskAddForm;
