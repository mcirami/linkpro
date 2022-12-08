import React, {useState, useCallback, useEffect, useRef} from 'react';
import {completedImageCrop, createImage} from '../../../Services/ImageService';
import {MdEdit} from 'react-icons/md';
import ReactCrop from 'react-image-crop';
import ToolTipIcon from '../../Dashboard/Components/Page/ToolTipIcon';

const Logo = ({
                  nodesRef,
                  completedCrop,
                  setCompletedCrop,
                  fileName,
                  setFileName,
                  setShowLoader
}) => {

    //const [previousImage, setPreviousImage] = useState(pageSettings["header_img"]);

    const [upImg, setUpImg] = useState();
    const imgRef = useRef();
    const previewCanvasRef =  nodesRef;
    const [crop, setCrop] = useState({ unit: "%", width: 50, height:50, x: 25, y: 25, /* aspect: 16 / 6*/ maxHeight: 65});

    const onSelectFile = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        setFileName(files[0]["name"]);
        document
        .querySelector("form.logo_form .bottom_section")
        .classList.remove("hidden");
        if (window.innerWidth < 993) {
            document.querySelector(".logo_form").scrollIntoView({
                behavior: "smooth",
            });
        }

        createImage(files[0], setUpImg);
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop.logo?.isCompleted || !previewCanvasRef.current["logo"] || !imgRef.current) {
            return;
        }

        completedImageCrop(completedCrop.logo.isCompleted, imgRef, previewCanvasRef.current["logo"]);
    }, [completedCrop.logo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        previewCanvasRef.current["logo"].toBlob(
            (blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                   /* setPageSettings({
                        ...pageSettings,
                        header_img: reader.result,
                    });*/
                    dataURLtoFile(reader.result, "cropped.jpg");
                };
            },
            "image/png",
            1
        );
    };

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, { type: mime });
        fileUpload(croppedImage);
    };

    const fileUpload = (image) => {
        setShowLoader(true);
        window.Vapor.store(
            image,
            {
                visibility: "public-read",
            },
            {
                progress: (progress) => {
                    this.uploadProgress = Math.round(progress * 100);
                },
            }
        )
        .then((response) => {
            const packets = {
                header_img: response.key,
                ext: response.extension,
            };

            /*headerImage(packets, pageSettings["id"]).then((data) => {
                setShowLoader(false);

                if (data.success) {
                    setFileName(null);
                    setUpImg(null);
                    setCompletedCrop(false);
                    document
                    .querySelector(
                        "form.logo_form .bottom_section"
                    )
                    .classList.add("hidden");
                }
            });*/
        })
        .catch((error) => {
            console.error(error);
            /*if (error.response) {
            EventBus.dispatch("error", { message: error.response.data.errors.profile_img[0] });
            console.error("ERROR: " + error.response);
        } else {
            console.error("ERROR:: ", error);
        }*/
        });
    };

    const handleCancel = () => {
        //setIsEditing(false);
        setFileName(null);
        setUpImg(null);
        delete completedCrop.logo;
        setCompletedCrop(completedCrop);
        document.querySelector("form.logo_form .bottom_section").classList.add("hidden");
        /*setPageSettings({
            ...pageSettings,
            header_img: previousImage,
        });*/
    };

    return (
        <article className="my_row page_settings">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className="logo_form">
                    {!fileName && (
                        <>
                            <div className="top_section">
                                <label
                                    htmlFor="logo_upload"
                                    className="custom"
                                >
                                    Logo
                                    <span className="edit_icon">
                                        <MdEdit />
                                        <div className="hover_text edit_image">
                                            <p>Edit Logo Image</p>
                                        </div>
                                    </span>
                                </label>
                                <input
                                    className="custom"
                                    id="logo_upload"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    onChange={onSelectFile}
                                />
                            </div>
                            <div className="my_row info_text file_types">
                                <p className="m-0 char_count w-100 ">
                                    Allowed File Types:{" "}
                                    <span>png, jpg, jpeg, gif</span>
                                </p>
                            </div>
                        </>
                    )}
                    <div className="bottom_section hidden">
                        <div className="crop_section">
                            <ReactCrop
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop({
                                    ...completedCrop,
                                    logo: {
                                        isCompleted: c
                                    }
                                })}
                            />
                        </div>
                        <div className="bottom_row">
                            <button
                                type="submit"
                                className="button green"
                                disabled={!fileName && true}
                            >
                                Save
                            </button>
                            <a
                                className="button transparent gray"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCancel();
                                }}
                            >
                                Cancel
                            </a>
                            <a
                                className="help_link"
                                href="mailto:help@link.pro"
                            >
                                Need Help?
                            </a>
                        </div>
                    </div>
                </form>
            </div>
           {/* {!fileName && (
                <ToolTipIcon section="header" />
            )}*/}
        </article>
    );
};

export default Logo;
