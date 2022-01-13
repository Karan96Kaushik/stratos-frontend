import {useState, useContext} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	AppBar, Badge,	Box,
	Hidden,	IconButton,	Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Logo from './Logo';
import {LoginContext} from '../myContext'

const DashboardNavbar = ({
	onMobileNavOpen,
	...rest
}) => {
	const [notifications] = useState(["boom", "boom"]);
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
					<IconButton color="inherit">
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
		</AppBar>
	);
};

DashboardNavbar.propTypes = {
	onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
