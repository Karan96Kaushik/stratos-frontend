import {useState, useContext} from 'react'
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

const DashboardNavbar = ({
	onMobileNavOpen,
	...rest
}) => {
	const [notifications] = useState([
		{type:'payment', text: 'New payment added', id: 'CP0002'},
		{type:'task', text: 'New task assigned', id: 'CL00020'}
	])
	
	const [anchorEl, setAnchorEl] = useState(null)
	const [open, setOpen] = useState(false)

	const handleClick = (event) => {
	  setAnchorEl(event.currentTarget)
	  setOpen(true)
	}
  
	const handleClose = () => {
	  setAnchorEl(null)
	  setOpen(false)
	}

	const loginState = useContext(LoginContext)

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
						<Badge badgeContent={notifications.length}
							color="primary"
							variant="dot">
							<NotificationsIcon/>
						</Badge>
					</IconButton>
					<IconButton color="inherit" onClick={() => loginState.setLogin({isLoggedIn:false})}>
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
