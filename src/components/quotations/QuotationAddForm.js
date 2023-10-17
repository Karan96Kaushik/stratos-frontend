import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, List, Link,
	FormControl, InputLabel, makeStyles, ListItemText, Input,
	ListItem, Typography, Select, MenuItem
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import quotationFields from '../../statics/quotationFields';
import taskFields from "../../statics/taskFields"
import PasswordDialog from '../passwordDialog';
import MessageDialog from '../MessageDialog.js';

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
services.unshift("")
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D', 'General')

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

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();

	const [message, setMessage] = useState({})

	const [values, setValues] = useState({});
	
    let isEdit = false;

	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")
		quotationFields.all.texts.map(field => {
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
		let quotationID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/quotations/", data:{_id:quotationID}, creds:loginState.loginState, method:"get"})
			setValues(data)
		}, [])
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			let resp = await authorizedReq({
				route:"/api/quotations/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})

			if (resp.message) {
				let resolveExternal, rejectExternal
				const promise = new Promise((resolve, reject) => {
					resolveExternal = resolve;
					rejectExternal = reject;
				});
				setMessage({
					open:true,
					resolveExternal, rejectExternal,
					options:['Ignore Duplicate', 'Return To Check'],
					title: resp.message,
					content: 'Please return to check or ignore if checked already'
				})
	
				const userResp = await promise
	
				if (userResp !== 'Ignore Duplicate') {
					return 
				}

				await authorizedReq({
					route:"/api/quotations/" + (!isEdit ? "add" : "update"), 
					data:{...values, ignoreDuplicateMobile: true}, 
					creds:loginState.loginState, 
					method:"post"
				})
			}


			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} quotation!`,
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
				route:"/api/quotations/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted quotation!`,
			)
			navigate('/app/quotations');
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
				
		}
		
		setValues({
			...values,
			...others,
			[event.target.id ?? event.target.name]: event.target.type != 'checkbox' ? event.target.value : event.target.checked
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
	return (
		<form {...props} autoComplete="off" noValidate >
			<PasswordDialog protectedFunction={handleDelete} open={open} setOpen={setOpen} />
			<Card>
				<CardHeader
					title={!isEdit ? "New Quotation" : "Edit Quotation"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<MessageDialog message={message} setMessage={setMessage} />
					<Grid container spacing={3}>

						{quotationFields?.all?.texts.map((field) => (
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

						<Grid item md={12} xs={12}>
							<FormControl fullWidth className={classes.formControl}>	
							<InputLabel id="serviceType">Service Type</InputLabel>
							<Select 
								multiple 
								fullWidth
								name="serviceType"
								id="serviceType" value={values?.serviceType ?? []}
								onChange={handleChange}
								input={<Input />} renderValue={(selected) => selected.join(', ')}
								>
								{services.map((name) => (
									<MenuItem key={name} value={name}>
										<Checkbox checked={(values?.serviceType ?? []).indexOf(name) > -1} />
										<ListItemText primary={name} />
									</MenuItem>
								))}
							</Select>
							</FormControl>
						</Grid>

						{quotationFields?.all?.checkboxes.map((field) => (
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
