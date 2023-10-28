
import { LoginContext } from "src/myContext"
import { useState, useContext, useEffect } from 'react';
import {
	TextField, Autocomplete, createFilterOptions
} from '@material-ui/core';
import { useSnackbar } from 'material-ui-snackbar-provider'
import { authorizedReq, authorizedDownloadLink } from 'src/utils/request'


const ProjectInput = ({values, setValues, isEdit}) => {

	const snackbar = useSnackbar()

	const loginState = useContext(LoginContext)

	const [clientRows, setClientRows] = useState([]);
    const [placeholder, setPlaceholder] = useState({
		client: {clientID:"", name: "", _id: ""}
	});

	const [searchInfo, setSearchInfo] = useState({type:"", text:""});

    const getClients = async () => {
		try {
			let response = await authorizedReq({ route: "/api/clients/search", creds: loginState.loginState, data: {...searchInfo, searchAll:true, ignorePermissions:true}, method: 'post' })
			setClientRows(response)

		} catch (err) {
			snackbar.showMessage(
				"Error getting clients - " + (err?.response?.data ?? err.message ?? err),
			)
			console.error(err)
		}
	};

    useEffect(() => {
        if (values.projectName) {
            const client = {clientID:"", name: values.projectName, _id: ""}
            setPlaceholder({client})
        }
    })


    const handleClientChange = (event) => {
        const others = {}

        let client = clientRows.find(val => String(val._id) == event.target.value)
        if (!client) return
        setPlaceholder({client})
        setValues({...values, projectName:client.name, billTo: client.promoter, clientAddress: client.location})
    }

    const handleClientInputChange = (event, value, reason) => {
        const target = event?.target

        if(target?.value?.length > 2) {
            setSearchInfo({text: target.value})
        }
        if(target?.value?.length == 0) {
            setClientRows([])
        }

        // Handle the case when no option is selected
        if (reason === 'input' && value) {
            setValues({...values, projectName:value})
            const client = {clientID:"", name: value, _id: ""}
            setPlaceholder({client})
        }
    }

    useEffect(async () => {
		if(searchInfo.text.length > 2)
			getClients()
		if(searchInfo.text.length == 0)
			setClientRows([])
	}, [searchInfo])

    useEffect(async () => {
        if (values.clientName && !placeholder.client?.name) {
			setPlaceholder({ client:{ name: values.clientName, clientID: values.clientID }})
        }
    },[values.clientName])

	const filterOptions = createFilterOptions({
		stringify: option => option.promoter + option.name + option.location + option.clientID + option.userID,
	});

    return <Autocomplete
        id="projectName"
        options={clientRows}
        value={placeholder.client}
        disabled={isEdit && placeholder?.client?.clientName}
        getOptionLabel={(row) => row.name + (row.clientID ? ` (${row.clientID})` : '')}
        onInputChange={handleClientInputChange}
        onChange={(e,value) => handleClientChange({target:{id:"_clientID", value:value?._id, name:value?.name, clientID: value?.clientID}})}
        fullWidth
        filterOptions={filterOptions}
        variant="outlined"
        renderInput={(params) => <TextField variant="outlined" {...params} label="Project Name" />}
    />
} 

export default ProjectInput