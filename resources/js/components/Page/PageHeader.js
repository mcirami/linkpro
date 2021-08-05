import React, {useState, useContext} from 'react';
import axios, {post} from "axios";
import {MdCancel, MdEdit, MdFileUpload} from 'react-icons/md';
import { PageContext } from '../App';
import ImageCropper from './ImageCropper';

const PageHeader = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [isEditing, setIsEditing] = useState(false);
    const [fileName, setFileName] = useState("");

    const [blob, setBlob] = useState(null);
    const [inputImg, setInputImg] = useState('');

    const getBlob = (blob) => {
        setBlob(blob);
    }

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
                header_img: e.target.result,
            });
            setInputImg(reader.result)
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fileUpload(pageSettings["header_img"]);
    }

    const fileUpload = (image) => {

        const packets = {
            header_img: image,
        };

        axios.post('/dashboard/page/header-update/' + pageSettings["id"], packets).then(
            response => console.log(JSON.stringify(response.data))
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);
        });
    }

    return (

        <div className="row page_settings">
            {/*<div className="col-3">
                <img id="header_img" src={pageHeader} name="header_img" alt=""/>
            </div>
            <div className="col-9">
                <input type="file"
                       onChange={onSelectFile}
                />
                <button type="submit">
                    Upload
                </button>
            </div>*/}

            <div className="col-12">
                <div className="column_wrap">
                    {isEditing ?
                        <div className="form_wrap">
                            <form onSubmit={handleSubmit}>
                                <div className="top_row">
                                    <div>
                                        <label htmlFor="header_file_upload" className="custom">
                                            Choose File
                                        </label>
                                        <span>{fileName}</span>
                                        <input className="custom" id="header_file_upload" type="file" accept="image/*"
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
                                </div>
                                <div className={inputImg ? "bottom_row open" : "bottom_row"}>
                                {
                                    inputImg && (

                                            <ImageCropper
                                                getBlob={getBlob}
                                                inputImg={inputImg}
                                            />

                                    )
                                }
                                </div>
                            </form>
                        </div>
                        :
                        <div className="column_content">
                            <h3>Header Image</h3>
                            <a className="edit_icon" onClick={(e) => {e.preventDefault(); setIsEditing(true) }} href="#"><MdEdit /></a>
                        </div>
                    }

                </div>

            </div>
        </div>

    )
}

export default PageHeader;
