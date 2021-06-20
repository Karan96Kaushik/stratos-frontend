import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader,	Divider, Grid,
	TextField, Input, ListItemText, MenuItem, 
	Checkbox, Select, FormControl, makeStyles, 
	InputLabel
} from '@material-ui/core';
import {LoginContext} from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../../utils/request'
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {
	memberFields, 
	pagePermissionFields,
	servicePermissionFields,
} from '../../statics/memberFields';

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

    let isEdit = false;

    if (location.pathname.includes("edit")) {
		isEdit = true
		let memberID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/members/", data:{_id:memberID}, creds:loginState.loginState, method:"get"})
			data = data[0]
			
			data.pagePermissions = pagePermissionFields.map(val => data.permissions.page.includes(val.toLowerCase().replace(" ", "")) ? val : null )
			data.servicePermissions = servicePermissionFields.map(val => data.permissions.service.includes(val.toLowerCase().replace(" ", "")) ? val : null )

			data.pagePermissions = data.pagePermissions.filter(Boolean)
			data.servicePermissions = data.servicePermissions.filter(Boolean)

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
		clientFields[type].texts.map(field => {
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
				"Error: " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
		
	};

	const handleChange = (event) => {
		setValues({
			...values,
			[event.target.id]: event.target.value
		});
	};

	return (
		<form
			autoComplete="off"
			noValidate
			{...props}
		>
			<Card>
				<CardHeader
					title={isEdit ? "Edit Member" : "New Member"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						{memberFields.texts.map((field) => (!field.hideEdit || !isEdit) ? (<Grid item md={6} xs={12}>
								<TextField fullWidth
									select={field.options?.length}
									label={field.label}
									defaultValue={!isEdit ? "" : field.default ?? " "}
									id={field.id}
									required={field.isRequired}
									error={errors[field.id]}
									type={field.type ?? "text"}
									onChange={handleChange}
									value={values?.[field.id]}
									variant="outlined"
								/>
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
				</Box>
			</Card>
		</form>
	);
};

export default MemberAddForm;
