import React from 'react';
import {
	TextField, Button,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions
} from '@material-ui/core';

export default function FiltersDialog({ search, setSearch, fields, type, commonFilters }) {
	const [values, setValues] = React.useState({})
	const [open, setOpen] = React.useState(false)
	let isEdit = false

	const handleApply = async () => {
		try {
			setOpen(false);
			setSearch({...search, filters: values})
		} catch (err) {
			console.error(err)
		}

	};

	const handleClear = async () => {
		try {
			setOpen(false);
			setValues({});
			setSearch({...search, filters: undefined})
		} catch (err) {
			console.error(err)
		}

	};

	console.log("FILTER", values)

	const handleChange = (e) => {
		let change = {}

		let eSplit = (e.target.id ?? e.target.name).split("-")

		if(eSplit[1]) {
			change[eSplit[0]] = values[eSplit[0]]
			if(!change[eSplit[0]])
				change[eSplit[0]] = []
			change[eSplit[0]][parseInt(eSplit[1])] = e.target.value ?? e.target.checked
		} else {
			change = {[e.target.id ?? e.target.name]: e.target.value ?? e.target.checked}
		}

		setValues({
			...values,
			...change
		});
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Button variant="contained" color="primary" onClick={() => setOpen(true)}>
				Filter
			</Button>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={open} 
				onClose={handleClose} 
				aria-labelledby="form-dialog-title">
					
				<DialogTitle id="form-dialog-title">Filters</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>

					{commonFilters?.texts.map((field) => (field?.options?.length &&
							<>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										select={field.options?.length}
										SelectProps={{ native: true }}
										label={field.label}
										type={field.type ?? 'text'}
										inputProps={field.type == "file" ? { multiple: true } : {}}
										InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
										// required={field.isRequired}
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

						{fields[type]?.texts.map((field) => (field?.options?.length &&
							<>
								<Grid item md={6} xs={12}>
									<TextField
										fullWidth
										select={field.options?.length}
										SelectProps={{ native: true }}
										label={field.label}
										type={field.type ?? 'text'}
										inputProps={field.type == "file" ? { multiple: true } : {}}
										InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
										// required={field.isRequired}
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

						{fields[type]?.texts.map((field) => ('date' == field.type &&
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
										id={field.id + "-1"}
										onChange={handleChange}
										value={field.id != "files" ? values[field.id]?.[1] ?? '' : undefined}
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
										id={field.id + "-0"}
										onChange={handleChange}
										value={field.id != "files" ? values[field.id]?.[0] ?? '' : undefined}
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
					<Button onClick={handleClear} color="primary">
						Clear
					</Button>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleApply} color="primary">
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
