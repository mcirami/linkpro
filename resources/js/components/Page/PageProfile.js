import React, {
    useState,
    useContext,
    useRef,
    useCallback,
    useEffect,
} from 'react';
import {MdEdit} from 'react-icons/md';
import {PageContext} from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {profileImage} from '../../Services/PageRequests';

const PageProfile = ({profileRef, completedProfileCrop, setCompletedProfileCrop, profileFileName, setProfileFileName}) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [previousImage, setPreviousImage] = useState(pageSettings['profile_img']);

    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = profileRef;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });

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

        profileImage(packets, pageSettings["id"], pageSettings["default"])
        .then((data) => {
            if (data.success) {
                setProfileFileName("")
                setUpImg("")
                document.querySelector('form.profile_img_form .bottom_section').
                    classList.
                    add('hidden');
            }
        })
    }
    const handleCancel = () => {
        setProfileFileName(null)
        setUpImg(null)
        setCompletedProfileCrop(false)
        document.querySelector('form.profile_img_form .bottom_section').classList.add('hidden');
        setPageSettings({
            ...pageSettings,
            profile_img: previousImage,
        });
    }

    return (
        <div className="row page_settings">
            <div className="col-12">
                <div className="column_wrap">

                    <form onSubmit={handleSubmit} className="profile_img_form">

                        {!profileFileName &&
                            <div className="top_section">

                                <label htmlFor="profile_file_upload" className="custom">
                                    Profile Image
                                    <span className="edit_icon">
                                            <MdEdit/>
                                        <div className="hover_text edit_image"><p>Edit Profile Image</p></div>
                                    </span>
                                </label>
                                <input className="custom" id="profile_file_upload" type="file"
                                       onChange={onSelectFile}
                                />
                            </div>
                        }
                        <div className="bottom_section hidden">
                            <div className="crop_section">
                                <ReactCrop
                                    src={upImg}
                                    onImageLoaded={onLoad}
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedProfileCrop(c)}
                                />
                            </div>
                            <div className="bottom_row">
                                <button type="submit" className="button green" disabled={!profileFileName && true}>
                                    Save
                                </button>
                                <a className="button transparent gray" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       handleCancel();
                                   }}
                                >
                                    Cancel
                                </a>
                                <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>


    )
}

export default PageProfile;
