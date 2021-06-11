import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Edit from '@material-ui/icons/Edit';
import {Link} from "react-router-dom"
import leadFields from '../../statics/leadFields';

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

function Row(props) {
	const { row, type } = props;
	const classes = useRowStyles();
	
	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				{leadFields[type]?.texts?.length ? <TableCell align="left">{row.leadID}</TableCell> : <></>}
				{leadFields[type]?.texts?.length ? <TableCell align="left">{row.memberID}</TableCell> : <></>}
				{leadFields[type]?.texts.map(field => <TableCell align="left">{row[field.id]}</TableCell>)}
				{leadFields[type]?.checkboxes.map(field => <TableCell align="left">{row[field.id] ? "Y" : "N"}</TableCell>)}
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

export default function CollapsibleTable({data, search}) {
	const {rows} = data;
	const {leadType:type} = search;

	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						{leadFields[type]?.texts?.length ? <TableCell align="left">Lead ID</TableCell> : <></>}
						{leadFields[type]?.texts?.length ? <TableCell align="left">Member ID</TableCell> : <></>}
						{leadFields[type]?.texts.map(field => <TableCell align="left">{field.label}</TableCell>)}
						{leadFields[type]?.checkboxes.map(field => <TableCell align="left">{field.label}</TableCell>)}
						<TableCell align="left"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<Row key={row.userName} row={row} type={type} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}