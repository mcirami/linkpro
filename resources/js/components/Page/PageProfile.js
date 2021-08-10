import React, {
    useState,
    useContext,
    useRef,
    useCallback,
    useEffect,
} from 'react';
import axios from "axios";
import {MdCancel, MdEdit, MdFileUpload} from 'react-icons/md';
import {PageContext} from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import EventBus from '../../Utils/Bus';

const PageProfile = ({profileRef, completedProfileCrop, setCompletedProfileCrop, profileFileName, setProfileFileName}) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    //const [fileName, setFileName] = useState("");

    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = profileRef;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    //const [completedCrop, setCompletedCrop] = useState(null);

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setProfileFileName(files[0]["name"]);
        createImage(files[0]);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            setPageSettings({
                ...pageSettings,
                profile_img: e.target.result,
            });
            setUpImg(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedProfileCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedProfileCrop;

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
    }, [completedProfileCrop]);

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
                        profile_img: reader.result,
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
            profile_img: image,
        };

        axios.post('/dashboard/page/update-profile-image/' + pageSettings["id"], packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data))
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                setProfileFileName("")
                setUpImg("")
            }
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
                            <div className="top_section">
                                <div>
                                    <label htmlFor="profile_file_upload" className="custom">
                                        Choose File
                                    </label>
                                    <span>{profileFileName}</span>
                                    <input className="custom" id="profile_file_upload" type="file"
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
                                    onComplete={(c) => setCompletedProfileCrop(c)}
                                />
                                {/*<div>
                                    <canvas
                                        ref={previewCanvasRef}
                                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                        style={{
                                            width: Math.round(completedCrop?.width ?? 0),
                                            height: Math.round(completedCrop?.height ?? 0)
                                        }}
                                    />
                                </div>*/}
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
