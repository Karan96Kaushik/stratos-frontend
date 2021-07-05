import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs } from '@material-ui/core';
import QuotationListToolbar from 'src/components/quotations/QuotationListToolbar';
import {authorizedReq} from '../utils/request'
import { LoginContext, LoadingContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import quotationFields from '../statics/quotationFields';
import GeneralList from '../components/GeneralList'

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
		setSearch({...search, page, rowsPerPage})
	}, [page, rowsPerPage])

	useEffect(async () => {
		navigate("/app/quotations?" + serialize(search));
		if(search.text == "" || search.text.length > 4)
			goSearch("PG");
	}, [search])

	const goSearch = (rmk) => {
		loadData()
    }

	const loadData = async () => {
		try{
			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/quotations/search", 
				creds: loginState.loginState, 
				data:{...search}, 
				method: 'get'
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
		// if (event.target.id == 'leadType'){
			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
		// }
	}
	
	const extraFields = [
		{name:"Quotation ID", id: "quotationID"},
		{name:"Member ID", id: "memberID"},
		{name:"Date", id: "createdTime"},
	]

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
				<QuotationListToolbar searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={extraFields} 
							type={"all"} 
							fields={quotationFields} 
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
						/>				
					</Paper>
				</Box>
			</Container>
		</Box>
	</>)
};

export default CustomerList;
