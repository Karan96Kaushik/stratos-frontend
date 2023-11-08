import {useState, useContext, useEffect, useRef} from 'react'
import * as React from 'react'
import {Link as RouterLink} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
	AppBar, Badge,	Box, Popover,
	Hidden,	IconButton,	Toolbar, Typography
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import InputIcon from '@material-ui/icons/Input'
import Logo from './Logo'
import NotificationList from './NotificationList.js'
import {LoginContext} from '../myContext'
import { authorizedReq } from 'src/utils/request'
import { useSnackbar } from 'material-ui-snackbar-provider'

const DashboardNavbar = ({
	onMobileNavOpen,
	...rest
}) => {

	const snackbar = useSnackbar();

	const loginState = useContext(LoginContext)
	const [notifications, setNotif] = useState([])
	const [unread, setUnread] = useState({count:0, lastRead:new Date(loginState.loginState?.lastReadTime ?? 0)})
	const unreadRef = useRef(unread);
	const notificationsRef = useRef(notifications.length);
	
	useEffect(() => {
		unreadRef.current = unread; // Keep the latest value in the ref
		notificationsRef.current = notifications.length; // Keep the latest value in the ref
	}, [notifications]);

	const [anchorEl, setAnchorEl] = useState(null)
	const [open, setOpen] = useState(false)

	const handleClick = async (event) => {
	  setAnchorEl(event.currentTarget)
	  setOpen(true)
	}
  
	const handleClose = async () => {
	  setAnchorEl(null)
	  setOpen(false)
	  await localStorage.setItem("tmsStore", JSON.stringify({...loginState.loginState, lastReadTime: (new Date()).toISOString()}))
	  setUnread({lastRead:(new Date()).toISOString(), count:0})
	}

	const getNotifications = async () => {
		try {
			if(!loginState.loginState.isLoggedIn)
				return
			let res = await authorizedReq({
				route:"/api/notifications",
				data: {mid: loginState.loginState._id, useCached: notificationsRef.current != 0},
				creds:loginState.loginState, 
				method:"get"
			})
			if (res.notifications.length) {
				let unread = unreadRef.current
				const lastReadTime = new Date(unread.lastRead || 0)
				const unreadLength = res.notifications.filter(n => new Date(n.createdTime) > lastReadTime).length
				
				setUnread({...unread, count:unreadLength})
				setNotif(res.notifications)
			}
		}
		catch (err) {
			console.error(err)
			snackbar.showMessage(
				String("Error getting notifications"),
			)
		}
	}

	const handleLogout = () => {
		loginState.setLogin({isLoggedIn:false})
		localStorage.setItem("tmsStore", JSON.stringify({isLoggedIn:false, lastReadTime: (new Date()).toISOString()}))
	}

	useEffect(async () => {
			getNotifications()
			setInterval(getNotifications, 20000)
	}, [])

	return (
		<AppBar elevation={0}
			{...rest}>
			<Toolbar>
				<RouterLink to="/">
					<Logo style={{ height: 40, width: 40 }}/>
				</RouterLink>
				<Box sx={
					{flexGrow: 1}
				}/>
				<Hidden lgDown>
					<IconButton color="inherit" onClick={handleClick}>
						<Badge badgeContent={unread.count}
							color="secondary"
							variant="standard">
							<NotificationsIcon/>
						</Badge>
					</IconButton>
					<IconButton color="inherit" onClick={handleLogout}>
						<InputIcon/>
					</IconButton>
				</Hidden>
				<Hidden lgUp>
					<IconButton color="inherit"
						onClick={onMobileNavOpen}>
						<MenuIcon/>
					</IconButton>
				</Hidden>
			</Toolbar>
			<Popover
				// id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}>
					{/* hello */}
				<NotificationList
					notifications={notifications}
					// onSelect={this.handleCloseNotifications}
				/>
			</Popover>
		</AppBar>
	)
}

DashboardNavbar.propTypes = {
	onMobileNavOpen: PropTypes.func
}

export default DashboardNavbar
