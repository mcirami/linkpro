import React, {
    useState,
    useRef,
    useCallback,
    useEffect, createRef,
} from 'react';
import axios from "axios";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import EventBus from '../../Utils/Bus';
import { MdEdit } from 'react-icons/md';

let userInfo = user.user_info;

const Avatar = () => {

    //const profileRef = createRef(null);

    const [previousImage, setPreviousImage] = useState(userInfo["avatar"]);
    const [currentImage, setCurrentImage] = useState(userInfo["avatar"]);
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = createRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });

    const [completedProfileCrop, setCompletedProfileCrop] = useState(null);
    const [profileFileName, setProfileFileName] = useState(null);

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setProfileFileName(files[0]["name"]);
        document.querySelector('form.profile_img_form .bottom_section').classList.remove('hidden');
        createImage(files[0]);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
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
                const reader = new FileReader();
                reader.readAsDataURL(blob)
                reader.onloadend = () => {
                    fileUpload(reader.result);
                    setCurrentImage(reader.result,)
                }
            },
            'image/png',
            1
        );
    }

    const fileUpload = (image) => {

        const packets = {
            profile_img: image,
            user_id: userInfo.id
        };

        axios.post('/edit-account/update-avatar', packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data))
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                setProfileFileName(null)
                setUpImg("")
                document.querySelector('form.profile_img_form .bottom_section').classList.add('hidden');
            }
        ).catch(error => {
            if (error.response) {
                console.log("ERROR:: ", error.response.data);
            } else {
                console.log("ERROR:: ", error);
            }
        });
    }
    const handleCancel = () => {
        setProfileFileName(null)
        setUpImg(null)
        setCompletedProfileCrop(false)
        setCurrentImage(previousImage);
        document.querySelector('form.profile_img_form .bottom_section').classList.add('hidden');
    }

    return (
        <div className="row">
            <div className="col-12">
                <div className="column_wrap">

                    {!userInfo["avatar"] && !profileFileName ?
                        <div className="profile_image default">
                            <div className="image_wrap">
                                <img src="/images/profile-placeholder-img.png" alt=""/>
                            </div>
                        </div>
                        :
                        ""
                    }
                    {userInfo["avatar"] && !profileFileName ?
                        <div className="profile_image">
                            <div className="image_wrap">
                                <img src={currentImage} alt=""/>
                            </div>
                        </div>
                        :

                        <div className={!userInfo["avatar"] && !profileFileName ?  "" : "profile_image" }>
                            <div className="image_wrap">
                                <canvas
                                    ref={previewCanvasRef}
                                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                    style={{
                                        backgroundImage: previewCanvasRef,
                                        backgroundSize: `cover`,
                                        backgroundRepeat: `no-repeat`,
                                        /*width: Math.round(completedCrop?.width ?? 0),
                                        height: Math.round(completedCrop?.height ?? 0)*/
                                        width: completedProfileCrop ? `100%` : 0,
                                        height: completedProfileCrop ? `100%` : 0,
                                        borderRadius: `100%`,
                                    }}
                                />
                            </div>
                        </div>
                    }


                    <form onSubmit={handleSubmit} className="profile_img_form">

                        {!profileFileName &&
                        <div className="top_section">

                            <label htmlFor="profile_file_upload" className="custom">
                                Update Avatar
                                <span className="edit_icon">
                                    <MdEdit/>
                                </span>
                            </label>
                            <input className="custom" id="profile_file_upload" type="file"
                                   onChange={onSelectFile}
                            />
                        </div>
                        }
                        <div className="bottom_section hidden">
                            <ReactCrop
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedProfileCrop(c)}
                            />
                            <div className="bottom_row">
                                <button type="submit" className="button green" disabled={!profileFileName && true}>
                                    Save
                                </button>
                                <a className="button red" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       handleCancel();
                                   }}
                                >
                                    Cancel
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    )
}

export default Avatar;
