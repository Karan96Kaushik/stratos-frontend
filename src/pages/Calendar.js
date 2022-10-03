import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import HearingDateCalendar from 'src/components/HearingDateCalendar';
import { useRef, useEffect, useState, useContext } from 'react';
import { LoadingContext, LoginContext } from "../myContext"
import { authorizedReq, authorizedDownload } from '../utils/request'
import { useSnackbar } from 'material-ui-snackbar-provider'

const Calendar = () => {

	const [events, setEvents] = useState([])
    const {loading, setLoading} = useContext(LoadingContext)
	const loginState = useContext(LoginContext)
	const snackbar = useSnackbar()

    useEffect(async () => {
		try {
			setLoading({...loading, isActive:true})

		  	let response = await authorizedReq({
				route: "/api/hearingdates", 
				creds: loginState.loginState, 
				// data:{...others}, 
				method: 'get'
			})
			
			if (!response.length)
				return
			
			response = response.map(t => ({
				title: t.title, 
				date: t.hearingDate, 
				interactive:true,
				data: t
			}))
			
			setEvents(response)
		
		}
		catch (err) {
			snackbar.showMessage(
				"Error getting tasks - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
		finally {
			setLoading({...loading, isActive:false})
		}
			
	}, [])
		
	return (
		<>
			<Helmet>
				<title>Calendar</title>
			</Helmet>
			<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
				<Container maxWidth="xl">
					<HearingDateCalendar setEvents={setEvents} events={events}/>
				</Container>
			</Box>
		</>
	)
};

export default Calendar;
