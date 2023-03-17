import React, {
    useState,
    useContext,
    useRef,
    useCallback,
    useEffect,
} from 'react';
import {MdEdit} from 'react-icons/md';
import {PageContext} from '../../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {profileImage} from '../../../../Services/PageRequests';
import {completedImageCrop} from '../../../../Services/ImageService';
import ToolTipIcon from '../../../../Utils/ToolTips/ToolTipIcon';

const PageProfile = ({
                         profileRef,
                         completedProfileCrop,
                         setCompletedProfileCrop,
                         profileFileName,
                         setProfileFileName,
                         setShowLoader,
}) => {

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
        if (window.innerWidth < 993) {
            document.querySelector('.profile_img_form').scrollIntoView({
                behavior: 'smooth',
            });
        }
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

        completedImageCrop(completedProfileCrop, imgRef, previewCanvasRef.current);

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
                    dataURLtoFile(reader.result, 'cropped.jpg');
                }
            },
            'image/png',
            1
        );
    }

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, {type:mime});
        fileUpload(croppedImage);
    }

    const fileUpload = (image) => {

        setShowLoader(true);
        window.Vapor.store(
            image,
            {
                visibility: "public-read"
            },
            {
                progress: progress => {
                    this.uploadProgress = Math.round(progress * 100);
                }
            }
        ).then(response => {

            const packets = {
                profile_img: response.key,
                ext: response.extension
            };

            profileImage(packets, pageSettings["id"], pageSettings["default"])
            .then((data) => {
                setShowLoader(false);
                if (data.success) {
                    setProfileFileName("")
                    setUpImg("")
                    document.querySelector('form.profile_img_form .bottom_section').
                        classList.
                        add('hidden');
                }
            })
        }).catch(error => {
            console.error(error);
            /*if (error.response) {
                EventBus.dispatch("error", { message: error.response.data.errors.profile_img[0] });
                console.error("ERROR: " + error.response);
            } else {
                console.error("ERROR:: ", error);
            }*/
        });

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
        <div className="my_row page_settings">

                <div className="column_wrap">

                    <form onSubmit={handleSubmit} className="profile_img_form">

                        {!profileFileName &&
                            <>
                                <div className="top_section">

                                    <label htmlFor="profile_file_upload" className="custom">
                                        Profile Image
                                        <span className="edit_icon">
                                                <MdEdit/>
                                            <div className="hover_text edit_image"><p>Edit Profile Image</p></div>
                                        </span>
                                    </label>
                                    <input className="custom" id="profile_file_upload" type="file" accept="image/png, image/jpeg, image/jpg, image/gif"
                                           onChange={onSelectFile}
                                    />
                                </div>
                                <div className="my_row info_text file_types">
                                    <p className="m-0 char_count w-100 ">Allowed File Types: <span>png, jpg, jpeg, gif</span></p>
                                </div>
                            </>
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
            {!profileFileName &&
                <ToolTipIcon section="profile" />
            }
        </div>

    )
}

export default PageProfile;
