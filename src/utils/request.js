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
        throw new Error(err?.response?.data || err)
        // await localStorage.setItem("kiraaStore", JSON.stringify({}))
        // await loginState.setLogin({})
        // setLoading(false)
        // setMessage("")
        // setError(err.response.data)
    }
};

const serialize = function(obj) {
	var str = [];
	for (var p in obj)
	  if (obj.hasOwnProperty(p)) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	  }
	return str.join("&");
}

const authorizedDownload = (request, fileName) =>  new Promise((resolve, reject) => {

    let query = ""
    let options = {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            "x-authentication": request.creds.token
        },
    }
    
    if(request.method == 'post')
        options.body = JSON.stringify({...request.data})
    else
        query = "?" + serialize(request.data)

    fetch(request.route + query, options)
        .then(async (data) => {
            if(!data.ok) {
                let error = await data.text()
                throw new Error(error)
            }
            return data
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
            resolve()
        })
        .catch(err => {
            reject(err)
        });
});

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

const authorizedLogin = async (request) => {

    try {

        let options = {
            method:"post",
            url: "/api/refresh", 
            headers:{
                "x-authentication": request.token
            }
        }

        let resp = await axios(options)

        resp = {
            isLoggedIn: true,
            loginTime: + new Date(),
            ... resp.data.user,
            token: resp.data.token
        }

        localStorage.setItem("tmsStore", JSON.stringify(resp))
        return resp
    }
    catch (err) {
        console.error(err)
        console.debug("REFRESH Error", err?.response?.data ?? err?.response ?? err)
        throw new Error(err?.response?.data || err)
    }
};

export {
    authorizedReq, 
    authorizedDownload, 
    authorizedDownloadLink, 
    authorizedLogin
}