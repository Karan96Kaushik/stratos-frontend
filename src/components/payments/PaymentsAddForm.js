import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Link, List, ListItem, Typography, makeStyles, 
	Autocomplete,
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate, useLocation } from 'react-router-dom';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import paymentFields from '../../statics/paymentFields';
import taskFields from '../../statics/taskFields';
import PasswordDialog from '../passwordDialog';

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
services.unshift("")
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D')

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

const PaymentAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();

	const [clientRows, setClientRows] = useState([{clientID:"", name: "", _id: ""}]);
	const [taskRows, setTaskRows] = useState([{taskID:'', packageID:'', _id: ""}]);
	// const [invoiceRows, setInvoiceRows] = useState([]);
	const [placeholder, setPlaceholder] = useState({
		task: {taskID:"", _id: ""}, 
		client: {clientID:"", name: "", _id: ""}
	});

	const [values, setValues] = useState({});
	
	const query = useQuery();

    let isEdit = false;
	const [searchInfo, setSearchInfo] = useState({type:"", text:""});

	const [errors, setErrors] = useState({});

	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")
		paymentFields["all"].texts.map(field => {
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
		if(query.taskID) {
			try {
				let res = await authorizedReq({ route: "/api/tasks/payments/search/add", creds: loginState.loginState, data: {taskID: query.taskID}, method: 'get' })
				setClientRows([{clientID:res.clientID, name: res.clientName, _id: res._id}])
				setTaskRows([{taskID:res.taskID, _id: res._id}])
				setPlaceholder({
					client: {clientID:res.clientID, name: res.clientName, _id: res._id}, 
					task: {taskID:res.taskID, _id: res._id}
				})
				setValues({
					...values, 
					clientID: res.clientID, 
					taskID: res.taskID, 
					_clientID: res._clientID,
					_taskID: res._taskID,
					promoter: res.promoter,
					serviceType: res.serviceType,
					clientName: res.clientName,
				})
			} catch (err) {
				snackbar.showMessage(
					"Error getting tasks - " + (err?.response?.data ?? err.message ?? err),
				)
			}
		}

		if(query.packageID) {
			try {
				let res = await authorizedReq({ route: "/api/packages/", creds: loginState.loginState, data: {packageID: query.packageID}, method: 'get' })
				setClientRows([{clientID:res.clientID, name: res.clientName, _id: res._id}])
				setTaskRows([{packageID:res.packageID, _id: res._id}])
				setPlaceholder({
					client: {clientID:res.clientID, name: res.clientName, _id: res._id}, 
					task: {packageID:res.packageID, _id: res._id}
				})
				setValues({
					...values, 
					clientID: res.clientID, 
					packageID: res.packageID, 
					_clientID: res._clientID,
					_packageID: res._id,
					promoter: res.promoter,
					serviceType: "Package",
					clientName: res.clientName,
				})
			} catch (err) {
				snackbar.showMessage(
					"Error getting tasks - " + (err?.response?.data ?? err.message ?? err),
				)
			}
		}

		if(query.clientID) {
			try {
				let res = await authorizedReq({ route: "/api/clients/payments/search/add", creds: loginState.loginState, data: {clientID: query.clientID}, method: 'get' })
				getTasks(res._id)
				setClientRows([{clientID:res.clientID, name: res.name, _id: res._id}])
				setPlaceholder({
					client: {clientID:res.clientID, name: res.name, _id: res._id}, 
				})
				setValues({
					...values, 
					clientID: res.clientID, 
					_clientID: res._id
				})
			} catch (err) {
				snackbar.showMessage(
					"Error getting client - " + (err?.response?.data ?? err.message ?? err),
				)
			}
		}
	},[])

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
			let packages = await authorizedReq({ route: "/api/packages/payments/search", creds: loginState.loginState, data: {_clientID}, method: 'get' })
			setTaskRows([...tasks, ...packages])

		} catch (err) {
			snackbar.showMessage(
				"Error getting tasks - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
	};

	if (location.pathname.includes("edit")) {
		isEdit = true
		let leadID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/payments/", data:{_id:leadID}, creds:loginState.loginState, method:"get"})

			setPlaceholder({
				client: {clientID:data.clientID, name: data.clientName, _id: ""}, 
				task: {taskID:data.taskID, packageID: data.packageID, name: "", _id: ""}, 
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
				route:"/api/payments/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} payment!`,
			)
			navigate(-1);
			// navigate('/app/payments');
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
				route:"/api/payments/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted payment!`,
			)
			navigate(-1);
			// navigate('/app/payments');
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
			getTasks(event.target.value)
			others["clientID"] = clientRows.find(val => event.target.value == val._id)
			setPlaceholder({client:others["clientID"]})
			others["clientID"] = others["clientID"].clientID
		}

		else if (event.target.id == '_taskID' && event.target.value) {
			getTasks(event.target.value)
			let task = taskRows.find(val => event.target.value == val._id)
			setPlaceholder({...placeholder, task})
			others["promoter"] = task.promoter
			others["serviceType"] = task.serviceType
			others["clientName"] = task.clientName
			others["taskID"] = task.taskID
			// Clear package info if previously set
			others["packageID"] = null
			others["_packageID"] = null
		}

		else if (event.target.id == '_packageID' && event.target.value) {
			getTasks(event.target.value)
			let task = taskRows.find(val => event.target.value == val._id)
			setPlaceholder({...placeholder, task})
			others["promoter"] = task.promoter
			others["serviceType"] = "Package"
			others["clientName"] = task.clientName
			others["packageID"] = task.packageID
			// Clear tasks info if previously set
			others["taskID"] = null
			others["_taskID"] = null
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
					title={!isEdit ? "New Payment" : "Edit Payment"}
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

						{<Grid item md={6} xs={12}>
							<Autocomplete
								id="_taskID"
								options={taskRows}
								value={placeholder.task}
								getOptionLabel={(row) => (row.taskID ?? row.packageID) + (row.billAmount ? ` - ₹${row.billAmount}` : row.amount ? ` - ₹${row.amount}` : "")}
								disabled={((values?._clientID?.length || 0) < 3) || isEdit}
								onInputChange={handleChangeClient}
								onChange={(e,value) => handleChange({target:{id:value?.taskID ? "_taskID" : "_packageID", value:value?._id, name:value?.name}})}
								fullWidth
								// filterOptions={filterTaskOptions}
								renderInput={(params) => <TextField {...params} label="Select Task / Package" variant="standard" />}
							/>
						</Grid>}

						{paymentFields.all?.texts.map((field) => (
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

export default PaymentAddForm;