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
import leadFields from '../../statics/leadFields';
import taskFields from "../../statics/taskFields"
import PasswordDialog from '../passwordDialog';
import { selectMembers } from 'src/store/reducers/membersSlice';
import { messengerFields } from 'src/statics/ticketFields';

let services = Object.keys(taskFields).map(a => (taskFields[a].name))
// let services = Object.keys(taskFields).map(a => ([a, taskFields[a].name]))
// services.unshift("")
services.push('Consultation', 'Package A', 'Package B', 'Package C', 'Package D', 'General')

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft:20,
        paddingRight:20,
        marginTop:20,
        marginBottom:20,
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
	noLabel: {
		marginTop: theme.spacing(3)
	}
}));

const TicketMessenger = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)
	const classes = useStyles();
	
	const [memberRows, setMemberRows] = useState([{userName:"", memberID:"", _id:""}]);
	const [memberPlaceholder, setMemberPlaceholder] = useState({userName:"", memberID:"", _id:""});

	const [values, setValues] = useState({});
	const [type, setType] = useState("");
	
    let isEdit = false;

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

	const getMembers = async () => {
		try {
			let response = await authorizedReq({ route: "/api/members/list", creds: loginState.loginState, data: {}, method: 'get' })
			const memberSet = [...new Set(response.map(m => m.department))]
			let membersData = []
			memberSet.forEach(dep => {
				membersData.push({isDept: true, userName: dep + " Department", memberID: "Dept."})
				membersData.push(...response.filter(m => m.department == dep))
			})

			setMemberRows(membersData)
			return response

		} catch (err) {
			snackbar.showMessage(
				"Error getting members - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
		// response = response.map(val => ({id: val._id, label: (val.clientID ?? val.name) + ` (${val._id})`}))
	};

	useEffect(async () => {
		let members = await getMembers()
		if (isEdit) {
			let leadID = location.pathname.split("/").pop()
			let data = await authorizedReq({route:"/api/leads/", data:{_id:leadID}, creds:loginState.loginState, method:"get"})

			members = members.find(val => String(val._id) == String(data._memberID))
			if(members)
				setMemberPlaceholder(members)
			// setPlaceholder({ client:{ name: data.clientName, clientID: data.clientID }})
			setType(data.leadType)
			if (typeof data._membersAssigned == 'string')
				data._membersAssigned = JSON.parse(data._membersAssigned)
			setValues(data)
		}
	}, [])

	if (location.pathname.includes("edit")) {
		isEdit = true
		let leadID = location.pathname.split("/").pop()
		useEffect(async () => {
			let data = await authorizedReq({route:"/api/leads/", data:{_id:leadID}, creds:loginState.loginState, method:"get"})
			setType(data.leadType)
			setValues(data)
		}, [])
	}

	const handleSubmit = async () => {
		try {
			validateForm()
			await authorizedReq({
				route:"/api/leads/" + (!isEdit ? "add" : "update"), 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} lead!`,
			)
			navigate('/app/leads');
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const [open, setOpen] = useState(false)
	const tryDelete = () => {
		setOpen(true)
	}

	const handleDelete = async (password) => {

		try {
			let taskID = location.pathname.split("/").pop()
			await authorizedReq({
				route:"/api/leads/", 
				data:{_id:taskID, password}, 
				creds:loginState.loginState, 
				method:"delete"
			})
			snackbar.showMessage(
				`Successfully deleted lead!`,
			)
			navigate('/app/leads');
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

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

		if (event.target.id == 'leadType') {
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

    const messages = [
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjh askjhasjkhajkshajksh ajkhsjkahskjahsjkah skjahsjka hskajshkaj hskajhsj kahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjhask jhasjkhajks hajkshajkhsjkah skjahsjka hskjahsjkahskajs hkajhskaj hsjkahs"},
        {'memberName': "Karan Kaushik", date:'12 Sep 2013', 'message': "hia aksja sja ghhjkasgkajhskjahsk  ahsahshhhkjlashajk shjkas hkahskjahsklja hsjk ahsjhask jhasjkhajkshaj kshajkhsj kahskjahsjkahsk jahsjkah skajshkaj hskajhsj kahs"},
    ]

	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
					title={"Messages"}
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid className={classes.root} container spacing={3}>


                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>

                            <TableHead>
                                <TableRow>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                    {messages && messages?.map(message => (
                                        <>
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{message.memberName}</Typography></TableCell>
                                            <TableCell align="right">{message.date}</TableCell>
                                        </TableRow>   
                                        <TableRow>
                                            {/* <TableCell align="left"><Typography variant="h5">{message.memberName}</Typography></TableCell> */}
                                            <TableCell align="left" colSpan={2}>{message.message}</TableCell>
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

                    
                    <Grid item md={12} xs={12}>
                        <TextField 
                            multiline
                            fullWidth
                            id="message"
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
                                InputLabelProps={{ shrink: (field.type == "date" || field.type == "file" || isEdit) ? true : undefined }}
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
							{isEdit && values?.files && <List>
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
