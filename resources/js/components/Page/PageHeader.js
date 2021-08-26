import React, {useState, useContext, useCallback, useRef, useEffect} from 'react';
import axios from "axios";
import {MdCancel, MdEdit, MdFileUpload} from 'react-icons/md';
import { PageContext } from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';

const PageHeader = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [isEditing, setIsEditing] = useState(false);
    const [fileName, setFileName] = useState("");

    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
    const [completedCrop, setCompletedCrop] = useState(null);

    /*const generateDownload = (canvas, crop) => {
        if(!crop || !canvas) {
            return;
        }

        canvas.toBlob (
            (blob) => {
                const previewUrl = window.URL.createObjectURL(blob);

                const anchor = document.createElement('a');
                anchor.download = 'cropPreview.png';
                anchor.href = URL.createObjectURL(blob);
                anchor.click();

                window.URL.revokeObjectURL(previewUrl);
            }, 'image/png', 1
        )
    }*/

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
            setUpImg(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [completedCrop]);

    const handleSubmit = (e) => {
        e.preventDefault();
        previewCanvasRef.current.toBlob(
            (blob) => {
                /*const previewUrl = window.URL.createObjectURL(blob);

                /!*const anchor = document.createElement('a');
                anchor.download = 'cropPreview.png';
                anchor.href = URL.createObjectURL(blob);
                anchor.click();*!/

                const myURL = URL.createObjectURL(blob);
                fileUpload(myURL);

                window.URL.revokeObjectURL(previewUrl);*/
                const reader = new FileReader();
                reader.readAsDataURL(blob)
                reader.onloadend = () => {
                    setPageSettings({
                        ...pageSettings,
                        header_img: reader.result,
                    });
                    fileUpload(reader.result);
                }
            },
            'image/png',
            1
        );
    }

    const fileUpload = (image) => {

        const packets = {
            header_img: image,
        };

        axios.post('/dashboard/page/update-header-image/' + pageSettings["id"], packets).then(
            response => console.log(JSON.stringify(response.data)),
            setFileName(""),
            setUpImg("")
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
                        <form onSubmit={handleSubmit}>
                            <div className="top_section">
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
                            </div>
                            <div className="bottom_section">
                                <ReactCrop
                                    src={upImg}
                                    onImageLoaded={onLoad}
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                />
                                <div>
                                    <canvas
                                        ref={previewCanvasRef}
                                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                        style={{
                                            width: Math.round(completedCrop?.width ?? 0),
                                            height: Math.round(completedCrop?.height ?? 0)
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
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
