import { useState, useContext } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader,	Divider, Grid, TextField,
	Checkbox, FormControlLabel
} from '@material-ui/core';
import {LoginContext} from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../../utils/request'
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import taskFields from '../../statics/taskFields';

const TaskAddForm = (props) => {
    const navigate = useNavigate();

	const [values, setValues] = useState({});
	const loginState = useContext(LoginContext)
    const snackbar = useSnackbar()

	const handleSubmit = async () => {
        try {
            await authorizedReq({route:"/api/members/add", data:values, creds:loginState.loginState, method:"post"})
            snackbar.showMessage(
                'Successfully added member!',
            )
			navigate('/app/members');
        } catch (err) {
			snackbar.showMessage(
                "Error: " + err,
            )
            console.error(err)
        }
        
    };

	const handleChange = (event) => {
		console.log(event.target.checked)
		console.log(event.target.id)
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
						{taskFields.agentRegistration.texts.map((field) => (
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									label={field.label}
									id={field.id}
									onChange={handleChange}
									required
									value={values.firstName}
									variant="outlined"
								/>
							</Grid>))}

							{taskFields.agentRegistration.checkboxes.map((field) => (
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
