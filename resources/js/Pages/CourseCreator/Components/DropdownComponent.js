import React, {useEffect, useRef, useState} from 'react';
import {updateData} from '../../../Services/CourseRequests';
import {LP_ACTIONS} from '../Reducer';

const categories = user.categories;

const DropdownComponent = ({
                               id,
                               dispatch,
                               value
}) => {

    const [selectedCategory, setSelectedCategory] = useState(value)

    const handleFocus = (element) => {
        return element.classList.add('active')
    }

    const handleBlur = (element) => {
        if (element.value === "") {
            return element.classList.remove('active');
        }
    }

    const myRef = useRef(null);

    useEffect(() => {

        if (myRef.current.value !== "") {
            myRef.current.classList.add('active');
        }

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
            {/*<div className="custom_select">
                <label>Select Category</label>
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

            <select
                ref={myRef}
                id="category_select"
                defaultValue={selectedCategory}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e.target)}
                onFocus={(e) => handleFocus(e.target)}
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
