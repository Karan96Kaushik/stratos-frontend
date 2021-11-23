import { useState, useContext, useEffect } from 'react';
import {
	Box, Button, Card, CardContent,
	CardHeader, Divider, Grid, TextField,
	Link, List, ListItem, Typography, makeStyles, 
	Autocomplete, FormControlLabel, Checkbox,
	FormControl
} from '@material-ui/core';
import { LoginContext } from "../../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { useNavigate, useLocation } from 'react-router-dom';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import packageFields, { services, yearlyServices } from '../../statics/packageFields';
import PasswordDialog from '../passwordDialog';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
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

function useQuery() {
	let entries =  new URLSearchParams(useLocation().search);
	const result = {}
	for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

const PackageAddForm = (props) => {
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const loginState = useContext(LoginContext)

	const [values, setValues] = useState({});
	
    let isEdit = true;

    let packageID = location.pathname.split("/").pop()
    useEffect(async () => {
        let data = await authorizedReq({route:"/api/packages?service=true", data:{_id:packageID}, creds:loginState.loginState, method:"get"})

        setValues(data)
    }, [])

	const handleSubmit = async () => {
		try {
			await authorizedReq({
				route:"/api/packages/update", 
				data:values, 
				creds:loginState.loginState, 
				method:"post"
			})
			snackbar.showMessage(
				`Successfully ${!isEdit ? "added" : "updated"} package!`,
			)
			navigate(-1);
		} catch (err) {
			snackbar.showMessage(
				(err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}

	};

	const handleChange = async (event) => {
		let others = {}

        if(event.target.id.includes('$')) {
            const [service, date] = event.target.id.split('$') 
            others.completed = values.completed ?? {}
            if (!others.completed[service])
                others.completed[service] = []
			if(event.target.checked)
	            others.completed[service].push(date)
			else {
				const index = others.completed[service].indexOf(date)
				others.completed[service].splice(index, 1)
			}

            return setValues({
                ...values,
                ...others
            }); 
            
        }

		setValues({
			...values,
			...others,
			[event.target.id]: event.target.type != 'checkbox' ? event.target.value : event.target.checked
		});

	};

	return (
		<form {...props} autoComplete="off" noValidate >
			<Card>
				<CardHeader
					title="Package Services"
					subheader=""
				/>
				<Divider />
				<CardContent>
					<Grid container spacing={3}>

						{services.map((s) => values?.[s] && (
                            <Grid item md={12} xs={12}>
				            	<Grid container spacing={3}>
                                    <Grid item md={12} xs={12}>
                                        <Typography variant='h5'>{s}</Typography>
                                    </Grid>

                                    {(values?.[s] ?? []).map(period => (
                                        <Grid item md={4} xs={6}>
                                            <FormControlLabel
                                                control={<Checkbox
                                                    checked={(values?.completed?.[s] ?? []).includes(period.date)}
                                                    onChange={handleChange}
                                                    id={s + '$' + period.date}
                                                    color="primary"
                                                />}
                                                label={moment(new Date(period.date)).format('MMM-YY')}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ))}

						{yearlyServices.map((s) => values?.[s] && (
                            <Grid item md={12} xs={12}>
				            	<Grid container spacing={3}>
                                    <Grid item md={12} xs={12}>
                                        <Typography variant='h5'>{s}</Typography>
                                    </Grid>

                                    {(values?.[s] ?? []).map(period => (
                                        <Grid item md={4} xs={6}>
                                            <FormControlLabel
                                                control={<Checkbox
                                                    checked={(values?.completed?.[s] ?? []).includes(period.date)}
                                                    onChange={handleChange}
                                                    id={s + '$' + period.date}
                                                    color="primary"
                                                />}
                                                label={moment(new Date(period.date)).format('MMM-YY')}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        ))}
						
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
						Save details
					</Button>
				</Box>
			</Card>
		</form>
	);
};

export default PackageAddForm;
