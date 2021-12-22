import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import PackagesListToolbar from 'src/components/packages/PackagesListToolbar';
import { authorizedDownload, authorizedReq} from '../utils/request'
import { LoginContext, LoadingContext } from "../myContext"
import {useLocation, useNavigate, Link} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import GeneralList from '../components/GeneralList'
import ViewDialog from 'src/components/ViewDialog';
import {otherServices, services, yearlyServices} from 'src/statics/packageFields';
import {
	selectFilterFor,
} from "../store/reducers/filtersSlice";
import { useSelector } from "react-redux";
import * as _ from "lodash"

function useQuery() {
	let entries =  new URLSearchParams(useLocation().search);
	const result = {}
	for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

const CustomerList = () => {

	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)
    const [data, setData] = useState({type: '', rows:[]})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const filters = useSelector(selectFilterFor("packages"))

	const query = useQuery();
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage, ...sortState})

	useEffect(() => {
		loadData()
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
		console.log(search)
		let queryParams = Object.assign({}, search)
		delete queryParams.filters
		// navigate("/app/taskaccounts?" + serialize(queryParams));
		if(search?.text?.length > 2 || search?.text?.length == 0 || !search?.text)
			loadData();
	}, [search])

	const loadData = async () => {
		try{
			const searchCopy = _.merge({}, search)
			searchCopy.filters = _.merge({}, filters)
			
			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/packages/search", 
				creds: loginState.loginState, 
				data:{...searchCopy}, 
				method: 'post'
			})
			setData({rows:_data})

		} catch (err) {
			snackbar.showMessage(
				err?.response?.data ?? err.message ?? err,
			)
		}
		setLoading({...loading, isActive:false})
	}

	const handleChange = (event) => {
		setData({rows:[]})
		setPage(1)
		setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
	}

	// Fields in view details pop up
	const otherFields = [
		{name:'Package ID', id:"packageID"},
		{name:'Client Name', id:"clientName"},
		{name:'Date', id:"createdTime"},
		{name:'Promoter', id:"promoter"},
		// {name:'Yearly Amount', id:"amount", type: 'number'},
		{name:'Start Date', id:"startDate", type: 'date'},
		{name:'Description', id:"description"},
		// {name:'Payment Cycle', id:"paymentCycle", options: ['', 'Half Yearly']},
		// {name:'Due Amount', id:"due", type: 'number'},
		// {name:'Received Amount', id:"receivedAmount", type: 'number'},
		{name:'Completion Date', id:"completionDate"},
				// {name:'Cersai Undertaking', id:"cersai"},
		{name:'Notes', id:"notes"},
		{name:'Remarks', id:"remarks"},
		// {name:'Consultation', id:"Consultation", type: 'date'},
		// {name:'Proof Reading', id:"Proof Reading", type: 'date'},
		// {name:'Legal Documents', id:"Legal Documents", type: 'date'},
		// {name:'Other Services', id:"Other Services"},
	]

	// Fields to be shown in the main table 
	const defaultFields = {
			texts:[
				{label:'Date', id:"createdTime"},
                {label:'Package ID', id:"packageID"},
                {label:'Client Name', id:"clientName"},
				{label:'Completion Date', id:"completionDate"},
				// {label:'Promoter', id:"promoter"},
				{label:'Start Date', id:"startDate", type: 'date'},
			],
			checkboxes:[
				// {label:'Consultation', id:"Consultation", type: 'date'},
				// {label:'Proof Reading', id:"Proof Reading", type: 'date'},
				// {label:'Legal Documents', id:"Legal Documents", type: 'date'},
				// {label:'Other Services', id:"Other Services", type: 'date'},
            ]
	}
    services.forEach(s => defaultFields.texts.push({label:s, id:s}))
    services.forEach(s => otherFields.push({name:s, id:s}))
    yearlyServices.forEach(s => defaultFields.texts.push({label:s, id:s}))
    yearlyServices.forEach(s => otherFields.push({name:s, id:s}))
    // otherServices.forEach(s => defaultFields.checkboxes.push({label:s, id:s}))
    otherServices.forEach(s => otherFields.push({name:s, id:s, type: 'boolean'}))

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={defaultFields} otherFields={otherFields} typeField={null}/>
		)
	}

	const handleExport = async (password) => {
		try {

			let others = {}
			others.filters = _.merge({}, filters)

			await authorizedDownload({
				route: "/api/tasks/payments/export", 
				creds: loginState.loginState, 
				data:{...search, ...others, password}, 
				method: 'post'
			}, "taskPaymentsExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
	}

	return (<>
		<Helmet>
			<title>Packages | TMS</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<PackagesListToolbar handleExport={handleExport} fields={defaultFields} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={loadData}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={[]} 
							defaultFields={defaultFields} 
							type={null} 
							fields={{}} 
							data={data} 
							search={search} 
							handleChange={handleChange}
							page={page} 
							rowsPerPage={rowsPerPage}
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
							setSortState={setSortState}
							sortState={sortState}
							additional={[renderViewButton]}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
