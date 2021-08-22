import { Doughnut } from 'react-chartjs-2';
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Typography,
	colors,
	useTheme,
	Grid
} from '@material-ui/core';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import PhoneIcon from '@material-ui/icons/Phone';
import TabletIcon from '@material-ui/icons/Tablet';

const TrafficByDevice = (props) => {
	const theme = useTheme();

	const data = {
	datasets: [
		{
		data: props.data?.values,
		backgroundColor: [
			colors.indigo[500],
			colors.red[600],
			colors.green[600],
			colors.blue[600],
			colors.pink[600],
			colors.orange[600],
			colors.yellow[600],
		],
		borderWidth: 8,
		borderColor: colors.common.white,
		hoverBorderColor: colors.common.white
		}
	],
	labels: props.data?.labels
	};

	const devices = (data.labels ?? []).map((label, i) => ({
		title: label,
		color: data.datasets[0].backgroundColor[i],
		value: data.datasets[0].data[i],
		// icon: LaptopMacIcon,
		// color: colors.indigo[500]
	}))

	const options = {
	animation: false,
	cutoutPercentage: 80,
	layout: { padding: 0 },
	legend: {
		display: false
	},
	maintainAspectRatio: false,
	responsive: true,
	tooltips: {
		backgroundColor: theme.palette.background.paper,
		bodyFontColor: theme.palette.text.secondary,
		borderColor: theme.palette.divider,
		borderWidth: 1,
		enabled: true,
		footerFontColor: theme.palette.text.secondary,
		intersect: false,
		mode: 'index',
		titleFontColor: theme.palette.text.primary
	}
	};

	return (
	<Card {...props}>
		<CardHeader title="Tasks by Status" />
			<Divider />
		<CardContent>
		<Box sx={{ height: 300, position: 'relative' }} >
			<Doughnut data={data} options={options} />
		</Box>
		<Grid container spacing={0}>
			{devices.map(({
				color,
				title,
				value
			}) => (
				<Grid item md={2} xs={4} lg={2}>
					<Box key={title} sx={{ p: 1, textAlign: 'center' }} >
						{/* <Icon color="action" /> */}
						<Typography style={{ color }} variant="h3" >
							{value}
						</Typography>
						<Typography color="textPrimary" variant="h6" >
							{title}
						</Typography>
					</Box>
				</Grid>
			))}
		</Grid>
		</CardContent>
	</Card>
	);
};

export default TrafficByDevice;
