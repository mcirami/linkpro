import React, {useState} from 'react';

const SubscribeForm = ({dataRow, row, mailchimpListId, clickType}) => {

    const [formValue, setFormValue] = useState("");

    const handleSubmit = () => {

    }

    return (
        <>
            {mailchimpListId !== undefined &&
                <div className={`my_row form ${dataRow == row && clickType === "form" ?
                    "open" :
                    ""}`}>
                    {dataRow == row &&
                        <div className="form_wrap">
                            <form onSubmit={handleSubmit}>
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
