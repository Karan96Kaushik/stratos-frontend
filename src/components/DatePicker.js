import { IconButton, Popover, Typography } from "@material-ui/core"
import { DateRangePicker } from "materialui-daterange-picker"
import moment from "moment";
import { useState, useRef } from "react";
import { Calendar } from "react-feather";


export default ({setDateRange, dateRange}) => {
	const anchorRef = useRef(null);  // Reference to the button

	const [open, setOpen] = useState(false);
	const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>

            <IconButton ref={anchorRef}
                variant="contained" 
                color="primary" 
                onClick={handleToggle}>

                <Typography color="textSecondary" gutterBottom variant="h5" sx={{padding:1, margin:0}} textAlign={'center'}>
                    {moment((dateRange.startDate)).format("DD-MM-YYYY")} - {moment((dateRange.endDate)).format("DD-MM-YYYY")}
                </Typography> 
                <Calendar />

            </IconButton> 
            <Popover
                open={open}
                anchorEl={anchorRef.current}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                
                <DateRangePicker
                    initialDateRange={dateRange}
                    className="date-range-picker"
                    open={open}
                    toggle={handleClose}
                    onChange={range => setDateRange(range)}
                />

            </Popover>
        </>)
}