import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import MeetingCalendar from 'src/components/MeetingCalendar';
import { useRef, useEffect, useState, useContext } from 'react';
import { LoadingContext, LoginContext } from "../myContext"
import { authorizedReq, authorizedDownload } from '../utils/request'
import { useSnackbar } from 'material-ui-snackbar-provider'

const getColor = (status) => {
    let color = undefined
    let eventColor = undefined
    if (!status) {
        color = "#fbbc04" // Pending
        eventColor = "#000000"
    } 
    else if (status == 3) {
        color = "#cb483f" // Disapproved
        eventColor = "#000000"
    } 
    else if (status == 99) {
        color = "#f4f6f8" // Follow Up
        eventColor = "#000000"
    }
    return [color, eventColor]
}

const Calendar = () => {

	const [events, setEvents] = useState([])
    const {loading, setLoading} = useContext(LoadingContext)
	const loginState = useContext(LoginContext)
	const snackbar = useSnackbar()

	const handleExport = async (password) => {
		try {
			await authorizedDownload({
				route: "/api/calendar/export", 
				creds: loginState.loginState, 
				data:{password}, 
				method: 'post',
				password
			}, "meetingsExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
	}

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
				<title>Meeting Calendar</title>
			</Helmet>
			<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
				<Container maxWidth="xl">
					<MeetingCalendar handleExport={handleExport} setEvents={setEvents} events={events}/>
				</Container>
			</Box>
		</>
	)
};

export default Calendar;
