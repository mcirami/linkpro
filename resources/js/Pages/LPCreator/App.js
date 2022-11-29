import React, {useState, createRef} from 'react';

import Logo from './Components/Logo';
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import SloganInput from './Components/SloganInput';
import HeaderImage from './Components/HeaderImage';
import ColorPicker from './Components/ColorPicker';

function App() {

    const [completedLogoCrop, setCompletedLogoCrop] = useState(null);
    const [fileNameLogo, setFileNameLogo] = useState(null);
    const [completedHeaderCrop, setCompletedHeaderCrop] = useState(null);
    const [fileNameHeader, setFileNameHeader] = useState(null);

    const logoRef = createRef(null);
    const headerRef = createRef(null);

    const [showLoader, setShowLoader] = useState(false);
    const [flash, setFlash] = useState({
        show: false,
        type: '',
        msg: ''
    });

    const showFlash = (show = false, type='', msg='') => {
        setFlash({show, type, msg})
    }

    return (
        <div className="my_row page_wrap">

            {showLoader &&
                <Loader />
            }

            {flash.show &&
                <Flash
                    {...flash}
                    setFlash={setFlash}
                    removeFlash={showFlash}
                    pageSettings={pageSettings}
                />
            }

            <div className="left_column">
                <h3 className="mb-3">Create Your Landing Page</h3>
                <div className="content_wrap my_row" id="left_col_wrap">
                    <section className="my_row section">
                        <div className="section_title">
                            <h4>Header</h4>
                        </div>
                        <Logo
                            setRef={logoRef}
                            completedCrop={completedLogoCrop}
                            setCompletedCrop={setCompletedLogoCrop}
                            fileName={fileNameLogo}
                            setFileName={setFileNameLogo}
                            setShowLoader={setShowLoader}
                        />
                        <SloganInput />
                        <HeaderImage
                            setRef={headerRef}
                            completedCrop={completedHeaderCrop}
                            setCompletedCrop={setCompletedHeaderCrop}
                            fileName={fileNameHeader}
                            setFileName={setFileNameHeader}
                            setShowLoader={setShowLoader}
                        />
                        <ColorPicker />
                    </section>
                    <section className="my_row">
                        <div className="section_title">
                            <h4>Buttons</h4>
                        </div>

                    </section>
                </div>
            </div>

            <div className={`right_column links_col preview`}>

            </div>

        </div>
    )
}

export default App;
