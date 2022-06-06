import {Helmet} from 'react-helmet';
import {Box, Container, Grid} from '@material-ui/core';
import HearingDateCalendar from 'src/components/HearingDateCalendar';
import {useRef, useEffect, useState, useContext} from 'react';
import { LoadingContext, LoginContext } from "../myContext"
import {authorizedReq, authorizedDownload} from '../utils/request'

const Calendar = () => {

	const [events, setEvents] = useState([])
    const {loading, setLoading} = useContext(LoadingContext)
	const loginState = useContext(LoginContext)
	console.log(events, "KSAJKJHSAJKAHS")
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
				title: t.taskID, 
				date: t.hearingDate, 
				interactive:true,
				url:'/app/tasks?text=' + t.taskID
			}))
			
			setEvents(response)
		
		}
		catch (err) {
			console.info(err)
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
