import { useState, useContext, useRef, Fragment, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel,
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import clientFields from '../../statics/clientFields';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	const [type, setType] = useState("");
	
    let isEdit = false;

	if (location.pathname.includes("edit")) {
		isEdit = true
		let clientID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/clients/", data:{_id:clientID}, creds:loginState.loginState, method:"get"})
			setType(data.clientType)
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
		console.debug(foundErrs)
		setErrors(foundErrs)
		if(errorFlag)
			throw new Error(errFields.join(", "))
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/clients/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} client!`,
			)
			navigate('/app/clients');
		} catch (err) {
			console.debug(err, err.message)
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const handleChange = (event) => {

		if (event.target.id == 'clientType') {
			setType(event.target.value)
		} 

		setValues({
			...values,
			// ...others,
			[event.target.id]: event.target.value ?? event.target.checked
		});

	};

	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
					title={!isEdit ? "New Client" : "Edit Client"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>

						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Select Type"
								id="clientType"
								onChange={handleChange}
								required
								defaultValue={!isEdit ? "":Object.keys(clientFields)[0]}
								disabled={isEdit}
								value={values.clientType}
								select
								SelectProps={{ native: true }}
								variant="outlined"
							>
								<option />
								{Object.keys(clientFields).map((option) => (
									<option
										key={option}
										value={option}
									>
										{clientFields[option]?.name}
									</option>
								))}
							</TextField>
						</Grid>

						{clientFields[type]?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									id={field.id}
									required={field.isRequired}
									error={errors[field.id]}
									onChange={handleChange}
									value={values[field.id] ?? ''}
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

						{clientFields[type]?.checkboxes.map((field) => (
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
				</Box>
			</Card>
		</form>
	);
};

export default TaskAddForm;
