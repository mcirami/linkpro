import React, {useState} from 'react';

const SubscribeForm = ({dataRow, row, mailchimpListId}) => {

    const [formValue, setFormValue] = useState("");

    return (
        <>
            {mailchimpListId !== undefined &&
                <div className={`my_row folder ${dataRow == row ? "open" : ""}`}>
                    {dataRow == row &&
                        <div className="folder_content">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <h3>Enter Your Email To Subscribe.</h3>
                                <input
                                    type="email"
                                    name="email"
                                    value={formValue}
                                    placeholder="Email Address"
                                    onChange={(e) => setFormValue(
                                        e.target.value)}
                                />
                                <input type="hidden" data-id={mailchimpListId}/>
                                <button className="button blue" type="submit">Submit</button>
                            </form>
                        </div>
                    }
                </div>
            }
        </>
    );
};

export default SubscribeForm;
