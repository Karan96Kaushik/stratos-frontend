import { useRef, useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Paper, Tab, Tabs, IconButton } from '@material-ui/core';
import ProcurementListToolbar from 'src/components/procurements/ProcurementListToolbar';
import { authorizedDownload, authorizedReq} from '../utils/request'
import { LoginContext, LoadingContext } from "../myContext"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useSnackbar } from 'material-ui-snackbar-provider'
import GeneralList from '../components/GeneralList'
import ViewDialog from 'src/components/ViewDialog';
import {
	selectFilterFor,
} from "../store/reducers/filtersSlice";
import { selectMembers } from 'src/store/reducers/membersSlice';
import { useSelector } from "react-redux";
import * as _ from "lodash"
import { AccountTree, CheckCircleRounded, EditRounded, Check } from '@material-ui/icons';
import { statusOptions } from 'src/statics/procurementFields';
import ApprovalDialog from 'src/components/procurements/ApprovalDialog';

function useQuery(url) {
	const {search} = new URL(url);
	let entries =  new URLSearchParams(search);
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

const ProcurementList = () => {

	const loginState = useContext(LoginContext)
	const {loading, setLoading} = useContext(LoadingContext)
    const [data, setData] = useState({type: '', rows:[]})
	const navigate = useNavigate();
	const snackbar = useSnackbar()
	const [sortState, setSortState] = useState({sortID:'createdTime', sortDir:-1})

	const memberRows = useSelector(selectMembers)

    const pathName = useLocation().pathname
    const isPendingApprovals = useLocation().pathname.includes("pending-approvals")
    const isAccounts = useLocation().pathname.includes("accounts")

	const filterName = isAccounts ? "procurementsAccounts" : isPendingApprovals ? "procurementsApprovals" : "procurements"
	const filters = useSelector(selectFilterFor(filterName))

	const query = useQuery(window.location.href);
	if(query.rowsPerPage)
		if(!([25,50,100].includes(parseInt(query.rowsPerPage))))
			query.rowsPerPage = 25

	const [page, setPage] = useState(parseInt(query.page) || 1);
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage ?? 25);
	const [search, setSearch] = useState({...query, page, rowsPerPage, ...sortState})

	const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
	const [selectedProcurement, setSelectedProcurement] = useState(null);

	useEffect(() => {
		loadData()
	}, [])

	useEffect(async () => {
		setSearch({...search, page, rowsPerPage, ...sortState})
	}, [page, rowsPerPage])

	useEffect(async () => {
		const query = useQuery(window.location.href);
		if((query.text !== search.text))
			setSearch({...search, text:query.text || ''})
	}, [useLocation().search])

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
		const query = useQuery(window.location.href);
		let queryParams = Object.assign({}, search, query)
		delete queryParams.filters
		navigate(pathName + "?" + serialize(search));
		if(search?.text?.length > 2 || search?.text?.length == 0 || !search?.text)
			loadData();
	}, [search])

    useEffect(() => {
        loadData()
    }, [useLocation().pathname])

	const loadData = async () => {
		try{
			const searchCopy = _.merge({}, search)
			searchCopy.filters = _.merge({}, filters)

			if(searchCopy.filters && searchCopy.filters._rmAssigned) {
				searchCopy.filters._rmAssigned = memberRows.find(m => searchCopy.filters._rmAssigned == m.userName + ` (${m.memberID})`)._id
			}
			
			setLoading({...loading, isActive:true})
			const _data = await authorizedReq({
				route: "/api/procurements/search", 
				creds: loginState.loginState, 
				data:{...searchCopy, details:true, isPendingApprovals, isAccounts}, 
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
        {name:'Date', id:"createdTime"},
        {name:'Bill Date', id:"billDate"},
        {name:'Procurement ID', id:"procurementID"},
        {name:'Requested By', id:"addedByName"},
        {name:'Approved By', id:"approvedByName", type:"array"},
        {name:'Last Approver Date', id:"lastApproverDate"},
        {name:'Vendor Name', id:"vendorName"},
        {name:'Vendor Code', id:"vendorCode"},
        {name:'Vendor Type', id:"vendorType"},
        {name:'Product Details', id:"productDetails"},
        {name:'Bill No.', id:"billNo"},
        {name:'Amount', id:"amount"},
        {name:'GST Amount', id:"gstamount"},
        {name:'TDS Amount', id:"tdsamount"},
        {name:'Total', id:"total"},
        {name:'Status', id:"status"},
        {name:'Payment Type', id:"paymentType"},
		{name:'Approved Amount', id:"approvedAmount"},
        {name:'Paid Amount', id:"paidAmount"},
        {name:'Payment Reference', id:"paymentReference"},
        {name:'Payment Date', id:"paymentDate"},
        {name:'Remarks', id:"existingRemarks", type:"array"},
        {name:'Asset Tagging Code', id:"assetTaggingCode"},
        {name:'Tat', id:"tat"},
        
	]

	// Fields to be shown in the main table 
	const defaultFields = {
			texts:[
				{label:'Date', id:"createdTime"},
				{label:'Procurement ID', id:"procurementID"},
				{label:'Bill Date', id:"billDate"},
				{label:'Requested By', id:"addedByName"},
				{label:'Approved By', id:"approvedByName", type:"array"},
				// {label:'Last Approver Date', id:"lastApproverDate"},
				{label:'Vendor Name', id:"vendorName"},
				// {label:'Vendor Code', id:"vendorCode"},
				// {label:'Vendor Type', id:"vendorType"},
				{label:'Product Details', id:"productDetails"},
                {label:'Bill No.', id:"billNo"},
                // {label:'Amount', id:"amount"},
                // {label:'GST Amount', id:"gstamount"},
                // {label:'TDS Amount', id:"tdsamount"},
                {label:'Total', id:"total"},
                {label:'Status', id:"status"},
                // {label:'Payment Type', id:"paymentType"},
                // {label:'Remarks', id:"remarks"},
                // {label:'Asset Tagging Code', id:"assetTaggingCode"},
                // {label:'Tat', id:"tat"},
                
                
                
                
                
			],
			checkboxes:[]
	}

	const commonFilters = {
		texts :[
			{label:"Added By", id: "addedBy"},
			// {label:"Status", id: "status", options:statusOptions},
		],
		checkboxes:[
			{label:"Include Archived", id:"archived"},
			{label:"Only Archived", id: "onlyarchived"},
		]
	}

	// View button
	const renderViewButton = (val) => {
		return (				
			<ViewDialog data={val} fields={defaultFields} otherFields={otherFields} typeField={null}/>
		)
	}
	const renderManageButton = (val) => {
        // if (val.addedBy == loginState.loginState._id || !loginState.loginState.permissions.system.includes("Manage Procurements")) {
        //     return null
        // }
		return (				
			<Link to={`/app/procurement/manage/${val._id}`}>
				<IconButton aria-label="expand row" size="small">
					<AccountTree />
				</IconButton>
			</Link>
		)
	}
    const renderApproveButton = (val) => {
        if (!val._approvers?.includes(loginState.loginState._id) || val.approvedBy?.includes(loginState.loginState._id)) {
            return <CheckCircleRounded style={{color: "#00AA00"}} />
        }
        return (
            <IconButton aria-label="expand row" size="small" onClick={() => handleApproveClick(val)}>
                <Check />
            </IconButton>
        )
    }

    const editRoute = isAccounts ? `/app/procurement/editaccounts/` : `/app/procurement/edit/`
    const renderEditButton = (val) => {
        if (val.addedBy !== loginState.loginState._id && !loginState.loginState.permissions.page.includes("Procurements W") && !isAccounts) {
            return null
        }
        return (
            <IconButton aria-label="expand row" size="small" onClick={() => navigate(editRoute + val._id)}>
                <EditRounded />
            </IconButton>
        )
    }

    const handleApprove = async (approvalData) => {
        try {
            setLoading({...loading, isActive:true})
            await authorizedReq({
                route: "/api/procurements/approve",
                creds: loginState.loginState,
                data: {
                    _id: approvalData.procurementId,
                    paymentType: approvalData.paymentType,
                    approvedAmount: approvalData.amount,
                    remarks: approvalData.remarks
                },
                method: 'post'
            })
            setLoading({...loading, isActive:false})
            loadData()
        } catch (err) {
            setLoading({...loading, isActive:false})
            snackbar.showMessage(
                err?.response?.data ?? err.message ?? err,
            )
        }
    }

    const handleApproveClick = (procurement) => {
        setSelectedProcurement(procurement);
        setApprovalDialogOpen(true);
    }

    const handleDialogClose = () => {
        setApprovalDialogOpen(false);
        setSelectedProcurement(null);
    }

    const actionNames = [
        "View",
    ]

    const actions = [
        renderViewButton,
    ]

    if (isPendingApprovals) {
        actions.push(renderApproveButton)
        actionNames.push("Approve")
    }
    if (loginState.loginState.permissions.system.includes("Manage Procurements") && !isAccounts) {
        actions.push(renderManageButton)
        actionNames.push("Manage")
    }
    if (!isPendingApprovals) {
        actions.push(renderEditButton)
        actionNames.push("Edit")
    }

	const handleExport = async (password) => {
		try {
			const searchCopy = _.merge({}, search)
			searchCopy.filters = _.merge({}, filters)
			
			if(searchCopy.filters && searchCopy.filters._rmAssigned) {
				searchCopy.filters._rmAssigned = memberRows.find(m => searchCopy.filters._rmAssigned == m.userName + ` (${m.memberID})`)._id
			}

			await authorizedDownload({
				route: "/api/procurements/export", 
				creds: loginState.loginState, 
				data:{...searchCopy, details: true, password}, 
				method: 'post'
			}, "procurementsExport" + ".xlsx")
		}
		catch (err) {
			snackbar.showMessage(
				String(err?.response?.data ?? err.message ?? err),
			)
		}
	}

	return (<>
		<Helmet>
			<title>Procurement | CRM</title>
		</Helmet>
		<Box sx={{
				backgroundColor: 'background.default',
				minHeight: '100%',
				py: 3
			}}>
			<Container maxWidth={false}>
				<ProcurementListToolbar forView={filterName} handleExport={handleExport} fields={defaultFields} commonFilters={commonFilters} searchInfo={search} setSearch={setSearch} handleChange={handleChange} goSearch={loadData}/>
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
                            disableEdit={true}
							rowsPerPage={rowsPerPage} 
							setPage={setPage} 
							setRowsPerPage={setRowsPerPage}
							setSortState={setSortState}
							sortState={sortState}
                            additionalNames={actionNames}
							additional={actions}
						/>				
					</Paper>
				</Box>
			</Container>
			<ApprovalDialog
				open={approvalDialogOpen}
				onClose={handleDialogClose}
				onApprove={handleApprove}
				procurement={selectedProcurement}
			/>
		</Box>
	</>)
};

export default ProcurementList;
