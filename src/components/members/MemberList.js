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
import {Link, useQuery} from "react-router-dom"

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

function Row(props) {
	const { row } = props;
	const classes = useRowStyles();

	return (
		<React.Fragment>
			<TableRow className={classes.root}>

				<TableCell component="th" scope="row" align="left">{row.memberID}</TableCell>
				<TableCell component="th" scope="row" align="left">{row.userName}</TableCell>
				<TableCell align="left">{row.email}</TableCell>
				<TableCell align="left">{row.phone}</TableCell>
				<TableCell align="left">{row.designation}</TableCell>
				<TableCell align="left">{row.startDate}</TableCell>
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

export default function CollapsibleTable({rows}) {
	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell align="left">Member ID</TableCell>
						<TableCell align="left">Name</TableCell>
						<TableCell align="left">Email</TableCell>
						<TableCell align="left">Mobile</TableCell>
						<TableCell align="left">Designation</TableCell>
						<TableCell align="left">Start Date</TableCell>
						<TableCell align="left"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<Row key={row.userName} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}