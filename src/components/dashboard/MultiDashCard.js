import {
	Avatar, Box, Card,
	CardContent, CardHeader, Grid, Typography
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoneyIcon from '@material-ui/icons/Money';
import { red } from '@material-ui/core/colors';

const MultiDashCard = (props) => {

	const data = props.data
	const fields = props.fields

	return (
	<Card sx={{ height: '100%',  }} {...props} >
		<CardHeader title={props.title} sx={{paddingBottom:0}}/>
		<CardContent  sx={{paddingLeft:4}}>
			<Grid container spacing={3} sx={{ justifyContent: 'space-between' }} >
				{fields.map(d => <><Grid item>
					<Typography color="textSecondary" gutterBottom variant="h5" >
						{d.title}
					</Typography>
					<Typography color="textPrimary" variant="h3">
						{data?.[d.title]}
					</Typography>
				</Grid>
				<Grid item>
					{/* <Avatar sx={{ backgroundColor: props.iconColor, height: 56, width: 56 }}>
						{props.icon}
					</Avatar> */}
				</Grid></>)}
				
			</Grid>
			<Box sx={{ pt: 2, display: 'flex', alignItems: 'center' }}>
				{/* <ArrowDownwardIcon sx={{ color: red[900] }}/> */}
				<Typography sx={{ color: red[900], mr: 1 }} variant="body2">
				</Typography>
				<Typography color="textSecondary" variant="caption" >
					{props.body}
					{/* Since last month */}
				</Typography>
			</Box>
		</CardContent>
	</Card>
)};

export default MultiDashCard;
