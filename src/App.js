import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { LoginContext, LoadingContext } from "./myContext"
import React, { useState, useEffect } from 'react';
import { SnackbarProvider } from 'material-ui-snackbar-provider'
import LoadingOverlay from 'react-loading-overlay';
import { authorizedLogin } from './utils/request';
import { useDispatch } from "react-redux";
import {
	setMembersService
} from "./store/reducers/membersSlice";
import {
	updateUser
} from "./store/reducers/userSlice";

const App = () => {

	let dataStore;
	dataStore = JSON.parse(localStorage.getItem("tmsStore"))
	if(!dataStore) {
		dataStore = { isLoggedIn: false }
		localStorage.setItem("tmsStore", JSON.stringify(dataStore))
	}
	var [loginState, setLogin] = useState(dataStore)
	var [loading, setLoading] = useState({
		isActive:false,
		text: ""
	})
	const dispatch = useDispatch()

	useEffect(() => {
		if(loginState?.isLoggedIn) {
			dispatch(setMembersService(loginState))
			dispatch(updateUser(loginState))
		}
	}, [])

	const routing = useRoutes(routes(loginState?.isLoggedIn));

	return (
		<SnackbarProvider SnackbarProps={{ autoHideDuration: 2000 }}>
		<LoginContext.Provider value={{ loginState, setLogin }}>
		<LoadingContext.Provider value={{ loading, setLoading }}>
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				<LoadingOverlay
					active={loading.isActive}
					spinner
					styles={{
						overlay: (base) => ({
						  ...base,
						//   background: 'rgba(255, 0, 0, 0.5)'
						})
					  }}
					text={loading.text}
				>
					{routing}
				</LoadingOverlay>
			</ThemeProvider>
		</LoadingContext.Provider>
		</LoginContext.Provider>
		</SnackbarProvider>
	);
};

export default App;
