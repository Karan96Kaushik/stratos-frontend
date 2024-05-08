import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import PersonalCalendar from 'src/components/PersonalCalendar';
import { useRef, useEffect, useState, useContext } from 'react';
import { LoadingContext, LoginContext } from "../myContext"
import { authorizedReq, authorizedDownload } from '../utils/request'
import { useSnackbar } from 'material-ui-snackbar-provider'

const getColor = (status) => {
    let color = undefined
    let eventColor = undefined
    if (status == 0) {
        color = "#fbbc04"
        eventColor = "#000000"
    } 
    else if (status == 3) {
        color = "#cb483f"
        eventColor = "#000000"
    }
    return [color, eventColor]
}

const Calendar = () => {

	const [events, setEvents] = useState([])
    const {loading, setLoading} = useContext(LoadingContext)
	const loginState = useContext(LoginContext)
	const snackbar = useSnackbar()

    useEffect(async () => {
		try {
			setLoading({...loading, isActive:true})

		  	let response = await authorizedReq({
				route: "/api/calendar", 
				creds: loginState.loginState, 
				// data:{...others}, 
				method: 'get'
			})
			
			if (!response.length)
				return
			
			response = response.map(t => ({
				title: t.title, 
				date: t.meetingDate, 
				interactive:true,
                color: getColor(t.meetingStatus)[0],
                textColor: getColor(t.meetingStatus)[1],
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
				<title>Personal Calendar</title>
			</Helmet>
			<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
				<Container maxWidth="xl">
					<PersonalCalendar setEvents={setEvents} events={events}/>
				</Container>
			</Box>
		</>
	)
};

export default Calendar;
