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
import ticketFields from '../../statics/ticketFields';
import taskFields from "../../statics/taskFields"
import PasswordDialog from '../passwordDialog';
import { useSelector } from "react-redux";
import { selectMembers } from 'src/store/reducers/membersSlice';
import ClientsInput from 'src/components/ClientsInput';

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

const TicketAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();
	
	const memberRows = useSelector(selectMembers)

	const [values, setValues] = useState({});
	// const [type, setType] = useState("");
	
    let isUpdate = false;

	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")

		ticketFields.all.texts.map(field => {
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

	isUpdate = Boolean(location.pathname.includes("edit"))

	useEffect(async () => {
		if (isUpdate) {

			let ticketID = location.pathname.split("/").pop()
			let data = await authorizedReq({route:"/api/tickets/", data:{_id:ticketID}, creds:loginState.loginState, method:"get"})

			let members = memberRows.find(val => String(val._id) == String(data._memberID))
			// if(members)
			// 	setMemberPlaceholder(members)
			// setPlaceholder({ client:{ name: data.clientName, clientID: data.clientID }})
			// setType(data.ticketType)
			if (typeof data._membersAssigned == 'string')
				data._membersAssigned = JSON.parse(data._membersAssigned)
			setValues(data)
		}
	}, [])

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/tickets/" + (!isUpdate ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isUpdate ? "added" : "updated"} ticket!`,
			)
			navigate('/app/tickets');
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
				route:"/api/tickets/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted ticket!`,
			)
			navigate('/app/tickets');
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

		if (event.target.id == 'ticketType') {
			setType(event.target.value)
		} 
		else if (event.target.id == '_memberID') {
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
					title={!isUpdate ? "New Ticket" : "Update Ticket"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>

					<Grid item md={12} xs={12}>
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

						<Grid item md={6} xs={12}>
							<ClientsInput values={values} setValues={setValues} isEdit={isUpdate} />
						</Grid>

						{ticketFields.all?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									inputProps={field.type == "file" ? { multiple: true } : {}}
									InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isUpdate) ? true : undefined }}
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


						<Grid item md={12} xs={12}>
							<TextField 
								multiline
								InputLabelProps={{ shrink: (isUpdate) ? true : undefined }}
								fullWidth
								id="description"
								value={values["description"]}
								rows={4}
								label="Description"
								onChange={handleChange}
								/>
						</Grid>


						{ticketFields.all?.checkboxes.map((field) => (
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
							{isUpdate && values?.files && <List>
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
						isUpdate && (<Button color="error" variant="contained" onClick={tryDelete}>
							Delete entry
						</Button>)
					}
				</Box>
			</Card>
		</form>
	);
};

export default TicketAddForm;
