import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, Autocomplete,
	DialogActions, DialogContent, Dialog, DialogTitle,
	List, ListItem, Typography, Link
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import taskFields from '../../statics/taskFields';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	const [clientRows, setClientRows] = useState([]);
	const [type, setType] = useState("");
	const [placeholder, setPlaceholder] = useState({client: {clientID:"", name: "", _id: ""}});

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
			// data = data[0]
			setPlaceholder({
				client: {clientID:data.clientID, name: data.clientName, _id: ""}, 
			})
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
			navigate(-1);
			// navigate('/app/taskaccounts');
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
			navigate(-1);
			// navigate('/app/tasks');
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const handleChange = async (event) => {
		let others = {}
		if (event.target.id == 'files') {
			// console.log(event.target.files.length)
			others = {docs:[]}

			let allFiles = []
			let len = (event.target.files.length)
			let filesClone = Object.assign(Object.create(Object.getPrototypeOf(event.target.files)), event.target.files)
			for (let i=0; i < len; i++)
				allFiles.push(filesClone[i])

			// console.log(allFiles)
			for (let i=0; i < len; i++) {
				let file = allFiles[i]
				let fileData = file
	
				fileData = new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => {
					const base64String = reader.result
						.replace("data:", "")
						.replace(/^.+,/, "");
				
					resolve(base64String)
					};
					reader.readAsDataURL(fileData);
				})
	
				fileData = await fileData
				others.docs.push({name:file.name, data:fileData})
			}
			event.target.id = "ignore"
				
		}

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
			[event.target.id]: event.target.type != 'checkbox' ? event.target.value : event.target.checked
		});

	};

	const downloadFile = ({target}) => {
		const fileName = target.textContent
		authorizedDownloadLink({
			route:"/api/files", 
			data:{fileName}, 
			creds:loginState.loginState, 
			method:"post"
		}, fileName.split("/")[1])

	}

	const filterOptions = createFilterOptions({
		stringify: option => option.promoter + option.name + option.location + option.clientID + option.userID,
	});
	
	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
					title={!isEdit ? "New Task" : "Edit Task"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						{<Grid item md={6} xs={12}>
							<Autocomplete
								id="_clientID"
								options={clientRows}
								disabled={isEdit}
								value={placeholder.client}
								getOptionLabel={(row) => row?.name?.length ? (row.name + ` (${row.clientID})`) : ""}
								onInputChange={handleChangeClient}
								onChange={(e,value) => handleChange({target:{id:"_clientID", value:value._id, name:value.name}})}
								fullWidth
								filterOptions={filterOptions}
								renderInput={(params) => <TextField {...params} label="Select Client" variant="standard" />}
							/>
						</Grid>}

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
								variant="outlined">
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
									inputProps={field.type == "file" ? { multiple: true } : {}}
									InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
									required={field.isRequired}
									error={errors[field.id]}
									id={field.id}
									onChange={handleChange}
									value={field.id != "files" ? values[field.id] ?? '' : undefined}
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
						<Grid item md={6} xs={12}>
							{isEdit && values?.files && <List>
									{values?.files?.map((file) => (<ListItem>
										<Link style={{cursor:'pointer', wordBreak:'break-all'}} onClick={downloadFile} file={file}>
											<Typography >{file}</Typography>
										</Link>
										</ListItem>))}
								</List>
							}
						</Grid>
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
