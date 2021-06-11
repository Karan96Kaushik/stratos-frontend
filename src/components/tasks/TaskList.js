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
import taskFields from '../../statics/taskFields';

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

function Row(props) {
	const { row, type } = props;
	const [open, setOpen] = React.useState(false);
	const classes = useRowStyles();

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				{taskFields[type]?.texts?.length ? <TableCell align="left">{row.taskID}</TableCell> : <></>}
				{taskFields[type]?.texts?.length ? <TableCell align="left">{row.clientName}</TableCell> : <></>}
				{taskFields[type]?.texts.map(field => <TableCell align="left">{row[field.id]}</TableCell>)}
				{taskFields[type]?.checkboxes.map(field => <TableCell align="left">{row[field.id] ? "Y" : "N"}</TableCell>)}
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

export default function CollapsibleTable({data}) {
	const {rows, type} = data;
	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						{taskFields[type]?.texts?.length ? <TableCell align="left">Task ID</TableCell> : <></>}
						{taskFields[type]?.texts?.length ? <TableCell align="left">Client Name</TableCell> : <></>}
						{taskFields[type]?.texts.map(field => <TableCell align="left">{field.label}</TableCell>)}
						{taskFields[type]?.checkboxes.map(field => <TableCell align="left">{field.label}</TableCell>)}
						
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