import React, {useEffect, useRef, useState} from 'react';
import {updateData} from '../../../Services/CourseRequests';
import {LP_ACTIONS} from '../Reducer';
import {HandleFocus, InputEventListener, HandleBlur} from '../../../Utils/InputAnimations';

const categories = user.categories;

const DropdownComponent = ({
                               id,
                               dispatch,
                               value
}) => {

    const [selectedCategory, setSelectedCategory] = useState(value)


    const myRef = useRef(null);

    useEffect(() => {

        InputEventListener(myRef.current);

    },[])

    const handleChange = (e) => {

        const value = e.target.value;
        const packets = {
            category: value
        }

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
            <select
                ref={myRef}
                id="category_select"
                defaultValue={selectedCategory}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => HandleBlur(e.target)}
                onFocus={(e) => HandleFocus(e.target)}
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
            </select>
            <label id="category_select_label">Select Category</label>

        </div>
    );

};

export default DropdownComponent;
