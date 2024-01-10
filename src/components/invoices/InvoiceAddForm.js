import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Grid, TextField,
	Checkbox, FormControlLabel, Link, List,
	ListItem, Typography, IconButton, Badge, SvgIcon, Autocomplete
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import invoiceFields, {froms} from '../../statics/invoiceFields';
import PasswordDialog from '../passwordDialog';
import { Plus, Trash2 } from 'react-feather';
import ProjectInput from '../ProjectInput';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
    let isEdit = false;

	const [errors, setErrors] = useState({});
	const [disabled, setDisabled] = useState({});
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

	const handleSubmit = async () => {
		try {
			if((values?.items?.length ?? []) == 0) {
				throw new Error("No items added to invoice")
			}
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
		let others = {}
		let overrideID
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
		else if (event.target.id.includes("-$")) {
			let [id, idx] = event.target.id.split("-$")
			others.items = values.items
			others.items[parseInt(idx)][id] = event.target.value
			overrideID = "none"
		}
		else if (event.target.id == "from") {

			if (froms[event.target.value].gstNum) {
				others = {
					gstNum: froms[event.target.value].gstNum,
					panNum: froms[event.target.value].panNum
				}
				setDisabled({
					gstNum: true,
					panNum: true
				})
			}
			// else if (event.target.value == 'Osha Technologies') {
			else {
				others = {
					gstNum: '',
					panNum: ''
				}
				setDisabled({
					gstNum: false,
					panNum: false
				})
			}

			if (['SDC Legal Services', 'RERA Easy Consultancy'].includes(event.target.value) && values.items) {
				others.items = values.items
				others.items.forEach(i => i.particulars = 'Legal Consultation')
			}	
		}

		setValues({
			...values,
			...others,
			[overrideID ?? event.target.id]: event.target.type != 'checkbox' ? event.target.value : event.target.checked
		});

	};

	const [open, setOpen] = useState(false)
	const tryDelete = () => {
		setOpen(true)
	}

	console.debug(values)

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
			// console.error(err)
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
		<form {...props} autoComplete="off" noValidate >
			<PasswordDialog protectedFunction={handleDelete} open={open} setOpen={setOpen} />
			<Card>
				<CardHeader
					title={!isEdit ? "New Invoice" : ("Edit Invoice " + values?.invoiceID)}
					subheader=""
				/>
				<CardContent>
					<Grid container spacing={3}>

						{invoiceFields?.all?.texts.map((field) => field.id !== "invoiceID" && ( 
							field.id == 'projectName' ? <Grid item md={6} xs={12}> <ProjectInput values={values} setValues={setValues} /> </Grid> :
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
									disabled={disabled[field.id] ?? false}
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

						{(values.items ?? []).map((item, idx) => (
							<>
								<Divider style={{width:'100%', padding: '10px'}}  />
								{invoiceFields?.item?.texts.map((field) => (
									<Grid item md={6} xs={12}>
										<TextField
											fullWidth
											select={field.options?.length}
											SelectProps={{ native: true }}
											label={field.label + " " + (idx+1)}
											type={field.type ?? 'text'}
											id={field.id + "-$" + idx}
											disabled={['SDC Legal Services', 'RERA Easy Consultancy'].includes(values['from']) && field.id == 'particulars'}
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
										<IconButton onClick={() => removeItem(idx)}>
											<Trash2 color='red' />
										</IconButton>
									</Grid>
							</>
						))}
						<Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
							<Button variant="outlined" onClick={addItem}>
								Add Invoice Item
							</Button>
						</Grid>
						<Divider style={{width:'100%', padding: '10px'}}  />
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
