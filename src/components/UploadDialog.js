import { useState, useContext, useEffect } from 'react';
import {
	TextField, Button,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions
} from '@material-ui/core';
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../utils/request'
import { LoginContext, LoadingContext } from "../myContext"


export default function UploadDialog({ open, setOpen, section, title, loadData }) {
	const snackbar = useSnackbar();
	const loginState = useContext(LoginContext);
	const {loading, setLoading} = useContext(LoadingContext)

	const [values, setValues] = useState({});
	const [submitState, setSubmitState] = useState({text:'Submit', disabled:false});

	const handleSubmit = async () => {
		try {
			// validateForm()
			setLoading({...loading, isActive:true})
			setSubmitState({text:'Uploading...', disabled:true})

			await authorizedReq({
				route:`/api/${section}/fileupload`, 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			if (loadData)
				loadData()

			snackbar.showMessage(
				`Successfully uploaded file`,
			)
			setOpen(false);
		} catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err),
			)
			console.error(err)
		}
		setSubmitState({text:'Submit', disabled:false})
		setLoading({...loading, isActive:false})
		
	};

	const handleChange = async (event) => {
		let others = {}
		if (event.target.id == section+'File') {
			// console.log(event.target.files.length)
			others = {docs:[]}

			let allFiles = []
			let len = (event.target.files.length)
			let filesClone = Object.assign(Object.create(Object.getPrototypeOf(event.target.files)), event.target.files)
			// console.log(filesClone)
			for (let i=0; i < len; i++)
				allFiles.push(filesClone[i])

			// console.log(allFiles)
			for (let i=0; i < len; i++) {
				let file = allFiles[i]
				let fileData = file
	
				fileData = new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => {
					const base64String = reader.result
						.replace("data:", "")
						.replace(/^.+,/, "");
				
					resolve(base64String)
					// console.log(base64String);
					};
					reader.readAsDataURL(fileData);
				})
	
				fileData = await fileData
				// console.log(file.name, others.docs.length, len, i)
	
				others.docs.push({name:file.name, data:fileData})
			}
			// event.target.files = allFiles
			console.log(event.target.files, allFiles)
			event.target.id = "ignore"
				
		}

        // console.debug(others)

		setValues({
			...values,
			...others,
			[event.target.id]: event.target.value
		});
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
					
				<DialogTitle id="form-dialog-title">Upload {title} File</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
                        <Grid item md={12} xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={values[section + 'File']}
                                type="file"
                                variant="outlined"
                                id={section+'File'}
                                inputProps={{
                                    accept: ".csv" // Accepts only CSV files
                                }}
                            >
                            </TextField>
                        </Grid>
					</Grid>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={submitState.disabled} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={submitState.disabled} color="primary">
						{submitState.text}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
