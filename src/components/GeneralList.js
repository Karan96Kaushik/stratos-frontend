import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
// import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import {Link} from "react-router-dom"

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

function Row({ row, type, fields, extraFields }) {
	const classes = useRowStyles();

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				{(fields[type]?.texts?.length && extraFields?.length) ? extraFields.map((field) => (<TableCell align="left">{row[field.id]}</TableCell>)) : <></>}
				{fields[type]?.texts.map(field => <TableCell align="left">{row[field.id]}</TableCell>)}
				{fields[type]?.checkboxes.map(field => <TableCell align="left">{row[field.id] ? "Y" : "N"}</TableCell>)}
				<TableCell>
					<Link to={"edit/" + row._id}>
						<IconButton aria-label="expand row" size="small">
							<Edit />
						</IconButton>
					</Link>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

const useStyles1 = makeStyles((theme) => ({
	root: {
		// flexShrink: 1,
		// marginLeft: 0,
		display:"flex",
		flex:1,
		flexDirection:"row",
	},
}));

  
function TablePaginationActions(props) {
	const classes = useStyles1();
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;
	const onChangePage = onPageChange
  
	const handleFirstPageButtonClick = (event) => {
		onChangePage(event, 0);
	};
  
	const handleBackButtonClick = (event) => {
		onChangePage(event, page - 1);
	};
  
	const handleNextButtonClick = (event) => {
		onChangePage(event, page + 1);
	};
  
	const handleLastPageButtonClick = (event) => {
		onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	console.log(count)
  
	return (
	  <div className={classes.root}>
		<IconButton
		  onClick={handleFirstPageButtonClick}
		  disabled={page === 1}
		  aria-label="first page"
		>
		  <FirstPageIcon />
		</IconButton>
		<IconButton onClick={handleBackButtonClick} disabled={page === 1} aria-label="previous page">
			<KeyboardArrowLeft />
		</IconButton>
		<IconButton
		  onClick={handleNextButtonClick}
		  disabled={count < rowsPerPage}
		  aria-label="next page"
		>
			<KeyboardArrowRight />
		</IconButton>
		<IconButton
		  onClick={handleLastPageButtonClick}
		  disabled={page >= Math.ceil(count / rowsPerPage) - 1}
		  aria-label="last page"
		>
			<LastPageIcon />
		</IconButton>
	  </div>
	);
  }

export default function CollapsibleTable({extraFields, fields, data, page, setPage, setRowsPerPage, rowsPerPage, type}) {
	const {rows} = data;

	const handleChangePage = (event, newPage) => {
	  setPage(newPage);
	};
  
	const handleChangeRowsPerPage = (event) => {
	  setRowsPerPage(parseInt(event.target.value, 10));
	  setPage(1);
	};

	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						{(fields[type]?.texts?.length && extraFields.length) ? extraFields.map((field) => (<TableCell align="left">{field.name}</TableCell>)) : <></>}
						{fields[type]?.texts.map(field => <TableCell align="left">{field.label}</TableCell>)}
						{fields[type]?.checkboxes.map(field => <TableCell align="left">{field.label}</TableCell>)}
						<TableCell align="left"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<Row 
							extraFields={extraFields} 
							fields={fields} 
							row={row} 
							type={type} 
						/>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePaginationActions
							rowsPerPageOptions={[25, 50, 100]}
							colSpan={0}
							count={rows.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							ActionsComponent={TablePaginationActions}
						/>
					</TableRow>
					</TableFooter>
			</Table>
		</TableContainer>
	);
}