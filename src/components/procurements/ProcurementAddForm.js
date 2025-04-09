import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, List, ListItem,
	Typography, Link
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import procurementFields from '../../statics/procurementFields';
import PasswordDialog from '../passwordDialog';
import MembersAutocomplete from '../membersAutocomplete';
import { useSelector } from 'react-redux';
import { selectMembers } from '../../store/reducers/membersSlice';

const ProcurementAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const memberRows = useSelector(selectMembers)
	const originalRef = useRef();

	const [values, setValues] = useState({});
	const [type, setType] = useState("");
	
    let isEdit = false;
	let isManage = false;

	if (location.pathname.includes("edit") || location.pathname.includes("manage")) {
		isEdit = true
		if (location.pathname.includes("manage")) {
		isManage = true
		}
		let procurementID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/procurements/", data:{_id:procurementID}, creds:loginState.loginState, method:"get"})
			originalRef.current = data;
			setType(data.procurementType)
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
		procurementFields['all'].texts.map(field => {
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

    console.debug('values', values)

	const handleSubmit = async () => {
		try {
			let data = {...values}
			if (originalRef.current) {
				data = {
					updateData: data, 
					originalData: originalRef.current, 
					member: {userName: loginState.loginState.userName},
				}
			}

			validateForm()
			await authorizedReq({
				route:"/api/procurements/" + (!isEdit ? "add" : "update"), 
				data:data, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} procurement!`,
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
			// const resp = confirm("Are you sure you want to delete this entry?")
			// console.log(resp)
			// if(!resp)
			// 	return
			let taskID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/procurements/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted procurement!`,
			)
			navigate('/app/procurement');
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
			// console.log(event.target.files, allFiles)
			event.target.id = "ignore"
				
		} else if (event.target.id == 'procurementType') {
			setType(event.target.value)
		} 

		// console.log(others)
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

	return (
		<form {...props} autoComplete="off" noValidate >
			<PasswordDialog protectedFunction={handleDelete} open={open} setOpen={setOpen} />
			<Card>
				<CardHeader
					title={!isEdit ? "New Procurement" : "Edit Procurement"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>

						{isManage && <Grid item md={6} xs={12}>
							<MembersAutocomplete memberRows={memberRows} setValues={setValues} title="Approvers" _label="_approvers" values={values} DepatmentOnly={false} />
						</Grid>}

						{procurementFields['all']?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									// inputProps={{ multiple: true }}
									InputLabelProps={{ shrink: (field.type == "date" || field.type == "file") ? true : undefined }}
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

						{procurementFields['all']?.checkboxes.map((field) => (
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
							<Typography variant="h5">Remarks History</Typography>

							{isEdit && values?.existingRemarks?.length && <List>
								{values?.existingRemarks?.map((remarks) => (<ListItem>
										<Typography variant='body2'>{remarks}</Typography>
									</ListItem>))}
							</List>}
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

export default ProcurementAddForm;
