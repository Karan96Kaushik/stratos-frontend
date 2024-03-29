import axios from 'axios';

const axiosInstance = axios.create({
    validateStatus: function (status) {
      return (status <= 299 && status >= 200) || status === 304;
    }
});

const authorizedReq = async (request) => {

    try {
        let options = {
            method:request.method,
            url: request.route, 
            headers:{
                "x-authentication": request.creds.token
            }
        }
        if(request.method == "post" || request.method == "patch") {
            options.data = {...request.data}
        } else {
            options.params = {...request.data}
        }

        let resp = await axiosInstance(options)
        
        return resp.data
    }
    catch (err) {
        console.error(err)
        throw new Error(err?.response?.data?.message?? err?.response?.data ?? err?.response ?? err)
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
    
        let resp = await axiosInstance(options)
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

        let resp = await axiosInstance(options)

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
        throw new Error(err?.response?.data?.message?? err?.response?.data ?? err?.response ?? err)
    }
};

export {
    authorizedReq, 
    authorizedDownload, 
    authorizedDownloadLink, 
    authorizedLogin
}