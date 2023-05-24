import React from 'react';
import {FormControl, InputLabel, Select} from '@mui/material';

const DropdownComponent = ({
                               data,
                               setSearchInput,
                               iconList,
                               setFilteredIcons,
                               setFilteredByCat
}) => {

    const handleChange = (e) => {

        setSearchInput("");
        const value = e.target.value.toLowerCase();

        if (value === "all") {
            setFilteredByCat(iconList);
            setFilteredIcons(iconList);
        } else {

            const filtered = iconList.filter((icon) => {
                return icon.categories.find((el) => el.match(value));
            })
            setFilteredByCat(filtered)
            setFilteredIcons(filtered);
        }
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="category_select_label">Filter By Category</InputLabel>
            <Select
                native
                labelId="category_select_label"
                id="category_select"
                label="Select Category"
                defaultValue="all"
                onChange={(e) => handleChange(e)}
            >
                <option value="all">All</option>
                {data?.map((category) => {

                    const {id, name, children, parent_id} = category;

                    return (

                        children.length > 0 ?
                            <optgroup key={id} label={name} data-parent={parent_id}>
                                <option key={children.length} value={name}>All {name}</option>
                                {children.map((child) => {
                                    const {id, name} = child;
                                    return (
                                        <option key={id} value={name}>{name}</option>
                                    )
                                })}
                            </optgroup>

                            :
                            <option key={id} value={id}>{name}</option>
                    )
                })}
            </Select>
        </FormControl>
    );
};

export default DropdownComponent;
