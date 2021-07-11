import React from 'react';
import {
    TextField, Button,
    Select, InputLabel, Dialog, DialogTitle, Grid,
    DialogContent, DialogActions, Hidden, Snackbar
} from '@material-ui/core';
import {authorizedReq} from '../utils/request'
import { LoginContext } from "../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { DateRangePicker } from '@material-ui/lab';

export default function FiltersDialog({ search, setSearch, fields }) {
    const [open, setOpen] = React.useState(false);
	const [FormData, setFormData] = React.useState({})
	const [values, setValues] = React.useState({})
	const loginState = React.useContext(LoginContext)
    const snackbar = useSnackbar()
    let isEdit = false

	const handleSubmit = async () => {
        try {
            await authorizedReq({route:"/api/clients/add", data:FormData, creds:loginState.loginState, method:"post"})
            setOpen(false);
            setFormData({})

        } catch (err) {
            console.error(err)
        }
        
    };

	const handleChange = (e) => {

		if(typeof e == 'string') {
			setFormData({...FormData, phone:e})
			return
		}

		let changed = {}
		changed[e.target.id] = e.target.value

		setValues({...values, ...changed})
	};	

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button variant="contained" color="primary" onClick={() => setOpen(true)}>
				Filter Search
			</Button>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Filters</DialogTitle>
				<DialogContent>
                <Grid container spacing={3}>
                    
                {fields['Agent Registration']?.texts.map((field) => ('date' == field.type &&
                            <>
							<Grid item md={6} xs={12}>
								<TextField
									fullWidth
									select={field.options?.length}
									SelectProps={{ native: true }}
									label={field.label + " - Min"}
									type={field.type ?? 'text'}
									inputProps={field.type == "file" ? { multiple: true } : {}}
									InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
									required={field.isRequired}
									id={field.id}
									onChange={handleChange}
									value={field.id != "files" ? values[field.id] ?? '' : undefined}
									variant="outlined"
								>
									{(field.options ?? []).map((option) => (
										<option
											key={option}
											value={option}
										>
											{option}
										</option>
									))}
								</TextField>
							</Grid>
                            <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                select={field.options?.length}
                                SelectProps={{ native: true }}
                                label={field.label + " - Max"}
                                type={field.type ?? 'text'}
                                inputProps={field.type == "file" ? { multiple: true } : {}}
                                InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
                                required={field.isRequired}
                                id={field.id}
                                onChange={handleChange}
                                value={field.id != "files" ? values[field.id] ?? '' : undefined}
                                variant="outlined"
                            >
                                {(field.options ?? []).map((option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        </>))}
                            </Grid>
                            
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
