import React, { useRef } from 'react';
import {
	Button, IconButton, Paper,
	Dialog, DialogTitle, Grid,
	DialogContent, DialogActions,
    TableCell, TableBody, TableContainer,
    TableRow, Table, TableHead,
    TableFooter
} from '@material-ui/core';
import { Description, FindInPage, PanoramaFishEye, ViewAgendaRounded, Visibility, PictureAsPdf } from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const useStyles = makeStyles((theme) => ({
	root: {
        marginTop:20,
        marginBottom:20,
	},
    title: {
        fontWeight:1000
	},
    pdfButton: {
        marginRight: theme.spacing(1),
    },
    pdfContainer: {
        padding: theme.spacing(2),
        '@media print': {
            padding: 0,
        }
    },
    printOnly: {
        '@media screen': {
            display: 'none'
        }
    }
}));

export default function ViewDialog({ data, fields, otherFields, typeField, titleID }) {
	const [open, setOpen] = React.useState(false)
	const classes = useStyles();
    const pdfRef = useRef();

    if(!typeField)
        fields = fields["all"]
    else
        fields = fields[data[typeField]]

	const handleClose = () => {
		setOpen(false);
	};

    const handleExportPDF = async () => {
        const element = pdfRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${data[titleID]}.pdf`);
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
                    <div ref={pdfRef} className={classes.pdfContainer}>
                        <TableContainer component={Paper}>
                            <Table className={classes.root}>
                                <TableHead>
                                    <TableRow>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {otherFields && otherFields?.map(field => (!field.isHidden && field.type != "array" && field.type != "boolean") ? (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.name}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id]}</TableCell>
                                        </TableRow>   
                                    ) : <></>)}
                                    {fields && fields?.texts?.map(field => !field.isHidden && field.type !== "array" ? (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.label}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id]}</TableCell>
                                        </TableRow>   
                                    ) : <></>)}
                                    {fields && fields?.texts?.map(field => (!field.isHidden && field.type == "array" && field.type != "boolean") ? (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.label}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id]?.map((v) => (<>{v}<br /></>))}</TableCell>
                                        </TableRow>   
                                    ) : <></>)}
                                    {fields && fields?.checkboxes?.map(field => (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.label}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id] ? "Y" : "N"}</TableCell>
                                        </TableRow>   
                                    ))}
                                    {otherFields && otherFields?.map(field => (!field.isHidden && field.type == "array" && field.type != "boolean") ? (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.name}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id]?.map((v) => (<>{v}<br /></>))}</TableCell>
                                        </TableRow>   
                                    ) : <></>)}
                                    {otherFields && otherFields?.map(field => (!field.isHidden && field.type == "boolean") ? (
                                        <TableRow>
                                            <TableCell align="left"><Typography variant="h5">{field.name}</Typography></TableCell>
                                            <TableCell align="left">{data[field.id] ? "Y" : "N"}</TableCell>
                                        </TableRow>   
                                    ) : <></>)}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
				</DialogContent>
				<DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PictureAsPdf />}
                        onClick={handleExportPDF}
                        className={classes.pdfButton}
                    >
                        Export PDF
                    </Button>
					<Button onClick={handleClose} color="primary">
						Done
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
