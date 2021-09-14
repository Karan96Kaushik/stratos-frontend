import React from 'react';
import {
	Button, IconButton, Paper,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions,
    TableCell, TableBody, TableContainer,
    TableRow, Table, TableHead,
    TableFooter
} from '@material-ui/core';
import { Description, FindInPage, PanoramaFishEye, ViewAgendaRounded, Visibility } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
        marginTop:20,
        marginBottom:20,
	},
    title: {
        fontWeight:1000
	},
}));

export default function ViewDialog({ data, fields, otherFields, typeField, titleID }) {
	const [open, setOpen] = React.useState(false)
	const classes = useStyles();

    if(!typeField)
        fields = fields["all"]
    else
        fields = fields[data[typeField]]

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(true)}>
                <Description />
            </IconButton>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={open} 
				onClose={handleClose} 
				aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">
                    <Typography variant="h4">
                        {data[titleID]}
                    </Typography>
                </DialogTitle>
				<DialogContent>

                    <TableContainer component={Paper}>
                        <Table className={classes.root}>
                            <TableHead>
                                <TableRow>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    {otherFields && otherFields?.map(field => !field.isHidden ? (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.name}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id]}</TableCell>
                                        </TableRow>   
                                    ) : <></>)}
                                    {fields && fields?.texts?.map(field => !field.isHidden ? (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.label}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id]}</TableCell>
                                        </TableRow>   
                                    ) : <></>)}
                                    {fields && fields?.checkboxes?.map(field => (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.label}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id] ? "Y" : "N"}</TableCell>
                                        </TableRow>   
                                    ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>

                                </TableRow>
                                </TableFooter>
                        </Table>
                    </TableContainer>
                
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Done
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
