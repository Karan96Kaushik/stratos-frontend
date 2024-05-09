import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader,	Divider, Grid,
	TextField, Input, ListItemText, MenuItem, 
	Checkbox, Select, FormControl, makeStyles, 
	InputLabel, List, ListItem, Typography, Link
} from '@material-ui/core';
import {LoginContext} from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq, authorizedDownloadLink} from '../../utils/request'
import { useNavigate, useLocation} from 'react-router-dom';
import {
	memberFields, 
	pagePermissionFields,
	servicePermissionFields,
	notificationTypes
} from '../../statics/memberFields';
import * as _ from 'lodash';
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


const MemberAddForm = (props) => {
	const navigate = useNavigate();
  	const classes = useStyles();
	const [values, setValues] = useState({});
	const loginState = useContext(LoginContext);
	const snackbar = useSnackbar();
	const location = useLocation();
	let memberFieldsCopy = _.merge({}, memberFields);
	memberFieldsCopy = memberFieldsCopy.all

    let isEdit = false;

    if (location.pathname.includes("edit")) {
		isEdit = true
		let memberID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/members/", data:{_id:memberID}, creds:loginState.loginState, method:"get"})
			data.pagePermissions = pagePermissionFields.filter(val => data.permissions.page.includes(val))
			data.servicePermissions = servicePermissionFields.filter(val => data.permissions.service.includes(val))
			// delete data.files
			setValues(data)
		}, [])
	}
	
	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")
		memberFieldsCopy.texts.map(field => {
			if(isEdit && field.id == 'password')
				return
				
			let isInvalid = false

			console.log(field.label, (
				(field.validation ?? [])
					.map(validator => validator(values[field.id]))
					.find(v => v)
			))

			if(field.isRequired && !values[field.id])
				isInvalid = true
			else if ((
				(field.validation ?? [])
					.map(validator => validator(values[field.id]))
					.find(v => v)
			))
				isInvalid = true

			if(isInvalid) {
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
				route:"/api/members/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} member!`,
			)
			navigate('/app/members');
		} catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err),
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
			[event.target.id]: event.target.value
		});
	};

	const [open, setOpen] = useState(false)
	const tryDelete = () => {
		setOpen(true)
	}

	const handleDelete = async (password) => {
		try {
			let taskID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/members/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted member!`,
			)
			navigate('/app/members');
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

	return (
		<form
			autoComplete="off"
			noValidate
			{...props}
		>
			<PasswordDialog protectedFunction={handleDelete} open={open} setOpen={setOpen} />
			<Card>
				<CardHeader
					title={isEdit ? "Edit Member" : "New Member"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						{memberFieldsCopy.texts.map((field) => (!field.hideEdit || !isEdit) ? (<Grid item md={6} xs={12}>
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
							</Grid>): <></>)}
						<Grid item md={12} xs={12}>
							<FormControl fullWidth className={classes.formControl}>	
							<InputLabel id="pagePermissions">Page Permissions</InputLabel>
							<Select 
								multiple 
								fullWidth
								id="pagePermissions" value={values?.pagePermissions || []}
								onChange={(e) => setValues({...values, pagePermissions:e.target.value})}
								input={<Input />} renderValue={(selected) => selected.join(', ')}
								>
								{pagePermissionFields.map((name) => (
									<MenuItem key={name} value={name}>
										<Checkbox checked={(values?.pagePermissions ?? []).indexOf(name) > -1} />
										<ListItemText primary={name} />
									</MenuItem>
								))}
							</Select>
							</FormControl>
						</Grid>
						<Grid item md={12} xs={12}>
							<FormControl fullWidth className={classes.formControl}>	
							<InputLabel fullWidth id="servicePermissions">Service Permissions</InputLabel>
							<Select multiple fullWidth
								id="servicePermissions"
								value={values?.servicePermissions || []}
								onChange={(e) => setValues({...values, servicePermissions:e.target.value})}
								input={<Input />}
								placeholder="Services Permissions"
								renderValue={(selected) => selected.join(', ')}
								>
								{servicePermissionFields.map((name) => (
									<MenuItem key={name} value={name}>
										<Checkbox checked={(values?.servicePermissions ?? []).indexOf(name) > -1} />
										<ListItemText primary={name} />
									</MenuItem>
								))}
							</Select>
							</FormControl>
						</Grid>
						<Grid item md={12} xs={12}>
							<FormControl fullWidth className={classes.formControl}>	
							<InputLabel fullWidth id="activeNotifications">Active Notifications</InputLabel>
							<Select multiple fullWidth
								id="activeNotifications"
								value={values?.activeNotifications || []}
								onChange={(e) => setValues({...values, activeNotifications:e.target.value})}
								input={<Input />}
								placeholder="Active Notifications"
								renderValue={(selected) => selected.join(', ')}
								>
								{notificationTypes.map((name) => (
									<MenuItem key={name} value={name}>
										<Checkbox checked={(values?.activeNotifications ?? []).indexOf(name) > -1} />
										<ListItemText primary={name} />
									</MenuItem>
								))}
							</Select>
							</FormControl>
						</Grid>
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
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						p: 2
					}}
				>
					<Button
						color="primary"
						variant="contained"
						onClick={handleSubmit}
					>
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

export default MemberAddForm;
