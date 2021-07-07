import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, Autocomplete,
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

	const handleChangeClient = ({target}) => {
		if(target?.value?.length > 3) {
			setSearchInfo({...searchInfo, text: target.value})
		}
		if(target?.value?.length == 0) {
			setClientRows([])
		}
	}
	
    let isEdit = false;

	const [searchInfo, setSearchInfo] = useState({type:"", text:""});

	useEffect(async () => {
		if(searchInfo.text.length > 3)
			getClients()
		if(searchInfo.text.length == 0)
			setClientRows([])
	}, [searchInfo])

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
		try {
			let response = await authorizedReq({ route: "/api/clients/search", creds: loginState.loginState, data: {...searchInfo, searchAll:true}, method: 'get' })
			setClientRows(response)

		} catch (err) {
			snackbar.showMessage(
				"Error getting clients - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
		// response = response.map(val => ({id: val._id, label: (val.clientID ?? val.name) + ` (${val._id})`}))
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

	const handleDelete = async () => {
		try {
			const resp = confirm("Are you sure you want to delete this entry?")
			console.log(resp)
			if(!resp)
				return
			let taskID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/tasks/", 
				data:{_id:taskID}, 
				creds:loginState.loginState, 
				method:"delete"
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
			others.clientName = event.target.name
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
						{!isEdit && (<Grid item md={6} xs={12}>
							<Autocomplete
								id="_clientID"
								options={clientRows}
								getOptionLabel={(row) => row.name + ` (${row.clientID})`}
								onInputChange={handleChangeClient}
								onChange={(e,value) => handleChange({target:{id:"_clientID", value:value._id, name:value.name}})}
								fullWidth
								renderInput={(params) => <TextField {...params} label="Select Client" variant="standard" />}
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
									InputLabelProps={{ shrink: true }}
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
					{
						isEdit && (<Button color="error" variant="contained" onClick={handleDelete}>
							Delete entry
						</Button>)
					}
				</Box>
			</Card>
		</form>
	);
};

export default TaskAddForm;
