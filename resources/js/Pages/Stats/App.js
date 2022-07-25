import React, {useEffect, useState} from 'react';

import PageStats from './Components/PageStats';
import LinkStats from './Components/LinkStats';
import FolderStats from './Components/FolderStats';

function App() {

    const [pageStats, setPageStats] = useState([])
    const [linkStats, setLinkStats] = useState([])
    const [deletedStats, setDeletedStats] = useState([]);
    const [folderStats, setFolderStats] = useState([])
    const [tab, setTab] = useState("link");

    const [linkStartDate, setLinkStartDate] = useState(null);
    const [linkEndDate, setLinkEndDate] = useState(null);
    const [linkDropdownValue, setLinkDropdownValue] = useState(1);

    const [pageStartDate, setPageStartDate] = useState(null);
    const [pageEndDate, setPageEndDate] = useState(null);
    const [pageDropdownValue, setPageDropdownValue] = useState(1);

    const [folderStartDate, setFolderStartDate] = useState(null);
    const [folderEndDate, setFolderEndDate] = useState(null);
    const [folderDropdownValue, setFolderDropdownValue] = useState(1);

    const fetchStats = async () => {

        const pageUrl = '/stats/get/page';
        const linkUrl = '/stats/get/link';
        const deletedUrl = '/stats/get/deleted';
        const folderUrl = '/stats/get/folder';

        const responses = await Promise.allSettled([fetchAllStats(pageUrl), fetchAllStats(linkUrl), fetchAllStats(deletedUrl), fetchAllStats(folderUrl)])

        setPageStats(responses[0]['value']['pageStats'])
        setLinkStats(responses[1]['value']['linkStats']);
        setDeletedStats(responses[2]['value']['deletedStats']);
        setFolderStats(responses[3]['value']['folderStats'])
    }

    useEffect(() => {
        fetchStats()
    }, []);

    const fetchAllStats = async (url) => {
        const response = await fetch(url);
        return await response.json();
    }

    const handleClick = e => {
        e.preventDefault();
        setTab(e.target.dataset.tab);
    }

    return (

        <div className="tabs_wrap">
            <div className="my_row tab_nav">
                <a href="#" className={`tab_link ${tab === "link" ? "active" : "" }` } data-tab="link" onClick={(e) => { handleClick(e) } }>
                    Page Stats
                </a>
                <a href="#" className={`tab_link ${tab === "icon" ? "active" : "" }` } data-tab="icon" onClick={(e) => { handleClick(e) } }>
                    Icon Stats
                </a>
                <a href="#" className={`tab_link ${tab === "folder" ? "active" : "" }` } data-tab="folder" onClick={(e) => { handleClick(e) } }>
                    Folder Stats
                </a>
            </div>

            {tab === "link" &&
                <PageStats pageStats={pageStats}
                           setPageStats={setPageStats}
                           pageStartDate={pageStartDate}
                           setPageStartDate={setPageStartDate}
                           pageEndDate={pageEndDate}
                           setPageEndDate={setPageEndDate}
                           pageDropdownValue={pageDropdownValue}
                           setPageDropdownValue={setPageDropdownValue}
                           tab={tab}
                />
            }
            {tab ==="icon" &&
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
                           tab={tab}
                />
            }

            {tab === "folder" &&
                <FolderStats
                    folderStats={folderStats}
                    setFolderStats={setFolderStats}
                    folderStartDate={folderStartDate}
                    setFolderStartDate={setFolderStartDate}
                    folderEndDate={folderEndDate}
                    setFolderEndDate={setFolderEndDate}
                    folderDropdownValue={folderDropdownValue}
                    setFolderDropdownValue={setFolderDropdownValue}
                    tab={tab}
                />
            }

        </div>

    )
}

export default App;
