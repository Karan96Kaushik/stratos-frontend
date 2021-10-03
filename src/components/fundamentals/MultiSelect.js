import React from 'react';
import {
	FormControl, InputLabel, Select,
    MenuItem, ListItemText, Input,
	Checkbox, FormControlLabel
} from '@material-ui/core';

export default function MultiSelect({handleChange, options, value, id, name}) {
    const handleSelect = (e) => {
        console.log({target: {
            value: e.target.value,
            id:id,
            multiSelect:true
        }})

        handleChange({target: {
            value: e.target.value,
            id:id,
            multiSelect:true
        }})
    }
	return (
        <FormControl fullWidth>	
            <InputLabel id={id}>{name}</InputLabel>
            <Select 
                multiple 
                fullWidth
                id={name}
                value={Array.isArray(value) ? value : []}
                onChange={handleSelect}
                input={<Input placeholder={name}/>}
                renderValue={(s) => (value ?? []).filter(Boolean).join(", ")}
            >
                {options.filter(Boolean).map((option) => (
                    <MenuItem value={option}>
                        <Checkbox checked={Array.isArray(value) ? (value ?? []).includes(option) : false} />
                        <ListItemText primary={option} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

	);
}