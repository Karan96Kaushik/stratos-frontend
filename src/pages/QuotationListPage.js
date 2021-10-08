import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import QuotationListToolbar from 'src/components/quotations/QuotationListToolbar';
import { authorizedReq, authorizedDownload } from '../utils/request'
import { LoginContext, LoadingContext } from "../myContext"
import { useLocation, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import quotationFields, {allQuotes} from '../statics/quotationFields';
import GeneralList from '../components/GeneralList'
import ViewDialog from 'src/components/ViewDialog';
import {
	selectFilterFor,
} from "../store/reducers/filtersSlice";
import { useSelector } from "react-redux";
import * as _ from "lodash";

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

	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)
    const [data, setData] = useState({type: '', rows:[]})
    // const args = useRef({})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const filters = useSelector(selectFilterFor("quotations"))

	const query = useQuery();
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage, text:""})

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
		let queryParams = Object.assign({}, search)
		delete queryParams.filters
		navigate("/app/quotations?" + serialize(queryParams));
		if(search.text == "" || search.text.length > 2)
			goSearch("PG");
	}, [search])

	const goSearch = (rmk) => {
		loadData()
    }

	const loadData = async () => {
		try{
			let others = {}
			others.filters = _.merge({}, filters)

			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/quotations/search", 
				creds: loginState.loginState, 
				data:{...search, ...others}, 
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

	const handleExport = async (password) => {
		try {
			let others = {}
			others.filters = _.merge({}, filters)

			await authorizedDownload({
				route: "/api/quotations/export", 
				creds: loginState.loginState, 
				data:{...search, ...others, password}, 
				method: 'post'
			}, "quotationsExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
	}
	
	const extraFields = [
		{name:"Date", id: "createdTime"},
		{name:"Quotation ID", id: "quotationID"},
		// {name:"Member ID", id: "memberID"},
		{name:"Member Name", id: "memberName"},
		{name:"Services", id: "serviceType"},
	]

	const defaultFields = {
		texts:[
            {label:"Department", id:"dept", options:["", "Tech", "Legal", "CMS", "Retainer"], isRequired:true},
            {label:"Client Name", id:"clientName", isRequired:true},
            {label:"Related Project Name", id:"relatedProject"},
            {label:"Status", id:"status"},
            {label:"Closure Status", id:"closureStatus"},
            {label:"Quotation Amount", id:"quotationAmount"},
		],
		checkboxes:[]
	}
	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={quotationFields} otherFields={extraFields} typeField={null}/>
		)
	}
	return (<>
		<Helmet>
			<title>Quotations | TMS</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<QuotationListToolbar handleExport={handleExport} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={extraFields} 
							type={null} 
							fields={quotationFields} 
							defaultFields={allQuotes}
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							additional={[renderViewButton]}
							defaultFields={defaultFields} 
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
							setSortState={setSortState}
							sortState={sortState}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
