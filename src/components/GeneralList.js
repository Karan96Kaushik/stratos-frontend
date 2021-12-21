import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {Typography} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import _ from 'lodash';
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
	high: {
		color: "red"
	},
	medium: {
		color: "#E1AD01"
	},
	low: {
	}
});

function Row({ row, type, fields, extraFields, additional, defaultFields, disableEdit }) {
	const classes = useRowStyles();
	// Filter out the ones not hidden in table view

	let fieldsShow = _.merge({}, fields[type])
	if(!type && defaultFields)
		fieldsShow = defaultFields
	if(type?.length)
		fieldsShow.texts = fieldsShow?.texts.filter(val => !val.isHidden)

	const flagColor = (id) => {
		if(row[id + "Color"] == 1)
			return "medium"
		if(row[id + "Color"] == 2)
			return "high"
		return "low"
	}

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				{/* Mount Extra Fields - fileds that are not entered by user */}
				{(fieldsShow?.texts?.length && extraFields?.length) ? extraFields.map((field) => (<TableCell align="left">{row[field.id]}</TableCell>)) : <></>}
				{/* Mount Main Fields - enterd by user */}
				{fieldsShow?.texts.map(field => <TableCell align="left">
					<Typography name={field.id} variant="header" className={classes[flagColor(field.id)]}>{row[field.id]}</Typography>
				</TableCell>)}
				{/* Mount Checkboxes */}
				{fieldsShow?.checkboxes.map(field => <TableCell align="left">{row[field.id] ? "Y" : "N"}</TableCell>)}
				{additional?.map(func => (<TableCell>{func(row)}</TableCell>))}
				{/* <TableCell>
					<Link to={"view/" + row._id}>
						<IconButton aria-label="expand row" size="small">
							<ViewAgenda />
						</IconButton>
					</Link>
				</TableCell> */}
				{!disableEdit && <TableCell>
					<Link to={"edit/" + row._id}>
						<IconButton aria-label="expand row" size="small">
							<Edit />
						</IconButton>
					</Link>
				</TableCell>}
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

	// console.log(count)
  
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

export default function CollapsibleTable({extraFields, fields, defaultFields, data, page, setPage, setRowsPerPage, rowsPerPage, type, sortState, setSortState, additional, disableEdit}) {
	const {rows} = data;
	// const [] = useState({id:'createdTime', direction:-1})

	const handleChangePage = (event, newPage) => {
	  setPage(newPage);
	};
  
	const handleChangeRowsPerPage = (event) => {
	  setRowsPerPage(parseInt(event.target.value, 10));
	  setPage(1);
	};

	const setSort = (event) => {
		let direction = null;
		let sortId = event.target.attributes?.name?.nodeValue

		if(sortId != sortState.sortID)
			direction = -1
		else
			if(sortState.sortDir == -1)
				direction = 1
			if(!sortState.sortDir)
				direction = -1

		setSortState({sortID: sortId, sortDir: direction})
	}

	const sortColor = (id) => {
		if(sortState.sortID == id)
			if(sortState.sortDir == 1)
				return "secondary"
			else if (sortState.sortDir == -1)
				return "primary"
		return "text"
	}

	let fieldsShow = _.merge({}, fields[type])
	if(!type && defaultFields)
		fieldsShow = defaultFields
	if(type?.length)
		fieldsShow.texts = fieldsShow?.texts.filter(val => !val.isHidden)
	
	// console.log(fields[type], fieldsShow)
	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						{(fieldsShow?.texts?.length && extraFields.length) ? extraFields.map((field) => (<TableCell name={field.id} onClick={setSort} align="left"><Typography name={field.id} variant="header" color={sortColor(field.id)}>{field.name}</Typography></TableCell>)) : <></>}
						{fieldsShow?.texts.map(field => <TableCell name={field.id} onClick={setSort} align="left"><Typography name={field.id} variant="header" color={sortColor(field.id)}>{field.label}</Typography></TableCell>)}
						{fieldsShow?.checkboxes.map(field => <TableCell align="left">{field.label}</TableCell>)}
						<TableCell align="left"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<Row 
							extraFields={extraFields} 
							defaultFields={defaultFields} 
							fields={fields} 
							row={row} 
							type={type} 
							additional={additional}
							disableEdit={disableEdit}
						/>
					))}
				</TableBody>
				</Table>
				{/* <TableFooter> */}
					{/* <TableRow> */}
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
					{/* </TableRow> */}
					{/* </TableFooter> */}
		</TableContainer>
	);
}