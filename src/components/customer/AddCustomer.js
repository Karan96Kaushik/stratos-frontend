import React from 'react';
import {
    TextField, Button,
    Select, InputLabel, Dialog, DialogTitle, 
    DialogContent, DialogActions, Hidden, Snackbar
} from '@material-ui/core';
import {authorizedReq} from '../../utils/request'
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'

export default function AddCustomer({ loadData }) {
    const [open, setOpen] = React.useState(false);
	const [FormData, setFormData] = React.useState({})
	const loginState = React.useContext(LoginContext)
    const snackbar = useSnackbar()

	const handleSubmit = async () => {
        try {
            await authorizedReq({route:"/api/clients/add", data:FormData, creds:loginState.loginState, method:"post"})
            setOpen(false);
            setFormData({})
            snackbar.showMessage(
                'Successfully added client!',
            )
            loadData()

        } catch (err) {
            console.error(err)
        }
        
    };

	const handleOnchange = (e) => {

		if(typeof e == 'string') {
			setFormData({...FormData, phone:e})
			return
		}

		let changed = {}
		changed[e.target.id] = e.target.value

		setFormData({...FormData, ...changed})
	};	

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button variant="contained" color="primary" onClick={() => setOpen(true)}>
				Add Client
			</Button>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Add Client</DialogTitle>
				<DialogContent>

                    <TextField
                        fullWidth
                        label="Select Client Type"
                        id="clientType"
                        onChange={(value) => handleOnchange(value)}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined"
                    >
						<option value="">Select Client Type</option>
						<option value="project">Project</option>
                        <option value="agent">Agent</option>
                        <option value="litigation">Litigation</option>
                    </TextField>

                    {FormData.clientType == 'project' && 
                    <TextField
						margin="dense"
						label="Plot No"
						id="plotNum"
						value={FormData.plotNum}
						type="text"
						onChange={(value) => handleOnchange(value)}
						fullWidth
					/>}

                    {(FormData.clientType == 'agent' || FormData.clientType == 'litigation') && 
                    <TextField
                        fullWidth
                        label="Select Type"
                        id="type"
                        onChange={(value) => handleOnchange(value)}
                        select
                        SelectProps={{ native: true }}
                        variant="outlined"
                    >
                        <option key="" value="">Select</option>
                        <option key="ind" value="individual">Individual</option>
                        <option key="oth" value="other">Other than Individual</option>
                    </TextField>}

					<TextField
						margin="dense"
						label="Phone"
						id="phone"
						type="number"
						value={FormData.phone}
						onChange={(value) => handleOnchange(value)}
						fullWidth
					/>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Add
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
