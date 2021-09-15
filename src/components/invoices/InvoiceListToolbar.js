import {
	Box,
	Button,
	Grid,
	Card,
	CardContent,
	TextField,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import invoiceFields from '../../statics/invoiceFields';
import FiltersDialog from '../FiltersDialog';
import PasswordDialog from '../passwordDialog';
import React from 'react';

const CustomerListToolbar = (props) => {

	const [open, setOpen] = React.useState(false)

	const getExport = async () => {
		setOpen(true)
	}

	return (
		<Box {...props}>
		<PasswordDialog handleExport={props.handleExport} open={open} setOpen={setOpen} />
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
				<Link to="/app/invoices/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Invoice
					</Button>
				</Link>
				<Button sx={{mx: 1}} variant="contained" onClick={getExport}>
					Export
				</Button>
			</Box>
			<Box sx={{mt: 1}}>
				<Card>
					<CardContent>
						<Box>
							<Grid container spacing={2}>
								<Grid item md={4} xs={6}>
									<TextField
										fullWidth
										label="Search"
										id="text"
										value={props.searchInfo["text"]}
										onChange={({target}) => props.setSearch({...props.searchInfo, text:target.value})}
										variant="standard"
									/>
								</Grid>
								<Grid item item md={4} xs={6}>
									<FiltersDialog search={props.searchInfo} setSearch={props.setSearch} type={'all'} fields={invoiceFields}/>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default CustomerListToolbar;
