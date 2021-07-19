import React, {useState, useEffect} from 'react';
import axios from "axios";

const PageHeader = ({page}) => {

    const [pageHeader, setPageHeader] = useState(page["page_header_img"]);
    const [selectedFile, setSelectedFile] = useState();
    const [preview, setPreview] = useState();

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        setPageHeader("/images" + selectedFile["name"]);

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            page_header_img: pageHeader,
            page_id: page["id"]
        };

        axios.post('/dashboard/links/header', packets).then(
            response => alert(JSON.stringify(response.data))
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });


    }

    return (
        <form onSubmit={handleSubmit}>
            {selectedFile ? <img src={preview} /> :
                <img id="page_header_img" src={pageHeader} name="page_header_img" alt=""/>
            }
            <input type="file"
                   onChange={onSelectFile}
            />
            <button type="submit">
                Upload
            </button>
        </form>

    )
}

export default PageHeader;
