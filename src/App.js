import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider, useTheme } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import { LoginContext, LoadingContext } from "./myContext"
import React, { Component, useContext, useState, useEffect } from 'react';
import { SnackbarProvider } from 'material-ui-snackbar-provider'
import LoadingOverlay from 'react-loading-overlay';
 

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

	const routing = useRoutes(routes(loginState?.isLoggedIn));

	return (
		<SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
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
