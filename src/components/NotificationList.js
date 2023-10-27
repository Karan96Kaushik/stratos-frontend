import { useNavigate } from 'react-router-dom'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import {
	// AlertCircle,
	// BarChart,
	// Lock,
	// Settings,
	CheckSquare,
    AlertCircle,
	// Flag,
	// Mail,
	// FileText,
	DollarSign,
	Package,
	// CheckCircle,
	// ShoppingBag,
	// User,
	// UserPlus,
	// Users,
	// Calendar,
	// Info,
	// File,
	// ArrowDownCircle
} from 'react-feather';
import moment from 'moment'

const serialize = function(obj) {
	var str = [];
	for (var p in obj)
	  if (obj.hasOwnProperty(p)) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	  }
	return str.join("&");
  }

const NotificationList = ({notifications}) => {

	const navigate = useNavigate();

    const handleClick = (n) => {
        console.log("/app/" + (typeRoute[n.type] ?? n.type) + "?" + serialize({text:n.id}))
        navigate("/app/" + (typeRoute[n.type] ?? n.type) + "?" + serialize({text:n.id}));
    }

    const typeIcons = {
        'task': <CheckSquare/>,
        'taskaccounts': <DollarSign/>,
        // 'client': User,
        'package': <Package/>,
        'packageaccounts': <DollarSign/>,
        'payment': <DollarSign/>,
        'tickets': <AlertCircle/>,
    }

    const typeRoute = {
        'task': 'tasks',
        'taskaccounts': 'taskaccounts',
        // 'client': User,
        'package': 'packages',
        'packageaccounts': 'package/accounts',
        'payment': 'payments',
    }

	return (
        <>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 'auto' }} aria-label="simple table">
            <TableBody>
            {notifications.map((notif) => (
                <TableRow
                    // key={'ABCDEF' + notif.type}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={() => handleClick(notif)}>
                    <TableCell component="th" scope="row">
                        {typeIcons[notif.type]}
                    </TableCell>
                    <TableCell align="left">{notif.text}</TableCell>
                    <TableCell align="right">{notif.id}</TableCell>
                    <TableCell align="right">{moment(notif.createdTime).format('hh:mm DD/MM')}</TableCell>
                    {/* <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell> */}
                </TableRow>
            ))}
            {!notifications.length &&
                <TableRow>
                    <TableCell align="left">No Notifications Yet</TableCell>
                </TableRow>
            }
            </TableBody>
        </Table>
        </TableContainer>
        </>
    )
}

export default NotificationList



