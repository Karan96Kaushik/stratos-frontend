import React, { useState, useEffect, useContext } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Paper,
    Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Description as DocumentIcon,
    PictureAsPdf as PdfIcon,
    Image as ImageIcon,
    GetApp as DownloadIcon
} from '@material-ui/icons';
import { authorizedReq, authorizedDownloadLink } from '../../utils/request'
import { LoginContext } from "../../myContext"
import axios from 'axios';
import { useSnackbar } from 'material-ui-snackbar-provider'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    formControl: {
        margin: theme.spacing(2),
        minWidth: 200,
    },
    amountField: {
        marginTop: theme.spacing(2),
    },
    remarksField: {
        marginTop: theme.spacing(2),
        width: '100%',
    },
    infoGrid: {
        marginBottom: theme.spacing(3),
    },
    infoItem: {
        marginBottom: theme.spacing(1),
    },
    fileList: {
        marginTop: theme.spacing(2),
        maxHeight: 200,
        overflow: 'auto',
    },
    fileViewer: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        minHeight: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileIcon: {
        marginRight: theme.spacing(1),
    },
    fileActions: {
        marginLeft: 'auto',
    },
    imagePreview: {
        maxWidth: '100%',
        maxHeight: 400,
    },
    pdfViewer: {
        width: '100%',
        height: '500px',
        border: 'none'
    }
}));

const getBlobData = (fileUrl) => {
    return fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(error => {
            console.error('Error loading file:', error);
            return null;
        });
};

const FileViewer = ({ fileUrl, onClose, procurement }) => {
    const classes = useStyles();
    const fileType = fileUrl ? fileUrl.split('.').pop().toLowerCase() : '';
    const loginState = useContext(LoginContext);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (fileUrl) {
            authorizedReq({
                route: "/api/files",
                data: { fileName: fileUrl },
                creds: loginState.loginState,
                method: "post"
            }).then(response => {
                // response.file is an S3 URL, set it directly for all file types
                setPreviewUrl(response.file);
            }).catch(error => {
                console.error('Error loading file:', error);
            });
        }
    
        // No need to revoke object URLs since we're not creating any
        return () => {};
    }, [fileUrl, loginState.loginState]);

    useEffect(() => {
        setPreviewUrl(null)
    }, [procurement?.procurementID]);

    const handleFileAction = (action) => {
        const fileName = fileUrl;
        authorizedDownloadLink({
            route: "/api/files",
            data: { fileName },
            creds: loginState.loginState,
            method: "post"
        }, fileName.split("/")[1]);
    };

    const renderFileContent = () => {
        if (!previewUrl) {
            return (
                <Box textAlign="center" width="100%">
                    <Typography variant="body1">Loading preview...</Typography>
                </Box>
            );
        }
        
        let pdfUrl = `${'https://understandingpatientdata.org.uk/sites/default/files/2017-07/Identifiability%20briefing%205%20April.pdf'}`
        let pdfUrl3 = encodeURIComponent(`https://tms0001.s3.ap-south-1.amazonaws.com/PREQ0668/332_145_WEBFLEET.connect%201.67.1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASMOAX6HUJBI63YQL%2F20250513%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250513T142516Z&X-Amz-Expires=300&X-Amz-Signature=8d18335aabcce3a53cf84a2d93e3215258fcc060f20153c9a3a908d21bd8c1bf&X-Amz-SignedHeaders=host`)

        let isChrome = !!window.chrome


        switch (fileType) {
            case 'pdf':
                return !isChrome ? (
                    <object
                        data={previewUrl}
                        type="application/pdf"
                        width="100%"
                        height="500px"
                        style={{
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        }}
                    >
                    </object>) : (
                    <embed
                        // src={`${'https://understandingpatientdata.org.uk/sites/default/files/2017-07/Identifiability%20briefing%205%20April.pdf'}`}
                        src={`${previewUrl}`}
                        width="100%"
                        height="500px"
                        type="application/pdf"
                        alt="PDF Preview"
                    />
                )
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return (
                    <Box width="100%">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className={classes.imagePreview}
                        />
                    </Box>
                );
            default:
                return (
                    <Box textAlign="center">
                        <Typography variant="body1" gutterBottom>
                            Preview not available
                        </Typography>
                    </Box>
                );
        }
    };

    return (
        <Paper className={classes.fileViewer}>
            {renderFileContent()}
        </Paper>
    );
};

export default function ApprovalDialog({ open, onClose, onApprove, onReject, procurement }) {
    const classes = useStyles();
    const [paymentType, setPaymentType] = useState(null);
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const loginState = useContext(LoginContext);
    const snackbar = useSnackbar();

    const isAlreadyApproved = procurement?.approvedBy?.includes(loginState.loginState._id)
    const isAlreadyRejected = procurement?.rejectedBy?.includes(loginState.loginState._id)

    useEffect(() => {

        if (procurement) {

            setRemarks('')
            setPaymentType(null)
            setAmount(null)

            // if (procurement.paymentType) {
            //     setPaymentType(procurement.paymentType);
            // }
            // else {
            //     setPaymentType(null)
            // }
            // if (procurement.approvedAmount) {
            //     setAmount(procurement.approvedAmount.toString());
            // }
            // else {
            //     setAmount(null)
            // }
            // if (procurement.remarks) {
            //     setRemarks(procurement.remarks);
            // }
        }
    }, [procurement?.procurementID]);

    const handlePaymentTypeChange = (event) => {
        setPaymentType(event.target.value);
        if (event.target.value === 'part') {
            setAmount('');
        }
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleRemarksChange = (event) => {
        setRemarks(event.target.value);
    };

    const handleApprove = () => {
        if (!paymentType) {
            snackbar.showMessage("Please select a payment type")
            return
        }
        onApprove({
            procurementId: procurement._id,
            paymentType,
            amount: paymentType === 'part' ? parseFloat(amount) : null,
            remarks
        });
        onClose();
    };

    const handleReject = () => {
        onReject({
            procurementId: procurement._id,
            remarks
        });
        onClose();
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <PdfIcon className={classes.fileIcon} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <ImageIcon className={classes.fileIcon} />;
            default:
                return <DocumentIcon className={classes.fileIcon} />;
        }
    };

    const handleFileClick = (file) => {
        if (selectedFile === file) {
            setSelectedFile(null);
        } else {
            setSelectedFile(file);
        }
    };

    const handleFileDownload = (file) => {
        authorizedDownloadLink({
            route: "/api/files",
            data: { fileName: file },
            creds: loginState.loginState,
            method: "post"
        }, file.split("/")[1]);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Approve Procurement</DialogTitle>
            <DialogContent>
                <Box className={classes.root}>
                    {procurement && (
                        <Grid container spacing={2} className={classes.infoGrid}>
                            <Grid item xs={12} className={classes.infoItem}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Procurement ID: {procurement.procurementID}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.infoItem}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Vendor: {procurement.vendorName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.infoItem}>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Total Amount: ₹{procurement.total}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}

                    <FormControl component="fieldset" className={classes.formControl}>
                        <Typography variant="subtitle1" gutterBottom>
                            Payment Type
                        </Typography>
                        <RadioGroup
                            value={paymentType}
                            onChange={handlePaymentTypeChange}
                        >
                            <FormControlLabel
                                value="full"
                                control={<Radio />}
                                label="Full Payment"
                                disabled={isAlreadyApproved || isAlreadyRejected}
                            />
                            <FormControlLabel
                                value="part"
                                control={<Radio />}
                                label="Part Payment"
                                disabled={isAlreadyApproved || isAlreadyRejected}
                            />
                        </RadioGroup>
                    </FormControl>

                    {paymentType === 'part' && (
                        <TextField
                            className={classes.amountField}
                            label="Amount"
                            type="number"
                            value={amount}
                            disabled={isAlreadyApproved || isAlreadyRejected}
                            onChange={handleAmountChange}
                            fullWidth
                            required
                            inputProps={{
                                min: 0,
                                max: procurement?.total || 0
                            }}
                            helperText={`Maximum amount: ₹${procurement?.total || 0}`}
                        />
                    )}

                    <Divider style={{ margin: '20px 0' }} />

                    {procurement?.files?.length > 0 && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Attached Files
                            </Typography>
                            <List className={classes.fileList}>
                                {procurement.files.map((file, index) => (
                                    <ListItem 
                                        key={index} 
                                        button 
                                        onClick={() => handleFileClick(file)}
                                    >
                                        {getFileIcon(file)}
                                        <ListItemText primary={file.split('/').pop()} />
                                        <div className={classes.fileActions}>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileDownload(file);
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </div>
                                    </ListItem>
                                ))}
                            </List>

                            {selectedFile && (
                                <FileViewer
                                    fileUrl={selectedFile}
                                    onClose={() => setSelectedFile(null)}
                                    procurement={procurement}
                                />
                            )}
                        </>
                    )}

                    <Grid item md={6} xs={12}>
                        <Typography variant="h5">Remarks History</Typography>
                        {procurement?.existingRemarks?.length && (
                            <List>
                                {procurement?.existingRemarks?.map((remark, index) => (
                                    <ListItem key={index}>
                                        <Typography variant='body2'>{remark}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Grid>

                    <TextField
                        className={classes.remarksField}
                        label="Remarks"
                        multiline
                        rows={4}
                        value={remarks}
                        onChange={handleRemarksChange}
                        disabled={isAlreadyApproved || isAlreadyRejected}
                        variant="outlined"
                        fullWidth
                        placeholder="Add any additional remarks about the approval"
                    />
                </Box>
            </DialogContent>
            <DialogActions>


            {(!isAlreadyApproved && !isAlreadyRejected) ? <Button 
                    onClick={handleReject} 
                    color="secondary" 
                    variant="contained"
                    disabled={paymentType === 'part' && (!amount || parseFloat(amount) > (procurement?.total || 0))}
                >
                    Reject
                </Button> : <Button 
                    onClick={handleReject} 
                    color="primary" 
                    variant="contained"
                    disabled={true}
                >
                    {isAlreadyRejected ? "Rejected" : "Reject"}
                </Button>}


                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>


                {(!isAlreadyApproved && !isAlreadyRejected) ? <Button 
                    onClick={handleApprove} 
                    style={{backgroundColor: "green", color: "white"}} 
                    variant="contained"
                    disabled={paymentType === 'part' && (!amount || parseFloat(amount) > (procurement?.total || 0))}
                >
                    Approve
                </Button> : <Button 
                    onClick={handleApprove} 
                    color="primary"
                    variant="contained"
                    disabled={true}
                >
                    {isAlreadyApproved ? "Approved" : "Approve"}
                </Button>}

                
            </DialogActions>
        </Dialog>
    );
} 