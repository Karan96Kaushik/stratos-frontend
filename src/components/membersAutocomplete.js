import React from 'react';
import { Autocomplete, TextField, Checkbox } from '@material-ui/core';

const MembersAutocomplete = ({ _label, title, memberRows, values, setValues, DepatmentOnly }) => {

    const handleMembersChange = (event, newValue) => {
		const selectedMembers = newValue.flatMap(member => {
			if (member.isDept) {
				// If it's a department, include all members of that department
				const departmentName = member.userName.split(" Department")[0];
				return memberRows.filter(m => m.department === departmentName && !m.isDept);
			}
			return member;
		});

		const selectedIds = selectedMembers.map(member => member._id || member.userName);
		const selectedNames = selectedMembers.map(member => member.userName);

        const label = _label.split("_")[1]

		setValues(prevValues => ({
			...prevValues,
			[_label]: selectedIds,
			[label]: selectedNames.join(", ")
		}));
	};

    return (
        <Autocomplete
            multiple
            id={_label}
            options={DepatmentOnly ? memberRows.filter(member => member.isDept) : memberRows}
            getOptionLabel={(option) => option.userName}
            value={memberRows.filter(member => 
                (values?.[_label] || []).includes(member._id) || 
                (values?.[_label] || []).includes(member.userName)
            )}
            onChange={handleMembersChange}
            renderInput={(params) => (
                <TextField
                {...params}
                variant="outlined"
                label={title}
                placeholder="Search and select members"
                />
            )}
            filterOptions={(options, { inputValue }) => {
                const searchTerm = inputValue.toLowerCase();
                if (searchTerm === "") {
                    return options.filter(option => option.isDept);
                }
                return options.filter(option => 
                    option.userName.toLowerCase().includes(searchTerm)
                );
            }}
            renderOption={(props, option, { selected }) => (
                <li {...props} style={{paddingLeft: option.isDept ? 0 : 20}}>
                <Checkbox
                    style={{ marginRight: 8 }}
                    checked={selected}
                />
                {option.userName}
                </li>
            )}
        />
    );
};

export default MembersAutocomplete;
