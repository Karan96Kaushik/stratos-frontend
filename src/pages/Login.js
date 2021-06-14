import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    TextField,
    Typography
} from '@material-ui/core';
import React, {useContext, useState} from 'react';
import axios from 'axios';
import {LoginContext} from "../myContext"
import {useLocation} from 'react-router-dom'
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

const Login = () => {
    const navigate = useNavigate();

    const loginState = useContext(LoginContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const location = useLocation();

    let forgot = false;
    let touched = false;
    let handleBlur = () => {};

    if (location.pathname == "/login/forgot") 
        forgot = true

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError("")
    };

    const handleSubmit = async (e) => {
        try { 
			e.preventDefault();
            setLoading(true)
            let resp = await axios.post(! forgot ? `/api/login` : "/api/forgot", {creds: {email, password}})
            // Log

            if (! forgot) {
                let userLogin = {
                    isLoggedIn: true,
                    loginTime: + new Date(),
                    ... resp.data.user,
                    token: resp.data.token
                }

                await localStorage.setItem("tmsStore", JSON.stringify(userLogin))
                await loginState.setLogin(userLogin)
                // history.push('/');
                navigate('/', {replace: true});

            } else { // console.log()
                setLoading(false)
                setMessage("Email Sent")
                setError("")
            }
        } catch (err) {
            console.error(err)
            console.log(err.response.data)
            await localStorage.setItem("tmsStore", JSON.stringify({}))
            await loginState.setLogin({})
            setLoading(false)
            setMessage("")
            setError(err.response.data)
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | TMS</title>
            </Helmet>
            <Box sx={
                {
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center'
                }
            }>
                <Container maxWidth="sm">
                    <form onSubmit={handleSubmit}>
                        <Box sx={
                            {mb: 3}
                        }>
                            <Typography color="textPrimary" variant="h2">
                                Sign in
                            </Typography>
                        </Box>
                        <TextField error={
                                Boolean(touched.email && errors.email)
                            }
                            fullWidth
                            helperText={
                                touched.email && errors.email
                            }
                            label="Email Address"
                            margin="normal"
                            name="email"
                            onBlur={handleBlur}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            variant="outlined"/>
                        <TextField error={Boolean(touched.password && errors.password)}
                            fullWidth
                            helperText={touched.password && errors.password}
                            label="Password"
                            margin="normal"
                            name="password"
                            onBlur={handleBlur}
                            type="password"
                            value={password}
                            onChange={
                                (e) => setPassword(e.target.value)
                            }
                            variant="outlined"/>
                        <Box sx={
                            {py: 2}
                        }>
                            <Button color="primary"
                                disabled={loading}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained">
                                Sign in now
                            </Button>
                        </Box>
                    </form>
                    {error.length ? (<Alert severity="error">{error}</Alert>) : ""}
		    		{message.length ? (<Alert severity="info">{message}</Alert>) : ""}

                    <Snackbar open={Boolean(error.length)} autoHideDuration={6000} onClose={handleClose}>
                        <Alert severity="error" hidden={false}>{error}</Alert>
                    </Snackbar>
			
                </Container>
            </Box>
        </>
    );
};

export default Login;
