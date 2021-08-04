import React, {useState, useContext} from 'react';
import axios from "axios";
import {MdCancel, MdEdit, MdFileUpload} from 'react-icons/md';
import {PageContext} from '../App';

const PageProfile = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    const [fileName, setFileName] = useState("");

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setFileName(files[0]["name"]);
        createImage(files[0]);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            setPageSettings({
                ...pageSettings,
                profile_img: e.target.result,
            });
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fileUpload(pageSettings["profile_img"]);
    }

    const fileUpload = (image) => {

        const packets = {
            profile_img: image,
        };

        axios.post('/dashboard/page/profile-update/' + pageSettings["id"], packets).then(
            response => console.log(JSON.stringify(response.data))
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);
        });
    }

    return (
        <div className="row page_settings">
            {/*<div className="row">
                <div className="col-3">
                    <img id="profile_img" src={pageProfileIMG} name="profile_img" alt=""/>
                </div>
                <div className="col-9">
                    <form onSubmit={handleSubmit}>
                        <input type="file"
                               onChange={onSelectFile}
                        />
                        <button type="submit">
                            Upload
                        </button>
                    </form>
                </div>
            </div>*/}
            <div className="col-12">
                <div className="column_wrap">
                    { isEditing ?
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="header_file_upload" className="custom">
                                    Choose File
                                </label>
                                <span>{fileName}</span>
                                <input className="custom" id="header_file_upload" type="file"
                                       onChange={onSelectFile}
                                />
                            </div>
                            <div>
                                <button type="submit">
                                    <MdFileUpload />
                                </button>
                                <a className="cancel_icon" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       setIsEditing(false);
                                    }}
                                ><MdCancel />
                                </a>
                            </div>
                        </form>
                        :
                        <div className="column_content">
                            <h3>Profile Image </h3>
                            <a className="edit_icon" onClick={(e) => {e.preventDefault(); setIsEditing(true) }} href="#"><MdEdit /></a>
                        </div>
                    }

                </div>
            </div>
        </div>


    )
}

export default PageProfile;
