import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import CCReceivedListToolbar from 'src/components/ccreceived/CCReceivedListToolbar';
import {authorizedReq, authorizedDownload} from '../utils/request'
import {addBlockers, removeBlockers} from '../utils/jsControls'
import { LoginContext, LoadingContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import ccreceivedFields from '../statics/ccreceivedFields';
import GeneralList from '../components/GeneralList'
import ViewDialog from 'src/components/ViewDialog';
import {
	selectFilterFor,
} from "../store/reducers/filtersSlice";
import { useDispatch, useSelector } from "react-redux";
import * as _ from "lodash"
import { selectUser, updateUser } from 'src/store/reducers/userSlice';
import { useHistory } from "react-router-dom";

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

const CCReceivedList = () => {

	const dispatch = useDispatch()
	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)
    const [data, setData] = useState({type: '', rows:[]})
    // const args = useRef({})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const filters = useSelector(selectFilterFor("ccreceived"))
	const user = useSelector(selectUser)

	const ccreceivedFieldsCopy = _.merge({}, ccreceivedFields)

	const query = useQuery();
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25
	// if(!query.salesType)
	// 	query.salesType = 'developer'

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage, ...sortState})


	useEffect(() => {
        removeBlockers()
        // if(query.salesType) {
		loadData()
		// }
	}, [])

	useEffect(async () => {
		setSearch({...search, page, rowsPerPage, ...sortState})
	}, [page, rowsPerPage])

	useEffect(async () => {
		// Don't update Page num to 1 on FIRST RENDER
		if(sortState.sortDir == -1 && sortState.sortID == 'createdTime')
			setSearch({...search, ...sortState})
		// If another sort state is set to neutral (0); revert to default sortState
		else if(!sortState.sortDir)
			setSortState({sortID:'createdTime', sortDir:-1})
		// reset to page 1 when sort state is changed
		else if(page != 1)
			setPage(1)
		// If page is reset to 1, search useEffect will automatically trigger
		else
			setSearch({...search, ...sortState})
	}, [sortState])

	useEffect(async () => {
		let queryParams = Object.assign({}, search)
		delete queryParams.filters
		navigate("/app/ccreceived?" + serialize(queryParams));
		loadData()
	}, [search, user.unread])

	const loadData = async () => {
		try{
			setLoading({...loading, isActive:true})
			const data = await authorizedReq({
				route: "/api/ccreceived/search", 
				creds: loginState.loginState, 
				data:{...search, filters: {...filters}}, 
				method: 'post'
			})
			if(data.unread !== undefined)
				dispatch(updateUser({unread:data.unread}))
			setData({rows:data.ccreceived})

		} catch (err) {
			snackbar.showMessage(
				err?.response?.data ?? err.message ?? err,
			)
		}
		setLoading({...loading, isActive:false})
	}

	const handleChange = (event) => {
		if (event.target.id == 'ccreceivedType'){
			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
		}
	}

	const handleExport = async (password) => {
		try {
			await authorizedDownload({
				route: "/api/ccreceived/export", 
				creds: loginState.loginState, 
				data:{...search, password, filters: {...filters}}, 
				method: 'post',
				password
			}, "ccreceivedExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
	}
	
    const extraFields = []

	const defaultFields = {texts:[
        {label:"Date", id:"createdTime"},
        {label:"Data ID", id:"dataID"},
        {label:"Certificate No", id:"certNo"},
        {label:"Member Information", id:"memberInformation"},
        {label:"Promoter Name", id:"promoterName"},
        {label:"Village", id:"village"},
        {label:"District", id:"district"},

    ], checkboxes:[]}

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={ccreceivedFieldsCopy} otherFields={[]} typeField={null}/>
		)
	}
	// const openSales = (val) => (_e) => {
	// 	navigate('edit/' + val._id)
	// }

	return (<>
		<Helmet>
			<title>CC Received | CRM</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<CCReceivedListToolbar loadData={loadData} handleExport={handleExport} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={loadData}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={extraFields} 
							type={null}//search.salesType} 
							fields={ccreceivedFieldsCopy} 
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							defaultFields={defaultFields} 
							additionalNames={['View']}
							additional={[renderViewButton]}
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
							setSortState={setSortState}
							sortState={sortState}
							// rowOnclick={openSales}
							disableEdit={false}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CCReceivedList;
