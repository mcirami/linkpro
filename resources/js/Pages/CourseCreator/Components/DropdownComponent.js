import React, {useState} from 'react';
import {FormControl, InputLabel, Select} from '@mui/material';
import {updateData} from '../../../Services/CourseRequests';
import {LP_ACTIONS} from '../Reducer';

const categories = user.categories;
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';

const DropdownComponent = ({
                               id,
                               dispatch,
                               value
}) => {

    const [selectedCategory, setSelectedCategory] = useState(value)

    const handleChange = (e) => {

        const value = e.target.value;
        const packets = {
            category: value
        }

        console.log(e.target.dataset.parent)

        updateData(packets, id)
        .then((response) => {

            if(response.success) {
                dispatch({
                    type: LP_ACTIONS.UPDATE_PAGE_DATA,
                    payload: {
                        value: value,
                        name: "category"
                    }
                })
            }
        });
    }

    return (
        <div className="edit_form">
            {/*<div className="custom_select">
                <   label>Select Category</label>
                <ul className="list-unstyled">
                    {categories?.map((category) => {

                        const {id, name, children, parent_id} = category;

                        return (
                            <React.Fragment key={id}>
                                {!parent_id && <li value={id}>{name}</li>}
                                {children.length > 0 &&

                                    children.map((child) => {

                                        const {id, name} = child;

                                        return (
                                            <li key={id} style={{ paddingLeft: '20px'}} value={id}>{name}</li>
                                        )
                                    })
                                }
                            </React.Fragment>
                        )
                    })}
                </ul>
            </div>*/}
            <FormControl fullWidth>
                <InputLabel id="category_select_label">Select Category</InputLabel>
                <Select
                    native
                    labelId="category_select_label"
                    id="category_select"
                    label="Select Category"
                    defaultValue={selectedCategory}
                    onChange={(e) => handleChange(e)}
                >
                    <option value=""></option>
                    {categories?.map((category) => {

                        const {id, name, children, parent_id} = category;

                        return (

                            children.length > 0 ?
                                <optgroup key={id} label={name} data-parent={parent_id}>
                                    {children.map((child) => {
                                        const {id, name} = child;
                                        return (
                                            <option key={id} value={id}>{name}</option>
                                        )
                                    })}
                                    <option key={children.length} value={id}>Other {name}</option>
                                </optgroup>

                                :
                                <option key={id} value={id}>{name}</option>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    );

};

export default DropdownComponent;
