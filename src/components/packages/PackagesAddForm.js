import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Link, List, ListItem, Typography, makeStyles, 
	Autocomplete, FormControlLabel, Checkbox,
	FormControl, InputLabel, Select, Input,
	MenuItem, ListItemText
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate, useLocation } from 'react-router-dom';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import packageFields, { otherServices, services, yearlyServices } from '../../statics/packageFields';
import PasswordDialog from '../passwordDialog';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1)
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	chip: {
		margin: 2
	},
	noLabel: {
		marginTop: theme.spacing(3)
	}
}));

function useQuery() {
	let entries =  new URLSearchParams(useLocation().search);
	const result = {}
	for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

const PackageAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();

	const [clientRows, setClientRows] = useState([{clientID:"", name: "", _id: ""}]);
	const [memberRows, setMemberRows] = useState([{userName:"", memberID:"", _id:""}]);
	const [placeholder, setPlaceholder] = useState({
		task: {taskID:"", _id: ""}, 
		client: {clientID:"", name: "", _id: ""}
	});

	const [values, setValues] = useState({});
	
	const query = useQuery();

    let isEdit = false;
	const [searchInfo, setSearchInfo] = useState({type:"", text:""});

	const [errors, setErrors] = useState({});

	const packageFieldsCopy = _.merge({}, packageFields)

	// services.forEach(s => { packageFieldsCopy.all.checkboxes.push({label:s, id:s}) })
	// yearlyServices.forEach(s => { packageFieldsCopy.all.checkboxes.push({label:s, id:s}) })

	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")
		packageFields["all"].texts.map(field => {
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

	useEffect(() => {
		getMembers()
	}, [])

	if (location.pathname.includes("edit")) {
		isEdit = true
		let leadID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/packages/", data:{_id:leadID}, creds:loginState.loginState, method:"get"})
			setPlaceholder({
				client: {clientID:data.clientID, name: data.clientName, _id: ""}, 
			})

			setValues(data)
		}, [])
	}

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

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/packages/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} package!`,
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
			let packageID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/packages/",
				data:{_id:packageID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted package!`,
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
			others = {docs:[]}

			let allFiles = []
			let len = (event.target.files.length)
			let filesClone = Object.assign(Object.create(Object.getPrototypeOf(event.target.files)), event.target.files)
			// console.log(filesClone)
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
			// console.log(event.target.files, allFiles)
			event.target.id = "ignore"
				
		}

		else if (event.target.id == '_clientID' && event.target.value) {
			let client = clientRows.find(val => event.target.value == val._id)
			others.clientName = client.name
			others.clientID = client.clientID
			others.promoter = client.promoter
			setPlaceholder({client:client})
		}

		else if (event.target.id == '_rmAssigned') {
			others.rmAssigned = memberRows.filter(v => event.target.value.includes(v._id))
			others.rmAssigned = others.rmAssigned.map(v => v.userName)
			others.rmAssigned = others.rmAssigned.join(", ")
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
					title={!isEdit ? "New Package" : "Edit Package"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>

						{<Grid item md={6} xs={12}>
							<Autocomplete
								id="_clientID"
								options={clientRows}
								value={placeholder.client}
								disabled={isEdit}
								getOptionLabel={(row) => row.name?.length ? row.name + ` (${row.clientID})` : ""}
								onInputChange={handleChangeClient}
								onChange={(e,value) => handleChange({target:{id:"_clientID", value:value?._id, name:value?.name}})}
								fullWidth
								filterOptions={filterOptions}
								renderInput={(params) => <TextField {...params} label="Select Client" variant="standard" />}
							/>
						</Grid>}

						{packageFieldsCopy.all?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									inputProps={field.type == "file" ? { multiple: true } : {}}
									InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
									id={field.id}
									required={field.isRequired}
									error={errors[field.id]}
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
						
										
						<Grid item md={6} xs={12}>
							<FormControl fullWidth>	
								<InputLabel id="_rmAssigned">Relationship Manager</InputLabel>
								<Select 
									multiple 
									fullWidth
									id="_rmAssigned" 
									value={values?._rmAssigned || []}
									onChange={({target}) => handleChange({target: {value: target.value, id:"_rmAssigned"}})}
									input={<Input />} 
									renderValue={(s) => values?.rmAssigned}
									>
									{memberRows.map((member) => (
										<MenuItem key={member.userName} value={member._id}>
											<Checkbox checked={(values?._rmAssigned ?? []).indexOf(member._id) > -1} />
											<ListItemText primary={member.userName} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{packageFieldsCopy?.all?.checkboxes.map((field) => (
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

						<Grid item md={12} xs={12}>
							<Typography variant='h4'>Services</Typography>
						</Grid>

						{[...services, ...yearlyServices, ...otherServices].map((field) => (
							<Grid item md={6} xs={12}>
								<FormControlLabel
									control={<Checkbox
										checked={values[field] ? true : false}
										onChange={handleChange}
										id={field}
										color="primary"
									/>}
									label={field}
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

export default PackageAddForm;
