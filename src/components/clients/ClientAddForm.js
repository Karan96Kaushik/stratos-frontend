import { useState, useContext, useEffect, Fragment } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader,	Divider, Grid, TextField,
	Checkbox, FormControlLabel
} from '@material-ui/core';
import {LoginContext} from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../../utils/request'
import {useNavigate} from 'react-router-dom';
import clientFields from '../../statics/clientFields';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	const [type, setType] = useState("");

	const handleSubmit = async () => {
		try {
			await authorizedReq({route:"/api/clients/add", data:values, creds:loginState.loginState, method:"post"})
			snackbar.showMessage(
				'Successfully added task!',
			)
			navigate('/app/clients');
		} catch (err) {
			snackbar.showMessage(
				"Error: " + err,
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
			[event.target.id]: event.target.value || event.target.checked
		});
	};

	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
					title="New Client"
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={2}>
						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Select Type"
								id="clientType"
								onChange={handleChange}
								required
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
									label={field.label}
									type={field.type ?? 'text'}
									id={field.id}
									onChange={handleChange}
									required
									value={values.firstName}
									variant="outlined"
								/>
							</Grid>))}

						{clientFields[type]?.checkboxes.map((field) => (
							<Grid item md={6} xs={12}>
								<FormControlLabel
									control={<Checkbox
										checked={values[field.id]}
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
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', p:2}}>
					<Button	color="primary" variant="contained" onClick={handleSubmit}>
						Save details
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default TaskAddForm;
