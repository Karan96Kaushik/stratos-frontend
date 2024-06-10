import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	Box,
	Card,
	CardHeader,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const hoverStyle = (pointer) => ({
	'&:hover': {
		backgroundColor: '#f5f5f5', // This is the color you want on hover
		cursor: pointer ? 'pointer' : undefined,
	  }
})

const renderRow = (data, fields, navigate, linkpre, linkfield) => {

	const activeLink = (linkpre + data[linkfield])?.length > 0

	const openLink = () => {
		if (activeLink)
			navigate(linkpre + data[linkfield])
		console.debug(linkpre + data[linkfield])
	}

	return (
		<>
			<TableRow sx={activeLink ? hoverStyle : {}} onClick={openLink} >
				{fields.map((f) => (
					<TableCell>
						{data?.[f.id]}
					</TableCell>
				))}
			</TableRow>
		</>
	)
}

const GeneralListCard = ({title, data, fields, linkpre, linkfield}) => {

	console.debug(linkfield, linkpre)
	const navigate = useNavigate();

	return (
		<Card>
			<CardHeader title={title} />
			<Divider />
			<PerfectScrollbar>
			<Box sx={{ maxWidth: 800 }}>
				<Table size="small">
					<TableHead>
						<TableRow >
							{fields.map(f => (
								<TableCell>
									{f.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{data?.map(d => renderRow(d, fields, navigate, linkpre, linkfield))}
					</TableBody>
				</Table>
			</Box>
			</PerfectScrollbar>
			{/* <Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					p: 2
				}}
			>
			</Box> */}
		</Card>
	)};
	
	export default GeneralListCard;
	