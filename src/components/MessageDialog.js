import React from 'react';
import {
	Button, Typography,
	Dialog, DialogTitle,
	DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
// import './MessageDialog.css'

export default function MessageDialog({ message, setMessage }) {
	
	const handleClose = (o) => {
		setMessage({...message, open:false});
		if (message.resolveExternal || message.rejectExternal) {
			if (message.options?.includes(o))
				message.resolveExternal(o)
			else if (message.rejectExternal)
				message.rejectExternal(new Error('No option selected'))
		}
	};
	
	return (
		<div>
		<Dialog
			open={message.open}
			onClose={handleClose}
		>
			<DialogTitle>
				<Typography variant="h4">
					{message.title}
				</Typography>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{message.content}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{message.options?.length ? message.options?.map(o => <Button color="primary" variant="outlined"  key={o} onClick={_e => handleClose(o)}>
					{o}
				</Button>) : <Button onClick={handleClose} color="primary" variant="contained">
					Done
				</Button>}
			</DialogActions>
		</Dialog>
		</div>
		);
	}
