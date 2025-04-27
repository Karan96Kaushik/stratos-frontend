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

const FileViewer = ({ fileUrl, onClose }) => {
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
                // Create a blob URL from the response
                // const blob = new Blob([response], { type: `application/${fileType}` });
                // const url = URL.createObjectURL(blob);
                const url = response.file
                setPreviewUrl(url);
            }).catch(error => {
                console.error('Error loading file:', error);
            });
        }

        // Cleanup blob URL when component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [fileUrl, loginState.loginState]);

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
                <Box textAlign="center">
                    <Typography variant="body1">Loading preview...</Typography>
                </Box>
            );
        }

        switch (fileType) {
            case 'pdf':
                return (
                    <Box>
                        <iframe
                            src={previewUrl}
                            className={classes.pdfViewer}
                            title="PDF Viewer"
                        />
                        <Box mt={2} display="flex" justifyContent="center">
                            {/* <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleFileAction('download')}
                                startIcon={<DownloadIcon />}
                            >
                                Download PDF
                            </Button> */}
                        </Box>
                    </Box>
                );
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return (
                    <Box>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className={classes.imagePreview}
                        />
                        <Box mt={2} display="flex" justifyContent="center">
                            {/* <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleFileAction('download')}
                                startIcon={<DownloadIcon />}
                            >
                                Download Image
                            </Button> */}
                        </Box>
                    </Box>
                );
            default:
                return (
                    <Box textAlign="center">
                        <Typography variant="body1" gutterBottom>
                            Preview not available
                        </Typography>
                        {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFileAction('download')}
                            startIcon={<DownloadIcon />}
                        >
                            Download File
                        </Button> */}
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

export default function ApprovalDialog({ open, onClose, onApprove, procurement }) {
    const classes = useStyles();
    const [paymentType, setPaymentType] = useState('Full');
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const loginState = useContext(LoginContext);

    useEffect(() => {
        if (procurement) {
            if (procurement.paymentType) {
                setPaymentType(procurement.paymentType);
            }
            if (procurement.approvedAmount) {
                setAmount(procurement.approvedAmount.toString());
            }
            if (procurement.remarks) {
                setRemarks(procurement.remarks);
            }
        }
    }, [procurement]);

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
        onApprove({
            procurementId: procurement._id,
            paymentType,
            amount: paymentType === 'part' ? parseFloat(amount) : null,
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
                                value="Full"
                                control={<Radio />}
                                label="Full Payment"
                            />
                            <FormControlLabel
                                value="Part"
                                control={<Radio />}
                                label="Part Payment"
                            />
                        </RadioGroup>
                    </FormControl>

                    {paymentType === 'Part' && (
                        <TextField
                            className={classes.amountField}
                            label="Amount"
                            type="number"
                            value={amount}
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
                        variant="outlined"
                        fullWidth
                        placeholder="Add any additional remarks about the approval"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button 
                    onClick={handleApprove} 
                    color="primary" 
                    variant="contained"
                    disabled={paymentType === 'part' && (!amount || parseFloat(amount) > (procurement?.total || 0))}
                >
                    Approve
                </Button>
            </DialogActions>
        </Dialog>
    );
} 