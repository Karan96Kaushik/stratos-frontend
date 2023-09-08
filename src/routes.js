import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import MembersAdd from 'src/pages/MembersAdd';
import MembersList from 'src/pages/MembersListPage';
import TasksList from 'src/pages/TaskListPage2';
import TasksAdd from 'src/pages/TasksAdd';
import TicketAdd from 'src/pages/TicketAdd';
import LeadsAdd from 'src/pages/LeadsAdd';
import LeadsListPage from 'src/pages/LeadsListPage';
import InvoiceListPage from 'src/pages/InvoiceListPage';
import InvoiceAdd from 'src/pages/InvoiceAdd';
import QuotationListPage from 'src/pages/QuotationListPage';
import QuotationAdd from 'src/pages/QuotationAdd';
import PaymentsListPage from 'src/pages/PaymentsListPage';
import TaskPaymentsListPage from 'src/pages/TaskPaymentsListPage';
import ClientPaymentsListPage from 'src/pages/ClientPaymentsListPage';
import TaskPaymentsAddPage from 'src/pages/TaskPaymentsAddPage';
import PaymentsAdd from 'src/pages/PaymentsAdd';
import ClientList from 'src/pages/ClientListPage2';
import ClientAdd from 'src/pages/ClientAdd';
import PackagesListPage from 'src/pages/PackagesListPage';
import PackagesAdd from 'src/pages/PackagesAddPage';
import PackageAccountsListPage from 'src/pages/PackageAccountsListPage';
// import PackageAccountsAdd from 'src/pages/PackagesAddPage';
import PackageServicesListPage from 'src/pages/PackageServicesListPage';
import PackageServicesUpdate from 'src/pages/PackageServicesUpdatePage';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import ProductList from 'src/pages/ProductList';
import Register from 'src/pages/Register';
import Settings from 'src/pages/Settings';
import Calendar from 'src/pages/Calendar';

const routes = (isLoggedIn) => [
	{
		path: 'app',
		element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
		children: [
			{ path: 'account', element: <Account /> },
			{ path: 'dashboard', element: <Dashboard /> },
			{ path: 'products', element: <ProductList /> },
			{ path: 'settings', element: <Settings /> },
			{ path: 'calendar', element: <Calendar /> },
			{
				path: 'clients',
				children: [
					{ path: '/', element: <ClientList /> },
					{ path: 'add', element: <ClientAdd /> },
					{ path: 'edit/:id', element: <ClientAdd /> }
				]
			},
			{
				path: 'members',
				children: [
					{ path: '/', element: <MembersList /> },
					{ path: 'add', element: <MembersAdd /> },
					{ path: 'edit/:id', element: <MembersAdd /> }
				]
			},
			{
				path: 'tasks',
				children: [
					{ path: '/', element: <TasksList /> },
					{ path: 'add', element: <TasksAdd /> },
					{ path: 'edit/:id', element: <TasksAdd /> },
				]
			},
			{
				path: 'tickets',
				children: [
					{ path: '/', element: <TasksList /> },
					{ path: 'add', element: <TicketAdd /> },
					{ path: 'edit/:id', element: <TicketAdd /> },
				]
			},
			{
				path: 'leads',
				children: [
					{ path: '/', element: <LeadsListPage /> },
					{ path: 'add', element: <LeadsAdd /> },
					{ path: 'edit/:id', element: <LeadsAdd /> },
				]
			},
			{
				path: 'invoices',
				children: [
					{ path: '/', element: <InvoiceListPage /> },
					{ path: 'add', element: <InvoiceAdd /> },
					{ path: 'edit/:id', element: <InvoiceAdd /> },
				]
			},
			{
				path: 'quotations',
				children: [
					{ path: '/', element: <QuotationListPage /> },
					{ path: 'add', element: <QuotationAdd /> },
					{ path: 'edit/:id', element: <QuotationAdd /> },
				]
			},
			{
				path: 'payments',
				children: [
					{ path: '/', element: <PaymentsListPage /> },
					{ path: 'add', element: <PaymentsAdd /> },
					{ path: 'edit/:id', element: <PaymentsAdd /> },
				]
			},
			{
				path: 'taskaccounts',
				children: [
					{ path: '/', element: <TaskPaymentsListPage /> },
					{ path: 'edit/:id', element: <TaskPaymentsAddPage /> },
				]
			},
			{
				path: 'clientaccounts',
				children: [
					{ path: '/', element: <ClientPaymentsListPage /> },
				]
			},
			{
				path: 'packages',
				children: [
					{ path: '/', element: <PackagesListPage /> },
					{ path: 'add', element: <PackagesAdd /> },
					{ path: 'edit/:id', element: <PackagesAdd /> },
				]
			},
			{
				path: 'package/services',
				children: [
					{ path: '/', element: <PackageServicesListPage /> },
					{ path: 'add', element: <PackageServicesUpdate /> },
					{ path: 'edit/:id', element: <PackageServicesUpdate /> },
				]
			},
			{
				path: 'package/accounts',
				children: [
					{ path: '/', element: <PackageAccountsListPage /> },
					// { path: 'add', element: <PackageAccountsAdd /> },
					{ path: 'edit/:id', element: <PackagesAdd /> },
				]
			},
			{ path: '*', element: <Navigate to="/404" /> }
		]
	},
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ path: 'login', element: isLoggedIn ? <Navigate to="/" /> : <Login /> },
			{ path: 'register', element: <Register /> },
			{ path: '404', element: <NotFound /> },
			{ path: '/', element: <Navigate to="/app/dashboard" /> },
			{ path: '*', element: <Navigate to="/404" /> }
		]
	}
];

export default routes;
