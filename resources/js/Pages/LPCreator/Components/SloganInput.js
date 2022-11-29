import React, {useEffect, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import ToolTipIcon from '../../Dashboard/Components/Page/ToolTipIcon';

const SloganInput = () => {

    const [charactersLeft, setCharactersLeft] = useState();

    /*useEffect(() => {
        if(pageSettings["title"]) {
            setCharactersLeft(30 - pageSettings["title"].length);
        } else {
            setCharactersLeft(30);
        }
    },[charactersLeft])*/

    const handleChange = (e) => {
        const value = e.target.value;

        setCharactersLeft(30 - value.length);

    }

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit}>
                <input maxLength="30" name="title" type="text"
                       placeholder="Slogan (optional)"
                       defaultValue={""}
                       onChange={(e) => handleChange(e) }
                       onKeyDown={ event => {
                           if(event.key === 'Enter') {
                               handleSubmit(event);
                           }
                       }
                       }
                       onBlur={(e) => handleSubmit(e)}
                />
                {charactersLeft < 30 ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp />
                        <div className="hover_text submit_button"><p>Submit Title Text</p></div>
                    </a>
                    :
                    <span className="cancel_icon">
                        <FiThumbsDown />
                    </span>
                }
                <div className="my_row info_text title">
                    <p className="char_max">Max 30 Characters</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            <>
                                Characters Left: <span className="count"> {charactersLeft} </span>
                            </>
                        }
                    </p>
                </div>
            </form>
            {/*<ToolTipIcon section="title" />*/}
        </div>

    );
};

export default SloganInput;
