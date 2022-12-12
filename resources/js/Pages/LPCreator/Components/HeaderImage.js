import React, {useState, useCallback, useEffect, useRef} from 'react';
import {completedImageCrop, createImage} from '../../../Services/ImageService';
import {MdEdit} from 'react-icons/md';
import ReactCrop from 'react-image-crop';

const HeaderImage = ({
                         nodesRef,
                         completedCrop,
                         setCompletedCrop,
                         fileNames,
                         setFileNames,
                         setShowLoader,
                         elementName
}) => {
    //const [previousImage, setPreviousImage] = useState(pageSettings["header_img"]);

    const [upImg, setUpImg] = useState();
    const imgRef = useRef();
    const previewCanvasRef = nodesRef;
    const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 12 });

    const onSelectFile = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        //setFileNames(files[0]["name"]);
        setFileNames((prev) => ({
            ...prev,
            [`${elementName}`]: files[0]["name"]
        }))
        document.querySelector("form.header_img_form .bottom_section").classList.remove("hidden");
        if (window.innerWidth < 993) {
            document.querySelector(".header_img_form").scrollIntoView({
                behavior: "smooth",
            });
        }

        createImage(files[0], setUpImg);
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop.header?.isCompleted || !previewCanvasRef.current["header"] || !imgRef.current) {
            return;
        }

        completedImageCrop(completedCrop.header.isCompleted, imgRef, previewCanvasRef.current["header"]);
    }, [completedCrop.header]);

    const handleSubmit = (e) => {
        e.preventDefault();
        previewCanvasRef.current["header"].toBlob(
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

    const dataURLtoFile = (dataurl, fileName) => {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], fileName, { type: mime });
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
                    setFileNames(null);
                    setUpImg(null);
                    setCompletedCrop(false);
                    document
                    .querySelector(
                        "form.header_img_form .bottom_section"
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
        delete fileNames.header;
        setFileNames(fileNames);
        setUpImg(null);

        delete completedCrop.header;
        setCompletedCrop(completedCrop);
        document.querySelector("form.header_img_form .bottom_section").classList.add("hidden");
        /*setPageSettings({
            ...pageSettings,
            header_img: previousImage,
        });*/
    };

    return (
        <article className="my_row page_settings">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className="header_img_form">
                    {!fileNames?.header && (
                        <>
                            <div className="top_section">
                                <label
                                    htmlFor="header_file_upload"
                                    className="custom"
                                >
                                    Header Image
                                    <span className="edit_icon">
                                        <MdEdit />
                                        <div className="hover_text edit_image">
                                            <p>Edit Header Image</p>
                                        </div>
                                    </span>
                                </label>
                                <input
                                    className="custom"
                                    id="header_file_upload"
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
                                onComplete={(c) =>  setCompletedCrop({
                                    ...completedCrop,
                                    header: {
                                        isCompleted: c
                                    }
                                })}
                            />
                        </div>
                        <div className="bottom_row">
                            <button
                                type="submit"
                                className="button green"
                                disabled={!fileNames?.header && true}
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
            {/* {!fileNames && (
                <ToolTipIcon section="header" />
            )}*/}
        </article>
    );
};

export default HeaderImage;
