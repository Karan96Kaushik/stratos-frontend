import { useContext, useState } from 'react';
import axios from 'axios';
import { LoginContext } from "../myContext"

const authorizedReq = async (request) => {

    try {
        // console.log('submitting formValues', request);

        let options = {
            method:request.method,
            url: request.route, 
            headers:{
                "x-authentication": request.creds.token
            }
        }

        if(request.method == "post") {
            options.data = {...request.data}
        } else {
            options.params = {...request.data}
        }

        let resp = await axios(options)
        
        // console.log(resp)
        return resp.data
    }
    catch (err) {
        console.error(err)
        console.log("REQUEST ERROR", err?.response?.data)
        throw new Error(err)
        // await localStorage.setItem("kiraaStore", JSON.stringify({}))
        // await loginState.setLogin({})
        // setLoading(false)
        // setMessage("")
        // setError(err.response.data)
    }
};

const authorizedDownload = async (request, fileName) => {

    fetch(request.route, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                "x-authentication": request.creds.token
            },
            body:JSON.stringify({...request.data}),
        })
        .then((response) => response.blob())
        .then((blob) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(
                new Blob([blob]),
            );
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute(
                'download',
                fileName,
            );

            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        });
};

const authorizedDownloadLink = async (request, fileName) => {
    try{
        let options = {
            method:request.method,
            url: request.route, 
            headers:{
                "x-authentication": request.creds.token
            }
        }
    
        if(request.method == "post") {
            options.data = {...request.data}
        } else {
            options.params = {...request.data}
        }
    
        let resp = await axios(options)
        console.log(resp)
        window.open(resp.data.file)
    } catch (err) {
        throw new Error(err)
    }

        
};

export {authorizedReq, authorizedDownload, authorizedDownloadLink}