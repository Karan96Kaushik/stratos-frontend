import {useRef, useEffect, useState, useContext} from 'react';
import { Helmet } from 'react-helmet';
import { Box, IconButton, Container, Paper, Tab, Tabs } from '@material-ui/core';
import ClientListToolbar from 'src/components/clients/ClientListToolbar2';
import {authorizedReq, authorizedDownload} from '../utils/request'
import { LoginContext,LoadingContext } from "../myContext"
import {useLocation, useNavigate} from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import clientFields from '../statics/clientFields';
import {allClients} from '../statics/clientFields';
import GeneralList from '../components/GeneralList'
import ViewDialog from 'src/components/ViewDialog';
import {
	selectFilterFor,
} from "../store/reducers/filtersSlice";
import { useSelector } from "react-redux";
import { addBlockers } from '../utils/jsControls'
import { Outbound } from '@material-ui/icons';
// import CryptoJS from 'crypto'

function decrypt(text, shift=12) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let char = text.charCodeAt(i);
        if (char >= 65 && char <= 90) {
            // Uppercase letters
            result += String.fromCharCode((char - 65 - shift + 26) % 26 + 65);
        } else if (char >= 97 && char <= 122) {
            // Lowercase letters
            result += String.fromCharCode((char - 97 - shift + 26) % 26 + 97);
        } else {
            // Non-alphabetical characters
            result += text.charAt(i);
        }
    }
    return result;
}

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
	// console.log("A2HS"); const eventq = new Event('sodapop'); window.dispatchEvent(eventq);

	const filters = useSelector(selectFilterFor("clients"))

	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)
	const [data, setData] = useState({type: '', rows:[]})
    // const args = useRef({})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const query = useQuery();
	if(query.rowsPerPage)
		if(!([25,50,100].includes(query.rowsPerPage)))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage, text:""})

	useEffect(() => {
		addBlockers()
		// if(query.clientType) {
			loadData()
		// }
	}, [])

	useEffect(async () => {
		setSearch({...search, page, rowsPerPage, ...sortState})
	}, [page, rowsPerPage])

	useEffect(async () => {
		// Don't update page num to 1 on FIRST RENDER
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
		navigate("/app/clients?" + serialize(search));
		if((search.text == "" || search.text.length > 2 || !search.text))
			goSearch("PG");
	}, [search])

	const goSearch = (rmk) => {
		loadData()
    }

	const loadData = async () => {
		try{
			let others = {}

			others.filters = _.merge({}, filters)

			if(!search.clientType)
				others.searchAll = true

			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/clients/search", 
				creds: loginState.loginState, 
				data:{...search, ...others}, 
				method: 'post'
			})
			setData({rows:_data})

		} catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
		setLoading({...loading, isActive:false})
	}

	const handleChange = (event) => {
		if (event.target.id == 'clientType'){
			setData({rows:[]})
			setPage(1)
			setSearch({...search, [event.target.id]: event.target.value, type:"", text:""})
		}
	}

	const handleExport = async (password) => {
		try {
			let others = {}
			if(!search.clientType)
				others.searchAll = true
	
			await authorizedDownload({
				route: "/api/clients/export", 
				creds: loginState.loginState, 
				data:{...search, ...others, password}, 
				method: 'post'
			}, "clientsExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}

	}
	
	const extraFields = [
		{name:"Date", id: "createdTime"},
		{name:"Client ID", id: "clientID"},
	]

	const clientFieldsMasked = _.merge({}, clientFields)
	for (let type in clientFieldsMasked) {
		clientFieldsMasked[type].texts = clientFieldsMasked[type].texts.filter(f => !['userID', 'password'].includes(f.id))
	}

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={clientFieldsMasked} otherFields={extraFields} typeField={'clientType'} titleID={"clientID"} />
		)
	}

	let actionNames = ['View']

	let isChrome = !!window.chrome

	if (isChrome) {
		actionNames.unshift('Open RERA')
	}

	const renderRERAButton = isChrome && ((val) => {
		return (
			val.userID && val.password && 
			<IconButton aria-label="expand row" size="small" onClick={()=>window.postMessage(JSON.parse(decrypt(val.u)), "*")}>
				<Outbound />
			</IconButton>
		)
	})

	return (<>
		<Helmet>
			<title>Clients | TMS</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<ClientListToolbar handleExport={handleExport} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={goSearch}/>
				<Box sx={{ pt: 3 }}>
					<Paper square>
						<GeneralList
							extraFields={extraFields} 
							type={null}//{search.clientType} 
							fields={clientFields} 
							defaultFields={allClients} 
							data={data} 
							search={search} 
							handleChange={handleChange} 
							page={page} 
							rowsPerPage={rowsPerPage} 
							additionalNames={actionNames}
							additional={[renderRERAButton || null, renderViewButton]}
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
