import CreatePageForm from './Components/CreatePageForm';
import React, {useState} from 'react';
import SocialMediaForms from './Components/SocialMediaForms';
import Facebook from './Components/Facebook';
import Instagram from './Components/Instagram';
import Twitter from './Components/Twitter';
import TikTok from './Components/TikTok';

function App() {

    const [newPageId, setNewPageId] = useState("");
    const [step, setStep] = useState("name");

    return (

        <div className="card guest">

            {step === "name" &&
                <div className="mb-4">
                    <h3>Choose Your Link Name</h3>
                    <p className="small">(Default link name or email address can be used to login)</p>
                </div>
            }
            <div className="card-body">
                <div className="form_wrap">
                    {(() => {

                        switch (step) {
                            case 'name':
                                return <CreatePageForm
                                    newPageId={newPageId}
                                    setNewPageId={setNewPageId}
                                    setStep={setStep}
                                />
                            case 'facebook':
                                return <Facebook
                                    setStep={setStep}
                                    pageId={newPageId}

                                />
                            case 'instagram':
                                return <Instagram
                                    setStep={setStep}
                                    pageId={newPageId}
                                />
                            case 'twitter':
                                return <Twitter
                                    setStep={setStep}
                                    pageId={newPageId}
                                />
                            case 'tiktok':
                                return <TikTok
                                    pageId={newPageId}
                                />
                            default:
                                return null
                        }

                    })()}

                </div>
            </div>

        </div>

    )
}

export default App;
