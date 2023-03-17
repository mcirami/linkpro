import React, {
    useState,
    useRef,
} from 'react';
import SwitchOptions from './Components/SwitchOptions';
import ToolTipIcon from '../../Utils/ToolTips/ToolTipIcon';

const offers = user.offers;
import { ToolTipContextProvider } from '../../Utils/ToolTips/ToolTipContext';
import InfoText from '../../Utils/ToolTips/InfoText';

function App() {

    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);

    const table_wrap = useRef(null);

    return (
        <ToolTipContextProvider value={{
            infoText,
            setInfoText,
            infoTextOpen,
            setInfoTextOpen,
            infoLocation,
            setInfoLocation,
            infoClicked,
            setInfoClicked
        }}>
            <div className="table_wrap" ref={table_wrap}>
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th scope="col">Courses</th>
                            <th scope="col">
                                <span>
                                    Active
                                </span>
                                <ToolTipIcon section="manager_active" />
                            </th>
                            <th scope="col">
                                <span>
                                    Public
                                </span>
                                <ToolTipIcon section="manager_public" />
                            </th>
                            <th scope="col">Price</th>
                            <th scope="col">
                                <span>Payout</span>
                                <ToolTipIcon section="manager_payout" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {offers.map((offer) => {
                            return (
                                <SwitchOptions
                                    key={offer.id}
                                    offer={offer}
                                />
                            )
                        })}
                    </tbody>
                </table>
                <InfoText
                    divRef={table_wrap}
                />
            </div>
        </ToolTipContextProvider>
    )
}

export default App;
