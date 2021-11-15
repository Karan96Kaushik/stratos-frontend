import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, Link, List,
	ListItem, Typography, Autocomplete
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import invoiceFields from '../../statics/invoiceFields';
import PasswordDialog from '../passwordDialog';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	const [clientRows, setClientRows] = useState([]);
	const [searchInfo, setSearchInfo] = useState({type:"", text:""});
	const [placeholder, setPlaceholder] = useState({
		client: {clientID:"", name: "", _id: ""}
	});

    let isEdit = false;

	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")
		invoiceFields.all.texts.map(field => {
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

	if (location.pathname.includes("edit")) {
		isEdit = true
		let invoiceID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/invoices/", data:{_id:invoiceID}, creds:loginState.loginState, method:"get"})
			setValues(data)
		}, [])
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/invoices/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} invoice!`,
			)
			navigate('/app/invoices');
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
			console.log(filesClone)
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
					// console.log(base64String);
					};
					reader.readAsDataURL(fileData);
				})
	
				fileData = await fileData
				// console.log(file.name, others.docs.length, len, i)
	
				others.docs.push({name:file.name, data:fileData})
			}
			// event.target.files = allFiles
			console.log(event.target.files, allFiles)
			event.target.id = "ignore"
				
		} else if (event.target.id == '_clientID') {
			// Don't allow user to EDIT client of the task
			if(isEdit)
				return
			let client = clientRows.find(val => String(val._id) == event.target.value)
			others.clientName = client.name
			others.billTo = client.name
			others.projectName = client.relatedProject ?? client.name
			others.clientID = client.clientID
			others.promoter = client.promoter
			setPlaceholder({client})
		} else if (event.target.id == 'client' && values?.client?.length > 2) {
			getClients()
		}

		setValues({
			...values,
			...others,
			[event.target.id]: event.target.type != 'checkbox' ? event.target.value : event.target.checked
		});

	};

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
		// response = response.map(val => ({id: val._id, label: (val.clientID ?? val.name) + ` (${val._id})`}))
	};

	const handleChangeClient = (e) => {
		const target = e?.target

		if(target?.value?.length > 2) {
			setSearchInfo({...searchInfo, text: target.value})
		}
		if(target?.value?.length == 0) {
			setClientRows([])
		}
	}

	useEffect(async () => {
		if(searchInfo.text.length > 2)
			getClients()
		if(searchInfo.text.length == 0)
			setClientRows([])
	}, [searchInfo])

	const [open, setOpen] = useState(false)
	const tryDelete = () => {
		setOpen(true)
	}

	const handleDelete = async (password) => {
		try {
			// const resp = confirm("Are you sure you want to delete this entry?")
			// console.log(resp)
			// if(!resp)
			// 	return
			let taskID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/invoices/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted invoice!`,
			)
			navigate('/app/invoices');
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

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
			<PasswordDialog protectedFunction={handleDelete} open={open} setOpen={setOpen} />
			<Card>
				<CardHeader
					title={!isEdit ? "New Invoice" : ("Edit Invoice " + values?.invoiceID)}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid item md={6} xs={12}>
							<Autocomplete
								id="_clientID"
								options={clientRows}
								value={placeholder.client}
								disabled={isEdit}
								getOptionLabel={(row) => row?.name?.length ? row.name + ` (${row.clientID})` : ""}
								// getOptionLabel={(row) => row.name + ` (${row.clientID})`}
								onInputChange={handleChangeClient}
								onChange={(e,value) => handleChange({target:{id:"_clientID", value:value._id, name:value.name, clientID: value.clientID}})}
								fullWidth
								filterOptions={filterOptions}
								renderInput={(params) => <TextField {...params} label="Select Client" variant="standard" />}
							/>
						</Grid>

						{invoiceFields?.all?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									id={field.id}
									inputProps={field.type == "file" ? { multiple: true } : {}}
									InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
									value={field.id != "files" ? values[field.id] ?? '' : undefined}
									required={field.isRequired}
									error={errors[field.id]}
									onChange={handleChange}
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

						{invoiceFields?.all?.checkboxes.map((field) => (
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
						isEdit && (<Button color="error" variant="contained" onClick={tryDelete}>
							Delete entry
						</Button>)
					}
				</Box>
			</Card>
		</form>
	);
};

export default TaskAddForm;
