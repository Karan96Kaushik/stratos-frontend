import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import MembersAdd from 'src/pages/MembersAdd';
import MembersList from 'src/pages/MembersList';
import TasksList from 'src/pages/TasksList';
import TasksAdd from 'src/pages/TasksAdd';
import CustomerList from 'src/pages/CustomerList';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import ProductList from 'src/pages/ProductList';
import Register from 'src/pages/Register';
import Settings from 'src/pages/Settings';

const routes = (isLoggedIn) => [
	{
		path: 'app',
		element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
		children: [
			{ path: 'account', element: <Account /> },
			{ path: 'clients', element: <CustomerList /> },
			{ path: 'leads', element: <CustomerList /> },
			{ path: 'dashboard', element: <Dashboard /> },
			{ path: 'products', element: <ProductList /> },
			{ path: 'settings', element: <Settings /> },
			{
				path: 'members',
				children: [
					{ path: '/', element: <MembersList /> },
					{ path: 'add', element: <MembersAdd /> }
				]
			},
			{
				path: 'tasks',
				children: [
					{ path: '/', element: <TasksList /> },
					{ path: 'add', element: <TasksAdd /> }
				]
			},
			{ path: '*', element: <Navigate to="/404" /> }
		]
	},
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ path: 'login', element: <Login /> },
			{ path: 'register', element: <Register /> },
			{ path: '404', element: <NotFound /> },
			{ path: '/', element: <Navigate to="/app/dashboard" /> },
			{ path: '*', element: <Navigate to="/404" /> }
		]
	}
];

export default routes;
