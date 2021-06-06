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
import taskFields from '../../statics/taskFields';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

const TaskAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	const [type, setType] = useState("");
	const [open, setOpen] = useState(false);
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!open) {
		  setOptions([]);
		}
	}, [open]);

	const getClients = () => {
		setLoading(true)
		
		console.info(values.client);
		;(async () => {
			let response = await authorizedReq({ route: "/api/clients/", creds: loginState.loginState, data:{}, method: 'get' })
			response = response.map(a => ({...a, id: a.clientType}))
			console.info(response)
			setOptions(response)//response.map(key => key.clientType));
			setLoading(false)
		})();
	
	};

	const handleSubmit = async () => {
		try {
			await authorizedReq({route:"/api/tasks/add", data:values, creds:loginState.loginState, method:"post"})
			snackbar.showMessage(
				'Successfully added task!',
			)
			navigate('/app/tasks');
		} catch (err) {
			snackbar.showMessage(
				"Error: " + err,
			)
			console.error(err)
		}
		
	};

	const handleChange = (event) => {
		if (event.target.id == 'serviceType') {
			setType(event.target.value)
		} else if (event.target.id == 'client' && values?.client?.length > 2) {
			getClients()
		}
		console.info(event.target)

		setValues({
			...values,
			[event.target.id]: event.target.value || event.target.checked
		});
	};

	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
					title="New Task"
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>
						<Grid item md={12} xs={12}>
							<Autocomplete
								id="client"
								open={open}
								onOpen={() => {setOpen(true)}}
								onClose={() => {setOpen(false)}}
								getOptionSelected={(option, value) => option.clientID === value.clientID}
								getOptionLabel={(option) => option.clientType}
								value={values.client}
								options={options}
								loading={loading}
								onChange={(_, n) => {console.info(n); setValues({...values, clientID:n._id})}}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Client"
										variant="outlined"
										onChange={handleChange}
										InputProps={{
											...params.InputProps,
											endAdornment: (
											<Fragment>
												{loading ? <CircularProgress color="inherit" size={20} /> : null}
												{params.InputProps.endAdornment}
											</Fragment>
											),}}
									/>)}
								/>
						</Grid>
						<Grid item md={12} xs={12}>
							<TextField
								fullWidth
								label="Select Service"
								id="serviceType"
								onChange={handleChange}
								required
								select
								SelectProps={{ native: true }}
								variant="outlined"
							>	
								<option />
								{Object.keys(taskFields).map((option) => (
									<option
										key={option}
										value={option}
									>
										{taskFields[option]?.name}
									</option>
								))}
							</TextField>
						</Grid>

						{taskFields[type]?.texts.map((field) => (
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

						{taskFields[type]?.checkboxes.map((field) => (
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
