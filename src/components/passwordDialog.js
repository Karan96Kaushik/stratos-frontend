import React from 'react';
import {
	TextField, Button,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions
} from '@material-ui/core';

export default function PasswordDialog({ handleExport, open, setOpen }) {

    const [value, setValue] = React.useState("")
	const getExport = async () => {
		try {
			setOpen(false);
            handleExport(value)
            setValue("")
		} catch (err) {
			console.error(err)
		}

	};

    const handleChange = (event) => {
		setValue(event.target.value);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={open} 
				onClose={handleClose} 
				aria-labelledby="form-dialog-title">
					
				<DialogTitle id="form-dialog-title">Enter Password</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={value}
                                type="text"
                                variant="outlined"
                            >
                            </TextField>
                        </Grid>
					</Grid>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={getExport} color="primary">
						Export
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}