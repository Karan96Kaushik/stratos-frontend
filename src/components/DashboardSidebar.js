import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Box,
	Divider,
	Drawer,
	Hidden,
	List,
	Typography
} from '@material-ui/core';
import {
	BarChart as BarChartIcon,
	CheckSquare as CheckSquareIcon,
	Flag as FlagIcon,
	Mail as MailIcon,
	FileText as FileTextIcon,
	DollarSign as DollarSignIcon,
	Package as PackageIcon,
	CheckCircle as CheckCircleIcon,
	User as UserIcon,
	Users as UsersIcon,
	Calendar,
	File,
	Send,
	AlertCircle,
	Archive,
	Layout,
	Link as LinkIcon,
	Clipboard,
	PenTool,
	Settings as SettingsIcon
} from 'react-feather';
import NavItem from './NavItem';
import { selectUser } from 'src/store/reducers/userSlice';
import { useSelector } from 'react-redux';
import { LoginContext } from 'src/myContext';

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
		href: '#',
		icon: UsersIcon,
		title: 'Clients'
	},
	{
		href: '/app/clients',
		icon: File,
		isSub: true,
		title: 'Details'
	},
	{
		href: '/app/clientaccounts',
		icon: PenTool,
		isSub: true,
		title: 'Accounts'
	},
	{
		href: '#',
		icon: CheckSquareIcon,
		title: 'Tasks'
	},
	{
		href: '/app/tasks',
		icon: File,
		isSub: true,
		title: 'Details'
	},
	{
		href: '/app/taskaccounts',
		icon: PenTool,
		isSub: true,
		title: 'Accounts'
	},
	{
		href: '#',
		icon: PackageIcon,
		title: 'Packages'
	},
	{
		href: '/app/packages',
		icon: File,
		isSub: true,
		title: 'Details'
	},
	{
		href: '/app/package/services',
		icon: CheckCircleIcon,
		isSub: true,
		title: 'Services'
	},
	{
		href: '/app/package/accounts',
		icon: PenTool,
		isSub: true,
		title: 'Accounts'
	},
	{
		href: '#',
		icon: PackageIcon,
		title: 'Procurements'
	},
	{
		href: '/app/procurement',
		icon: File,
		isSub: true,
		title: 'Details'
	},
	{
		href: '/app/procurement/pending-approvals',
		icon: CheckSquareIcon,
		isSub: true,
		title: 'Approvals'
	},
	{
		href: '/app/calendar',
		icon: Calendar,
		// isSub: true,
		title: 'Hearing Dates'
	},
	{
		href: '/app/meetingcal',
		icon: Layout,
		// isSub: true,
		title: 'Meeting Calendar'
	},
	{
		href: '/app/tickets',
		icon: AlertCircle,
		title: 'Tickets'
	},
	{
		href: '/app/leads',
		icon: FlagIcon,
		title: 'Leads'
	},
	{
		href: '#',
		icon: Send,
		title: 'Sales'
	},
	{
		href: '/app/sales',
		icon: File,
		isSub: true,
		title: 'Details'
	},
	{
		href: '/app/sales/accounts',
		icon: PenTool,
		isSub: true,
		title: 'Accounts'
	},
	{
		href: '/app/sales/payments',
		icon: DollarSignIcon,
		isSub: true,
		title: 'Payments'
	},
	{
		href: '/app/ccreceived',
		icon: Archive,
		title: 'CC Received'
	},
	{
		href: '/app/quotations',
		icon: MailIcon,
		title: 'Quotations'
	},
	{
		href: '/app/invoices',
		icon: FileTextIcon,
		title: 'Invoices'
	},
	{
		href: '/app/payments',
		icon: DollarSignIcon,
		title: 'Payments'
	},
	{
		href: '/app/rerainstruction',
		icon: LinkIcon,
		title: 'Rera Access'
	},
	{
		href: '/app/adminsettings',
		icon: SettingsIcon,
		title: 'Admin Settings'
	},
	// {
	// 	href: '/app/settings',
	// 	icon: SettingsIcon,
	// 	title: 'Settings'
	// },
	// {
	// 	href: '/app/products',
	// 	icon: ShoppingBagIcon,
	// 	title: 'Products'
	// },
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
	const location = useLocation();
	// const user = useSelector(selectUser)
	const loginState = useContext(LoginContext)
	const user = loginState.loginState
	
	let unread = user.unread ?? 0
	if (unread < 0) unread = 0

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
					{user.userName}
				</Typography>
				<Typography
					color="textSecondary"
					variant="body1"
				>
					{user.designation}
				</Typography>
				<Typography
					color="textSecondary"
					variant="body2"
				>
					{user.department}
				</Typography>
			</Box>
			<Divider />
			<Box sx={{p:2}}>
				<List>
					{items.map((item) => (
						<NavItem
							style={{
								left: item.isSub ? 20 : 0
							}}
							href={item.href == '#' ? undefined : item.href}
							onClick={item.onClick ?? (() => {console.debug(item.href)})}
							key={item.title}
							title={item.title + ((item.title == "Tickets" && unread > 0) ? ` (${unread})` : '')}
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
							width: 195,
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
