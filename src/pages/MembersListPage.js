import React from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import MemberListToolbar from 'src/components/members/MemberListToolbar';
import MemberList from 'src/components/members/MemberList';
import {authorizedReq, authorizedDownload} from '../utils/request'
import { LoadingContext, LoginContext } from "../myContext"
import { useSnackbar } from 'material-ui-snackbar-provider'
import {useLocation, useNavigate} from 'react-router-dom'

function useQuery() {
	let entries =  new URLSearchParams(useLocation().search);
	const result = {}
	for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

const serialize = function(obj) {
	var str = [];
	for (var p in obj)
	  if (obj.hasOwnProperty(p)) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	  }
	return str.join("&");
  }

const CustomerList = () => {

	const loginState = React.useContext(LoginContext)
	const {loading, setLoading} = React.useContext(LoadingContext)
    const [rows, setRows] = React.useState([])
	const snackbar = useSnackbar()
	const [search, setSearch] = React.useState({})
	const navigate = useNavigate();

    const loadData = () => {
		setLoading({...loading, isActive:true})
        authorizedReq({ route: "/api/members/search", creds: loginState.loginState, data:{...search}, method: 'get' })
            .then(data => {
				setRows(data)
				setLoading({...loading, isActive:false})
			})
			.catch((err) => {
				setLoading({...loading, isActive:false})
				snackbar.showMessage(
					err?.response?.data ?? err.message ?? err,
				)
			})
    }

	React.useEffect(async () => {
		let queryParams = Object.assign({}, search)
		delete queryParams.filters

		navigate("/app/members?" + serialize(queryParams));
		if(search?.text?.length > 2 || search?.text?.length == 0 || !search?.text)
			goSearch();
	}, [search])

	const goSearch = () => {
		loadData()
    }

	const handleExport = async (password) => {
		try{
			await authorizedDownload({
				route: "/api/members/export", 
				creds: loginState.loginState, 
				data:{...search, password}, 
				method: 'get',
			}, "membersExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
	}

	React.useEffect(() => {
		loadData()
	}, []);
	
	return (<>
		<Helmet>
			<title>Members | TMS</title>
		</Helmet>
		<Box
			sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}
		>
			<Container maxWidth={false}>
				<MemberListToolbar handleExport={handleExport} loadData={loadData} searchInfo={search} setSearch={setSearch} />
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<MemberList rows={rows} />				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
