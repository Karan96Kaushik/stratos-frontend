// import moment from 'moment';
// import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
	Box,
	Button,
	Card,
	CardHeader,
	Chip,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel,
	Tooltip
} from '@material-ui/core';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';

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
	