import React, { useState, useEffect } from 'react';
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
    Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
    }
}));

export default function ApprovalDialog({ open, onClose, onApprove, procurement }) {
    const classes = useStyles();
    const [paymentType, setPaymentType] = useState('full');
    const [amount, setAmount] = useState('');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        if (procurement) {
            // If there's existing payment information, set it
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
        // Reset amount when switching to full payment
        if (event.target.value === 'full') {
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                            />
                            <FormControlLabel
                                value="part"
                                control={<Radio />}
                                label="Part Payment"
                            />
                        </RadioGroup>
                    </FormControl>

                    {paymentType === 'part' && (
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


                    <Grid item md={6} xs={12}>
                        <Typography variant="h5">Remarks History</Typography>

                        {procurement?.existingRemarks?.length && <List>
                            {procurement?.existingRemarks?.map((remarks) => (<ListItem>
                                    <Typography variant='body2'>{remarks}</Typography>
                                </ListItem>))}
                        </List>}
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