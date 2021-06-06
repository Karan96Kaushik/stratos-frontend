import { useState, useContext } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Grid,
	TextField
} from '@material-ui/core';
import {LoginContext} from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import {authorizedReq} from '../../utils/request'
import {Link as RouterLink, useNavigate} from 'react-router-dom';

const states = [
	{
	  value: 'alabama',
	  label: 'Alabama'
	},
	{
	  value: 'new-york',
	  label: 'New York'
	},
	{
	  value: 'san-francisco',
	  label: 'San Francisco'
	}
  ];

const fields = [
	{label:"Name", id:"userName"},
	{label:"Email", id:"email"},
	{label:"Password", id:"password"},
	{label:"Mobile", id:"phone"},
	{label:"Designation", id:"designation"},
	{label:"Department", id:"department"},
	{label:"Address", id:"address"},
	{label:"Emergency Contact", id:"emergencyContact"},
	{label:"Blood Group", id:"bloodGroup"},
	{label:"Start Date", id:"startDate"},
]

const MemberAddForm = (props) => {
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
					title="New Member"
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid
						container
						spacing={3}
					>
						{fields.map((field) => (<Grid
								item
								md={6}
								xs={12}
							>
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
						<Grid
							item
							md={6}
							xs={12}
						>
							<TextField
								fullWidth
								label="Select State"
								name="state"
								onChange={handleChange}
								required
								select
								SelectProps={{ native: true }}
								value={values.state}
								variant="outlined"
							>
								{states.map((option) => (
									<option
										key={option.value}
										value={option.value}
									>
										{option.label}
									</option>
								))}
							</TextField>
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
