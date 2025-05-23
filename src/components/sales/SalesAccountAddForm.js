import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, Link, List, ListItem, Typography,
	Select, FormControl, makeStyles, 
	InputLabel, Input, MenuItem, ListItemText, IconButton
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import salesFields from '../../statics/salesAccountsFields';
import taskFields from "../../statics/taskFields"
import PasswordDialog from '../passwordDialog';
// import { selectMembers } from 'src/store/reducers/membersSlice';
import { Plus, Trash2 } from 'react-feather';

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
// services.unshift("")
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

const SalesAccountAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();

	const salesFieldsCopy = _.merge({}, salesFields)
    salesFieldsCopy['all'].texts = salesFieldsCopy['all'].texts.filter(f => !f.isHidden)
	
	const [memberRows, setMemberRows] = useState([{userName:"", memberID:"", _id:""}]);
	// const [memberPlaceholder, setMemberPlaceholder] = useState({userName:"", memberID:"", _id:""});

	const [values, setValues] = useState({});

	let disabled = {
		exClientID: true,
		callingDate: true,
		certificateNo: true,
		salesID: true,
		projectName: true,
		promoterName: true,
		phone1: true,
		phone2: true,
		village: true,
		district: true,
		form4: true,
		oc: true,
		certificateDate: true,
		completionDate: true,
		purpose: true,
	}

    let isEdit = false;

	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")

		salesFieldsCopy["all"].texts.map(field => {
			let isInvalid = false

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

	const getMembers = async () => {
		try {
			let response = await authorizedReq({ route: "/api/members/list", creds: loginState.loginState, data: {}, method: 'get' })
			const memberSet = [...new Set(response.map(m => m.department))]
			let membersData = []
			memberSet.forEach(dep => {
				membersData.push({isDept: true, userName: dep + " Department", memberID: "Dept."})
				membersData.push(...response.filter(m => m.department == dep))
			})

			setMemberRows(membersData)
			return response

		} catch (err) {
			snackbar.showMessage(
				"Error getting members - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
		// response = response.map(val => ({id: val._id, label: (val.clientID ?? val.name) + ` (${val._id})`}))
	};

	useEffect(async () => {
		let members = await getMembers()
		if (isEdit) {
			let salesID = location.pathname.split("/").pop()
			let data = await authorizedReq({route:"/api/sales/", data:{_id:salesID}, creds:loginState.loginState, method:"get"})

			members = members.find(val => String(val._id) == String(data._memberID))
			if (typeof data._membersAssigned == 'string')
				data._membersAssigned = JSON.parse(data._membersAssigned)
			setValues(data)
		}
	}, [])

	if (location.pathname.includes("edit")) {
		isEdit = true
		let salesID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/sales/", data:{_id:salesID}, creds:loginState.loginState, method:"get"})
			setValues(data)
		}, [])
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/sales/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} sales!`,
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
			let salesID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/sales/", 
				data:{_id:salesID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted sales!`,
			)
			navigate(-1);
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const removeItem = (idx) => {
		values.items.splice(idx,1)
		setValues({...values, items: values.items})
	}

	const addItem = () => { 
		let items = {}
		if (!values?.items) 
			items =[{}]
		else
			items = [...values.items, {}]


		if (['SDC Legal Services', 'RERA Easy Consultancy'].includes(values['from'])) {
			items.forEach(i => i.particulars = 'Legal Consultation')
		}

		setValues({...values, items})

	}

	const handleChange = async (event) => {
		let overrideID
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

		if (event.target.id == '_memberID') {
			others.memberName = event.target.name
			others.memberID = event.target.memberID
			// setMemberPlaceholder(memberRows.find(val => String(val.memberID) == String(others.memberID)))
		} 
		else if (event.target.id == '_membersAssigned') {
			let departments = event.target.value.filter(d => d.includes('Department'))
			let departmentNames = departments.map(d => d.split(" Department")[0])
			others.membersAssigned = memberRows.filter(v => (departmentNames.includes(v.department)) || event.target.value.includes(v._id))
			event.target.value = others.membersAssigned.map(v => v._id).concat(departments)
			others.membersAssigned = others.membersAssigned.map(v => v.userName)
			others.membersAssigned = others.membersAssigned.join(", ")
		}
		else if (event.target.id.includes("-$")) {
			let [id, idx] = event.target.id.split("-$")
			others.items = values.items
			others.items[parseInt(idx)][id] = event.target.value
			overrideID = "none"
		}

		setValues({
			...values,
			...others,
			[overrideID ?? event.target.id ?? event.target.name]: event.target.type != 'checkbox' ? event.target.value : event.target.checked
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
					title={!isEdit ? "New Sales Lead" : ("Update Sales Lead " + values?.salesID)}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>


						<Grid item md={6} xs={12}>
							<FormControl fullWidth>	
								<InputLabel id="_membersAssigned">Assiged Members</InputLabel>
								<Select 
									multiple 
									fullWidth
									id="_membersAssigned" 
									value={values?._membersAssigned || []}
									onChange={({target}) => handleChange({target: {value: target.value, id:"_membersAssigned" }})}
									input={<Input />} 
									renderValue={(s) => values?.membersAssigned}
									>
									{memberRows.map((member) => (
										<MenuItem key={member.userName} value={member._id ?? member.userName} style={{left: member.isDept ? 0 : 20}}>
											<Checkbox checked={(values?._membersAssigned ?? []).includes(member._id) || (values?._membersAssigned ?? []).includes(member.userName)} />
											<ListItemText primary={member.userName} />
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{salesFieldsCopy["all"]?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									disabled={isEdit && disabled[field.id]}
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
							<Typography variant="h5">Remarks History</Typography>

							{isEdit && values?.existingRemarks?.length && <List>
								{values?.existingRemarks?.map((remarks) => (<ListItem>
										<Typography variant='body2'>{remarks}</Typography>
									</ListItem>))}
							</List>}
						</Grid>
						
						{/* <Grid item md={12} xs={12}>
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
						</Grid> */}

						{salesFieldsCopy["all"]?.checkboxes.map((field) => (
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
						
						{(values.items ?? []).map((item, idx) => (
							<>
								<Divider style={{width:'100%', padding: '10px'}}  />
								{salesFieldsCopy?.item?.texts.map((field) => (
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											select={field.options?.length}
											SelectProps={{ native: true }}
											label={field.label + " " + (idx+1)}
											type={field.type ?? 'text'}
											id={field.id + "-$" + idx}
											inputProps={field.type == "file" ? { multiple: true } : {}}
											InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
											value={field.id != "files" ? values.items[idx][field.id] ?? '' : undefined}
											// required={field.isRequired}
											// error={errors[field.id]}
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
									<Grid item md={6} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
									</Grid>
									<Grid item md={6} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
										<IconButton onClick={() => removeItem(idx)}>
											<Trash2 color='red' />
										</IconButton>
									</Grid>
							</>
						))}
						<Divider style={{width:'100%', padding: '10px'}}  />
						<Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button variant="outlined" onClick={addItem}>
								Add Service Item
							</Button>
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

export default SalesAccountAddForm;
