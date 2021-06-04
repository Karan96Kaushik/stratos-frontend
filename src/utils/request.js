import { useContext, useState } from 'react';
import axios from 'axios';
import { LoginContext } from "../myContext"

const authorizedReq = async (request) => {

    try {
        console.log('submitting formValues', request);
        let resp = await axios({
            method:request.method,
            url: request.route, 
            headers:{
                "x-authentication": request.creds.token
            },
            data:{...request.data},
            params:{...request.data},
        })
        
        console.log(resp)
        return resp.data
    }
    catch (err) {
        console.error(err)
        console.log(err.response.data)
        throw new Error(err)
        // await localStorage.setItem("kiraaStore", JSON.stringify({}))
        // await loginState.setLogin({})
        // setLoading(false)
        // setMessage("")
        // setError(err.response.data)
    }
};

export {authorizedReq}