import { useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Avatar,
	Box,
	Button,
	Divider,
	Drawer,
	Hidden,
	List,
	Typography
} from '@material-ui/core';
import {
	AlertCircle as AlertCircleIcon,
	BarChart as BarChartIcon,
	Lock as LockIcon,
	Settings as SettingsIcon,
	ShoppingBag as ShoppingBagIcon,
	User as UserIcon,
	UserPlus as UserPlusIcon,
	Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';
import {LoginContext} from "../myContext"

const items = [
	{
		href: '/app/dashboard',
		icon: BarChartIcon,
		title: 'Dashboard'
	},
	{
		href: '/app/members',
		icon: UserIcon,
		title: 'Members'
	},
	{
		href: '/app/clients',
		icon: UsersIcon,
		title: 'Clients'
	},
	{
		href: '/app/tasks',
		icon: UsersIcon,
		title: 'Tasks'
	},
	{
		href: '/app/leads',
		icon: UsersIcon,
		title: 'Leads'
	},
	{
		href: '/app/quotations',
		icon: UsersIcon,
		title: 'Quotation'
	},
	{
		href: '/app/invoices',
		icon: UsersIcon,
		title: 'Invoices'
	},
	{
		href: '/app/accounts',
		icon: UsersIcon,
		title: 'Accounts'
	},
	{
		href: '/app/settings',
		icon: SettingsIcon,
		title: 'Settings'
	},
	{
		href: '/app/products',
		icon: ShoppingBagIcon,
		title: 'Products'
	},
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
	const location = useLocation();
    const loginContext = useContext(LoginContext)

	useEffect(() => {
		if (openMobile && onMobileClose) {
			onMobileClose();
		}
	}, [location.pathname]);

	const content = (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				height: '100%'
			}}
		>
			<Box
				sx={{
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					p: 2
				}}
			>
				<Typography
					color="textPrimary"
					variant="h5"
				>
					{loginContext.loginState.userName}
				</Typography>
				<Typography
					color="textSecondary"
					variant="body2"
				>
					{loginContext.loginState.designation + ' | ' + loginContext.loginState.department}
				</Typography>
			</Box>
			<Divider />
			<Box sx={{p:2}}>
				<List>
					{items.map((item) => (
						<NavItem
							href={item.href}
							key={item.title}
							title={item.title}
							icon={item.icon}
						/>
					))}
				</List>
			</Box>
			<Box sx={{ flexGrow: 1 }} />
		</Box>
	);

	return (
		<>
			<Hidden lgUp>
				<Drawer
					anchor="left"
					onClose={onMobileClose}
					open={openMobile}
					variant="temporary"
					PaperProps={{
						sx: {
							width: 256
						}
					}}
				>
					{content}
				</Drawer>
			</Hidden>
			<Hidden lgDown>
				<Drawer
					anchor="left"
					open
					variant="persistent"
					PaperProps={{
						sx: {
							width: 256,
							top: 64,
							height: 'calc(100% - 64px)'
						}
					}}
				>
					{content}
				</Drawer>
			</Hidden>
		</>
	);
};

DashboardSidebar.propTypes = {
	onMobileClose: PropTypes.func,
	openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
	onMobileClose: () => { },
	openMobile: false
};

export default DashboardSidebar;
