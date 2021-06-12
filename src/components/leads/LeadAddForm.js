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
import leadFields from '../../statics/leadFields';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	const [type, setType] = useState("");
	
    let isEdit = false;

	if (location.pathname.includes("edit")) {
		isEdit = true
		let leadID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/leads/", data:{_id:leadID}, creds:loginState.loginState, method:"get"})
			setType(data.leadType)
			setValues(data)
		}, [])
	}

	const handleSubmit = async () => {
		try {
			await authorizedReq({
				route:"/api/leads/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				'Successfully added lead!',
			)
			navigate('/app/leads');
		} catch (err) {
			snackbar.showMessage(
				"Error: " + err,
			)
			console.error(err)
		}

	};

	const handleChange = (event) => {

		if (event.target.id == 'leadType') {
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
					title={!isEdit ? "New Lead" : "Edit Lead"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>

						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Select Type"
								id="leadType"
								onChange={handleChange}
								required
								defaultValue={!isEdit ? "":Object.keys(leadFields)[0]}
								disabled={isEdit}
								value={values.leadType}
								select
								SelectProps={{ native: true }}
								variant="outlined"
							>
								<option />
								{Object.keys(leadFields).map((option) => (
									<option
										key={option}
										value={option}
									>
										{leadFields[option]?.name}
									</option>
								))}
							</TextField>
						</Grid>

						{leadFields[type]?.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label}
									type={field.type ?? 'text'}
									id={field.id}
									onChange={handleChange}
									value={values[field.id] ?? ''}
									variant="outlined"
								>
									{(field.options ?? []).map((option) => (
									<option key={option[0] ?? option}
										value={option[0] ?? option}>
										{option[1] ?? option}
									</option>
									))}
								</TextField>
							</Grid>))}

						{leadFields[type]?.checkboxes.map((field) => (
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
