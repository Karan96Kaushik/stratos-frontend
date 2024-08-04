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
import paymentFields from '../../statics/salesPaymentFields';
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

const PaymentAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();

	const [salesRows, setSalesRows] = useState([{salesID:"", promoterName: "", _id: ""}]);
	// const [invoiceRows, setInvoiceRows] = useState([]);
	const [placeholder, setPlaceholder] = useState({
		sales: {salesID:"", promoterName: "", _id: ""}
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

		if(query.salesID) {
			try {
				let res = await authorizedReq({ route: "/api/sales/", creds: loginState.loginState, data: {salesID: query.salesID}, method: 'get' })
				setSalesRows([{salesID:res.salesID, promoterName: res.promoterName, _id: res._id}])
				setPlaceholder({
					sales: {salesID:res.salesID, promoterName: res.promoterName, _id: res._id}, 
				})
				setValues({
					...values, 
					salesID: res.salesID, 
					_salesID: res._id
				})
			} catch (err) {
				snackbar.showMessage(
					"Error getting sales - " + (err?.response?.data ?? err.message ?? err),
				)
			}
		}
	},[])

	useEffect(async () => {
		if(searchInfo.text.length > 3)
			getSales()
		if(searchInfo.text.length == 0)
			setSalesRows([])
	}, [searchInfo])

	const getSales = async () => {
		try {
			let response = await authorizedReq({ route: "/api/sales/search", creds: loginState.loginState, data: {...searchInfo, searchAll:true, ignorePermissions:true}, method: 'post' })
			setSalesRows(response.sales)

		} catch (err) {
			snackbar.showMessage(
				"Error getting sales - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
	};

	if (location.pathname.includes("edit")) {
		isEdit = true
		let paymentID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/sales/payments/", data:{_id:paymentID}, creds:loginState.loginState, method:"get"})

			setPlaceholder({
				sales: {salesID:data.salesID, promoterName: data.promoterName, _id: ""}, 
			})

			setValues(data)
		}, [])
	}

	const handleChangeSales = (e) => {
		let target = e?.target
		if(!target)
			return

		if(target?.value?.length > 3) {
			setSearchInfo({...searchInfo, text: target.value})
		}
		if(target?.value?.length == 0) {
			setSalesRows([])
		}
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/sales/payments/" + (!isEdit ? "add" : "update"), 
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
			let paymentID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/sales/payments/", 
				data:{_id:paymentID, password}, 
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

		else if (event.target.id == '_salesID' && event.target.value) {
			others["salesID"] = salesRows.find(val => event.target.value == val._id)
			setPlaceholder({sales:others["salesID"]})
			others["promoterName"] = others["salesID"].promoterName
			others["salesID"] = others["salesID"].salesID
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
		stringify: option => option.promoterName + option.exClientID + option.salesID + option.projectName,
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

						<Grid item md={6} xs={12}>
							<Autocomplete
								id="_salestID"
								options={salesRows}
								value={placeholder.sales}
								disabled={isEdit}
								getOptionLabel={(row) => row.promoterName?.length ? row.promoterName + ` (${row.salesID})` : ""}
								onInputChange={handleChangeSales}
								onChange={(e,value) => handleChange({target:{id:"_salesID", value:value?._id, name:value?.promoterName}})}
								fullWidth
								filterOptions={filterOptions}
								renderInput={(params) => <TextField {...params} label="Select Sales" variant="standard" />}
							/>
						</Grid>

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