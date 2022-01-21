import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent, Input, InputLabel,
	CardHeader, Divider, Grid, TextField, Select,
	Checkbox, FormControlLabel, Autocomplete, MenuItem,
	List, ListItem, Typography, Link, FormControl,
	ListItemText
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import taskFields from '../../statics/taskFields';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import * as _ from 'lodash'
import PasswordDialog from '../passwordDialog';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	let taskFieldsCopy = _.merge({}, taskFields)

	const [values, setValues] = useState({});
	const [clientRows, setClientRows] = useState([]);
	const [memberRows, setMemberRows] = useState([{userName:"", memberID:"", _id:""}]);
	const [memberPlaceholder, setMemberPlaceholder] = useState({userName:"", memberID:"", _id:""});
	const [placeholder, setPlaceholder] = useState({
		client: {clientID:"", name: "", _id: ""}
	});
	const [type, setType] = useState("");

	const handleChangeClient = (e) => {
		const target = e?.target

		if(target?.value?.length > 2) {
			setSearchInfo({...searchInfo, text: target.value})
		}
		if(target?.value?.length == 0) {
			setClientRows([])
		}
	}
	
    let isEdit = location.pathname.includes("edit");

	if(isEdit && type) {
		// filter out option to edit some fields
		taskFieldsCopy[type].texts = taskFieldsCopy[type]?.texts.filter(
			f => !(["gst", "billAmount", "govtFees", "sroFees"].includes(f.id))
		)
	}

	const [searchInfo, setSearchInfo] = useState({type:"", text:""});

	useEffect(async () => {
		if(searchInfo.text.length > 2)
			getClients()
		if(searchInfo.text.length == 0)
			setClientRows([])
	}, [searchInfo])

	useEffect(async () => {
		let members = await getMembers()
		if (isEdit) {
			let taskID = location.pathname.split("/").pop()
			let data = await authorizedReq({route:"/api/tasks/", data:{_id:taskID}, creds:loginState.loginState, method:"get"})

			members = members.find(val => String(val._id) == String(data._memberID)) 
			if(members)
				setMemberPlaceholder(members)
			setPlaceholder({ client:{ name: data.clientName, clientID: data.clientID }})
			setType(data.serviceType)
			setValues(data)
		}
	}, [])

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

	const getMembers = async () => {
		try {
			let response = await authorizedReq({ route: "/api/members/list", creds: loginState.loginState, data: {}, method: 'get' })
			setMemberRows(response)
			return response

		} catch (err) {
			snackbar.showMessage(
				"Error getting members - " + (err?.response?.data ?? err.message ?? err),
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
		taskFieldsCopy[type].texts.map(field => {
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
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const [open, setOpen] = useState(false)
	const tryDelete = () => {
		setOpen(true)
	}

	const handleDelete = async (password) => {
		try {

			let taskID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/tasks/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} task!`,
			)
			navigate(-1);
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
			// Don't allow user to EDIT client of the task
			if(isEdit)
				return
			let client = clientRows.find(val => String(val._id) == event.target.value)
			if (!client)
				return
			others.clientName = client.name
			others.clientID = client.clientID
			others.promoter = client.promoter
			setPlaceholder({client})
		} else if (event.target.id == '_memberID') {
			others.memberName = event.target.name
			others.memberID = event.target.memberID
			setMemberPlaceholder(memberRows.find(val => String(val.memberID) == String(others.memberID)))
		} else if (event.target.id == '_membersAssigned') {
			others.membersAssigned = memberRows.filter(v => event.target.value.includes(v._id))
			others.membersAssigned = others.membersAssigned.map(v => v.userName)
			others.membersAssigned = others.membersAssigned.join(", ")
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
			<PasswordDialog protectedFunction={handleDelete} open={open} setOpen={setOpen} />
			<Card>
				<CardHeader
					title={isEdit ? "Edit Task " + values?.taskID : "New Task"}
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
								onChange={(e,value) => handleChange({target:{id:"_clientID", value:value?._id, name:value?.name, clientID: value?.clientID}})}
								fullWidth
								filterOptions={filterOptions}
								renderInput={(params) => <TextField {...params} label="Select Client" variant="standard" />}
							/>
						</Grid>

						<Grid item md={6} xs={12}>
							<FormControl fullWidth>	
								<InputLabel id="_membersAssigned">Assiged Members</InputLabel>
								<Select 
									multiple 
									fullWidth
									id="_membersAssigned" 
									value={values?._membersAssigned || []}
									onChange={({target}) => handleChange({target: {value: target.value, id:"_membersAssigned"}})}
									input={<Input />} 
									renderValue={(s) => values?.membersAssigned}
									>
									{memberRows.map((member) => (
										<MenuItem key={member.userName} value={member._id}>
											<Checkbox checked={(values?._membersAssigned ?? []).indexOf(member._id) > -1} />
											<ListItemText primary={member.userName} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{/* <Grid item md={6} xs={12}>
							<Autocomplete
								id="membersAssigned"
								// multiple
								options={memberRows}
								value={memberPlaceholder}
								getOptionLabel={(row) => row.userName?.length ? row.userName + ` (${row.memberID})` : ''}
								// onInputChange={handleChangeClient}
								onChange={(e,value={}) => handleChange({target:{id:"_memberID", value:value?._id, name:value?.userName, memberID:value?.memberID}})}
								fullWidth
								renderInput={(params) => <TextField {...params} label="Member Assigned" variant="standard" />}
							/>
						</Grid> */}

						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Select Service"
								id="serviceType"
								onChange={handleChange}
								required
								error={errors.serviceType}
								defaultValue={!isEdit?"":Object.keys(taskFieldsCopy)[0]}
								disabled={isEdit}
								value={values.serviceType}
								select
								SelectProps={{ native: true }}
								variant="outlined"
							>
								<option />
								{Object.keys(taskFieldsCopy).map((option) => (
									<option
										key={option}
										value={option}
									>
										{taskFieldsCopy[option]?.name}
									</option>
								))}
							</TextField>
						</Grid>

						{taskFieldsCopy[type]?.texts.map((field) => (
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

						{taskFieldsCopy[type]?.checkboxes.map((field) => (
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
