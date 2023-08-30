import React, {
    useState,
    useContext,
    useRef,
    forwardRef,
} from 'react';
import {MdEdit} from 'react-icons/md';
import {PageContext} from '../../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {profileImage} from '../../../../Services/PageRequests';
import {
    canvasPreview,
    useDebounceEffect,
    onImageLoad,
    createImage, getFileToUpload,
} from '../../../../Services/ImageService';
import ToolTipIcon from '../../../../Utils/ToolTips/ToolTipIcon';
import {HiMinus, HiPlus} from 'react-icons/hi';

const PageProfile = forwardRef(function PageProfile(props, ref) {

    const {
        completedCrop,
        setCompletedCrop,
        profileFileName,
        setProfileFileName,
        setShowLoader,
        elementName
    } = props

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [previousImage, setPreviousImage] = useState(pageSettings['profile_img']);

    const [upImg, setUpImg] = useState();
    const imgRef = useRef();
    const previewCanvasRef = ref;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(1)

    useDebounceEffect(
        async () => {
            if (
                completedCrop[elementName]?.isCompleted.width &&
                completedCrop[elementName]?.isCompleted.height &&
                imgRef.current &&
                previewCanvasRef.current[elementName]
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current[elementName],
                    completedCrop[elementName].isCompleted,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop[elementName]?.isCompleted, scale, rotate],
    )

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setCrop(undefined)
        setProfileFileName(files[0]["name"]);
        document.querySelector('form.profile_img_form .bottom_section').classList.remove('hidden');
        if (window.innerWidth < 993) {
            document.querySelector('.profile_img_form').scrollIntoView({
                behavior: 'smooth',
            });
        }
        createImage(files[0], setUpImg);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const image = getFileToUpload(previewCanvasRef?.current[elementName])
        image.then((value) => {
            fileUpload(value);
        })
    }

    const fileUpload = (image) => {

        setShowLoader({show: true, icon: "upload", position: "fixed"})
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
                setShowLoader({show: false, icon: null, position: ""})
                if (data.success) {
                    setProfileFileName("")
                    setUpImg("")
                    setPageSettings({
                        ...pageSettings,
                        profile_img: data.imgPath,
                    });
                    document.querySelector('form.profile_img_form .bottom_section').classList.add('hidden');
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

        const copy = {...completedCrop};
        delete copy[elementName];
        setCompletedCrop(copy);

        document.querySelector('form.profile_img_form .bottom_section').classList.add('hidden');
        setPageSettings({
            ...pageSettings,
            profile_img: previousImage,
        });
    }

    const handleIncreaseNumber = (e,type) => {
        e.preventDefault();
        if (type === "scale") {

            const number = scale + .1;
            const result = Math.round(number * 10) / 10;
            setScale(result);
        }

        if (type === "rotate") {
            setRotate(Math.min(180, Math.max(-180, Number(rotate + 1))))
        }
    }

    const handleDecreaseNumber = (e, type) => {
        e.preventDefault();
        if (type === "scale") {
            const number = scale - .1;
            const result = Math.round(number * 10) / 10;
            setScale(result);
        }

        if (type === "rotate") {
            setRotate(Math.min(180, Math.max(-180, Number(rotate - 1))))
        }

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
                            <div className="crop_tools">
                                <div className="column">
                                    <a href="#" className="number_control" onClick={(e) => handleDecreaseNumber(e, "scale")}>
                                        <HiMinus />
                                    </a>
                                    <div className="position-relative">
                                        <input
                                            className="active animate"
                                            id="scale-input"
                                            type="text"
                                            step="0.1"
                                            value={scale}
                                            onChange={(e) => setScale(Number(e.target.value))}
                                        />
                                        <label htmlFor="scale-input">Scale</label>
                                    </div>
                                    <a href="#" className="number_control" onClick={(e) => handleIncreaseNumber(e, "scale")}>
                                        <HiPlus />
                                    </a>
                                </div>
                                <div className="column">
                                    <a href="#" className="number_control" onClick={(e) => handleDecreaseNumber(e, "rotate")}>
                                        <HiMinus />
                                    </a>
                                    <div className="position-relative">
                                        <input
                                            className="active animate"
                                            id="rotate-input"
                                            type="text"
                                            value={rotate}
                                            onChange={(e) =>
                                                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
                                            }
                                        />
                                        <label htmlFor="rotate-input">Rotate</label>
                                    </div>
                                    <a href="#" className="number_control" onClick={(e) => handleIncreaseNumber(e, "rotate")}>
                                        <HiPlus />
                                    </a>
                                </div>
                            </div>
                            <ReactCrop
                                crop={crop}
                                aspect={aspect}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop({
                                    ...completedCrop,
                                    [`${elementName}`]: {
                                        isCompleted: c
                                    }
                                })}
                            >
                                <img
                                    onLoad={(e) => onImageLoad(e,aspect, setCrop)}
                                    src={upImg}
                                    ref={imgRef}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    alt="Crop me"/>
                            </ReactCrop>
                        </div>
                        <div className="bottom_row">
                            <button type="submit"
                                    className="button green"
                                    disabled={!profileFileName && true}>
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
})

export default PageProfile;
