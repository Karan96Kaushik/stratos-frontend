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

const renderRow = (data, fields) => {
	return (
		<>
			<TableRow >
				{fields.map((f) => (
					<TableCell>
						{data?.[f.id]}
					</TableCell>
				))}
			</TableRow>
		</>
	)
}

const GeneralListCard = ({title, data, fields}) => {
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
						{data?.map(d => renderRow(d, fields))}
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
	