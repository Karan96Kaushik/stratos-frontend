import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Checkbox, FormControlLabel, Link, List, 
	Select, FormControl, makeStyles, ListItem, Typography,
	InputLabel, Input, MenuItem, ListItemText,
    TableContainer, TableBody, TableRow, Paper, Table,
    TableHead, TableCell, TableFooter
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate } from 'react-router-dom';
import ticketFields from '../../statics/ticketFields';
import taskFields from "../../statics/taskFields"
import PasswordDialog from '../passwordDialog';
import { useSelector } from "react-redux";
import { selectMembers } from 'src/store/reducers/membersSlice';
import { messengerFields } from 'src/statics/ticketFields';

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
// services.unshift("")
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D', 'General')

const useStyles = makeStyles((theme) => ({
    root: {
        // paddingLeft:20,
        // paddingRight:20,
        // marginTop:20,
        // marginBottom:20,
	},
	formControl: {
		margin: theme.spacing(1)
	},
	chips: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	chip: {
		margin: 2
	},
	header: {

        // paddingLeft:20,
        // paddingRight:20,
        marginTop:10,
        // marginBottom:10,
		// padding: 40
	},
	noLabel: {
		marginTop: theme.spacing(3)
	},
	messageRow: {
        // borderBottom:'none',
        border:0,
        // 'border-bottom':'none'
	},
}));

const TicketMessenger = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();
	
	const memberRows = useSelector(selectMembers)
	
    console.log(memberRows)
	
	const [values, setValues] = useState({});
	const [messages, setMessages] = useState([]);
	
    let isUpdate = false;

	if (location.pathname.includes("edit"))
		isUpdate = true

	const [errors, setErrors] = useState({});
	const validateForm = () => {
		let errFields = []
		let foundErrs = {}
		let errorFlag = false

		if(!Object.keys(values).length)
			throw new Error("Incomplete Form")

		messengerFields.texts.map(field => {
			let isInvalid = false

			if(field.isRequired && !values[field.id])
				isInvalid = true
			else if ((
				(field.validation ?? [])
					.map(validator => validator(values[field.id]))
					.find(v => v)
			))
				isInvalid = true
				
			if(isInvalid) {
				errFields.push(field.label)
				foundErrs[field.id] = true
				errorFlag = true
			}
			
		})
		setErrors(foundErrs)
		if(errorFlag)
		throw new Error(errFields.join(", "))
	}

	let _ticketID = location.pathname.split("/").pop()

	const getTickets = async () => {

		let data = await authorizedReq({route:"/api/messages/", data:{_ticketID}, creds:loginState.loginState, method:"get"})
	
		setMessages(data)

        const tableContainer = document.getElementById('myTableContainer');
        if (tableContainer) {
          tableContainer.scrollTop = tableContainer.scrollHeight;
        }
	}

	useEffect(async () => {
		if (isUpdate) 
			getTickets()
	}, [])

	const handleSubmit = async () => {
		try {
			validateForm()
			const res = await authorizedReq({
				route:"/api/messages/add",
				data:{...values, _ticketID},
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isUpdate ? "added" : "updated"} message!`,
			)
			setMessages([...messages, res])
			setValues({message:""})

			const tableContainer = document.getElementById('myTableContainer');
			if (tableContainer) {
			tableContainer.scrollTop = tableContainer.scrollHeight;
			}
			// navigate('/app/tickets');
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const tryDelete = () => {
	}

	const handleChange = async (event) => {
		let others = {}
		if (event.target.id == 'files') {
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
			// console.log(event.target.files, allFiles)
			event.target.id = "ignore"
				
		}

		if (event.target.id == 'ticketType') {
			setType(event.target.value)
		} 
		else if (event.target.id == '_memberID') {
			others.memberName = event.target.name
			others.memberID = event.target.memberID
			// setMemberPlaceholder(memberRows.find(val => String(val.memberID) == String(others.memberID)))
		} 
		else if (event.target.id == '_membersAssigned') {
			let departments = event.target.value.filter(d => d.includes('Department'))
			let departmentNames = departments.map(d => d.split(" Department")[0])
			others.membersAssigned = memberRows.filter(v => (departmentNames.includes(v.department)) || event.target.value.includes(v._id))
			event.target.value = others.membersAssigned.map(v => v._id).concat(departments)
			others.membersAssigned = others.membersAssigned.map(v => v.userName)
			others.membersAssigned = others.membersAssigned.join(", ")
		}

		setValues({
			...values,
			...others,
			[event.target.id ?? event.target.name]: event.target.type != 'checkbox' ? event.target.value : event.target.checked
		});

	};

	const downloadFile = ({target}) => {
		const fileName = target.textContent
		authorizedDownloadLink({
			route:"/api/files", 
			data:{fileName}, 
			creds:loginState.loginState, 
			method:"post"
		}, fileName.split("/")[1])
	}

	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
                    className={classes.header}
					title={"Messages"}
					subheader=""
				/>
				<CardContent>
					<Grid className={classes.root} container spacing={3}>

                    <Grid item md={12} xs={12}>

                    <TableContainer sx={{ maxHeight: 440 }} id="myTableContainer">
                        <Table stickyHeader>

                            <TableHead>
                                <TableRow>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                    {messages && messages?.map(message => (
                                        <>
                                        <TableRow>
                                            <TableCell  style={{ borderBottom: 'none' }} align="left"><Typography variant="h5">{message.memberName}</Typography></TableCell>
                                            <TableCell  style={{ borderBottom: 'none' }} align="right">{message.createdTime}</TableCell>
                                        </TableRow>   
                                        <TableRow>
                                            {/* <TableCell align="left"><Typography variant="h5">{message.memberName}</Typography></TableCell> */}
                                            <TableCell align="left" colSpan={2}>{ message.message.split('\n').map(m => <p>{m}</p>) }</TableCell>
                                        </TableRow>   
                                        </>
                                    ))}
                            </TableBody>

                            <TableFooter>
                                <TableRow>
                                </TableRow>
                            </TableFooter>

                        </Table>
                    </TableContainer>

                    </Grid>

                    <Divider/>

                    <Grid item md={12} xs={12}>
                        <TextField 
                            multiline
                            fullWidth
                            id="message"
							value={values.message}
                            rows={4}
                            label="Message"
                            onChange={handleChange}
                            />
                    </Grid>


                    {messengerFields?.texts.map((field) => (
                        <Grid item md={6} xs={12}>
                            <TextField
                                fullWidth
                                select={field.options?.length}
                                SelectProps={{ native: true }}
                                label={field.label}
                                type={field.type ?? 'text'}
                                inputProps={field.type == "file" ? { multiple: true } : {}}
                                InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isUpdate) ? true : undefined }}
                                id={field.id}
                                required={field.isRequired}
                                error={errors[field.id]}
                                onChange={handleChange}
                                value={field.id != "files" ? values[field.id] ?? '' : undefined}
                                variant="outlined"
                            >
                                {(field.options ?? []).map((option) => (
                                    <option key={option}
                                        value={option}>
                                        {option}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>))}

                    {messengerFields?.checkboxes.map((field) => (
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

						
						<Grid item md={6} xs={12}>
							{isUpdate && values?.files && <List>
									{values?.files?.map((file) => (<ListItem>
										<Link style={{cursor:'pointer', wordBreak:'break-all'}} onClick={downloadFile} file={file}>
											<Typography >{file}</Typography>
										</Link>
										</ListItem>))}
								</List>
							}
						</Grid>
					</Grid>
				</CardContent>
				<Divider />
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
					<Button color="primary" variant="contained" onClick={handleSubmit}>
						Post Message
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default TicketMessenger;
