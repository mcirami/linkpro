import React, {useEffect, useState} from 'react';

import PageStats from './Components/PageStats';
import LinkStats from './Components/LinkStats';

const url = 'stats/get';
function App() {

    const [pageStats, setPageStats] = useState([])
    const [linkStats, setLinkStats] = useState([])
    const [deletedStats, setDeletedStats] = useState([])
    const [tab, setTab] = useState("link");

    const [linkStartDate, setLinkStartDate] = useState(null);
    const [linkEndDate, setLinkEndDate] = useState(null);
    const [linkDropdownValue, setLinkDropdownValue] = useState(1);

    const [pageStartDate, setPageStartDate] = useState(null);
    const [pageEndDate, setPageEndDate] = useState(null);
    const [pageDropdownValue, setPageDropdownValue] = useState(1);

    const fetchLinkStats = async () => {
        const response = await fetch(url);
        const newStats = await response.json();
        setPageStats(newStats["pageStats"]);
        setLinkStats(newStats["linkStats"]);
        setDeletedStats(newStats["deletedStats"])
    }

    /*const fetchLinkStats = () => {

        axios.get(url)
        .then(response => {
            const returnedStats = response.data;
            setStats(returnedStats);
            console.log(returnedStats);
        })
        .catch(error => {
            if (error.response) {
                console.log(error.response);
            } else {
                console.log("ERROR:: ", error);
            }

        })
    }*/

    useEffect(() => {
        fetchLinkStats()
    }, []);

    const handleClick = e => {
        e.preventDefault();
        if (!e.target.classList.contains('active')) {
            document.querySelectorAll('.tab_link').forEach((link) => {
                link.classList.remove("active")
            })

            e.target.classList.add("active");
            setTab(e.target.dataset.tab);
        }
    }

    return (

        <div className="tabs_wrap">
            <div className="my_row tab_nav">
                <a href="#" className="tab_link active" data-tab="link" onClick={(e) => { handleClick(e) } }>
                    Page Stats
                </a>
                <a href="#" className="tab_link" data-tab="icon" onClick={(e) => {handleClick(e) } }>
                    Icon Stats
                </a>
            </div>

            {tab === "link" ?
                <PageStats pageStats={pageStats}
                           setPageStats={setPageStats}
                           pageStartDate={pageStartDate}
                           setPageStartDate={setPageStartDate}
                           pageEndDate={pageEndDate}
                           setPageEndDate={setPageEndDate}
                           pageDropdownValue={pageDropdownValue}
                           setPageDropdownValue={setPageDropdownValue}
                />
            :
                <LinkStats linkStats={linkStats}
                           setLinkStats={setLinkStats}
                           deletedStats={deletedStats}
                           setDeletedStats={setDeletedStats}
                           linkStartDate={linkStartDate}
                           setLinkStartDate={setLinkStartDate}
                           linkEndDate={linkEndDate}
                           setLinkEndDate={setLinkEndDate}
                           linkDropdownValue={linkDropdownValue}
                           setLinkDropdownValue={setLinkDropdownValue}
                />
            }

        </div>

    )
}

export default App;
