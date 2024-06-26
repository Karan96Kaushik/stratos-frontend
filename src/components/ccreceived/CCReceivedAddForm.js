import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, Link, List, ListItem, Typography,
	Select, FormControl, makeStyles, 
	InputLabel, Input, MenuItem, ListItemText
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import ccreceivedFields from '../../statics/ccreceivedFields';
import taskFields from "../../statics/taskFields"
import PasswordDialog from '../passwordDialog';
import { selectMembers } from 'src/store/reducers/membersSlice';

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

const CCReceivedAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();

	const ccreceivedFieldsCopy = _.merge({}, ccreceivedFields)
    ccreceivedFieldsCopy['all'].texts = ccreceivedFieldsCopy['all'].texts.filter(f => !f.isHidden)
	
	const [memberRows, setMemberRows] = useState([{userName:"", memberID:"", _id:""}]);
	// const [memberPlaceholder, setMemberPlaceholder] = useState({userName:"", memberID:"", _id:""});

	const [values, setValues] = useState({});

	let disabled = {
		// exClientID: true,
		// callingDate: true,
		// certificateNo: true,
		// dataID: true,
		// projectName: true,
		// promoterName: true,
		// phone1: true,
		// phone2: true,
		// village: true,
		// district: true,
		// form4: true,
		// oc: true,
		// certificateDate: true,
		// completionDate: true,
	}

    let isEdit = false;

	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")

		ccreceivedFieldsCopy["all"].texts.map(field => {
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

	useEffect(async () => {
		// let members = await getMembers()
		if (isEdit) {
			let _dataID = location.pathname.split("/").pop()
			let data = await authorizedReq({route:"/api/ccreceived/", data:{_id:_dataID}, creds:loginState.loginState, method:"get"})

			// members = members.find(val => String(val._id) == String(data._memberID))
			// if (typeof data._membersAssigned == 'string')
			// 	data._membersAssigned = JSON.parse(data._membersAssigned)
			setValues(data)
		}
	}, [])

	if (location.pathname.includes("edit")) {
		isEdit = true
		let dataID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/ccreceived/", data:{_id:dataID}, creds:loginState.loginState, method:"get"})
			setValues(data)
		}, [])
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/ccreceived/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} CC Received!`,
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
			let dataID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/ccreceived/", 
				data:{_id:dataID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted cc received!`,
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
					title={!isEdit ? "New CC Received" : ("Update CC Received " + values?.dataID)}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>


						{/* <Grid item md={6} xs={12}>
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
						</Grid> */}

						{ccreceivedFieldsCopy["all"]?.texts.map((field) => (
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

						{/* <Grid item md={6} xs={12}>
							<Typography variant="h5">Remarks History</Typography>

							{isEdit && values?.existingRemarks?.length && <List>
								{values?.existingRemarks?.map((remarks) => (<ListItem>
										<Typography variant='body2'>{remarks}</Typography>
									</ListItem>))}
							</List>}
						</Grid>
						 */}
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

						{ccreceivedFieldsCopy["all"]?.checkboxes.map((field) => (
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
						isEdit && (<Button color="error" variant="contained" onClick={tryDelete}>
							Delete entry
						</Button>)
					}
				</Box>
			</Card>
		</form>
	);
};

export default CCReceivedAddForm;
