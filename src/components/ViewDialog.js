import React from 'react';
import {
	Button, IconButton, Paper,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions,
    TableCell, TableBody, TableContainer,
    TableRow, Table, TableHead,
    TableFooter
} from '@material-ui/core';
import { PanoramaFishEye } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		margin:20,
		padding:10,
	},
    title: {
        fontWeight:1000
	},
}));

export default function FiltersDialog({ data, fields, otherFields, typeField }) {
	const [open, setOpen] = React.useState(false)
	const classes = useStyles();

    fields = fields[data[typeField]]

    console.log("VIEW", fields)

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(true)}>
                <PanoramaFishEye />
            </IconButton>
			<Dialog
				fullWidth={true}
				maxWidth={'md'}
				open={open} 
				onClose={handleClose} 
				aria-labelledby="form-dialog-title">
					
				<DialogTitle id="form-dialog-title">{"View Data"}</DialogTitle>
				<DialogContent className={classes.root}>
					<Grid container spacing={3}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    {otherFields && otherFields?.map(field => !field.isHidden ? (
                                        <TableRow>
                                            <TableCell className={classes.title} align="left"><Typography variant="h5">{field.name}</Typography></TableCell>
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
                
					</Grid>

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
