import {
	Box, Button, Grid, Card,
	CardContent, TextField, InputAdornment,
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import FiltersDialog from '../FiltersDialog';
import PasswordDialog from '../passwordDialog';
import React from 'react';
import packageFields from 'src/statics/packageFields';

const PackagesListToolbar = (props) => {

	const [open, setOpen] = React.useState(false)

	const getExport = async () => {
		setOpen(true)
	}

	return (
		<Box {...props}>
		<PasswordDialog protectedFunction={props.handleExport} open={open} setOpen={setOpen} />
			<Box sx={
				{
					display: 'flex',
					justifyContent: 'flex-end'
				}
			}>
				<Link to="/app/packages/add">
					<Button sx={{mx: 1}} variant="contained">
						Add Package
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
							<Grid container spacing={1}>
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
									<FiltersDialog forView="packages" search={props.searchInfo} setSearch={props.setSearch} type={'all'} fields={packageFields}/>
								</Grid>
							</Grid>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
};

export default PackagesListToolbar;
