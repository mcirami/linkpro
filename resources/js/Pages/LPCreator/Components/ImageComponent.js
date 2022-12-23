import React, {useCallback, useEffect, useRef, useState} from 'react';
import {MdEdit} from 'react-icons/md';
import ReactCrop from 'react-image-crop';
import {completedImageCrop, createImage} from '../../../Services/ImageService';
import {
    updateImage,
    updateSectionImage,
} from '../../../Services/LandingPageRequests';
import {LP_ACTIONS} from '../Reducer';

const ImageComponent = ({
                            nodesRef,
                            completedCrop,
                            setCompletedCrop,
                            fileNames,
                            setFileNames,
                            setShowLoader,
                            elementName,
                            cropArray,
                            pageData = null,
                            dispatch = null,
                            sections = null,
                            setSections = null,
                            currentSection = null
}) => {

    const [elementLabel, setElementLabel] = useState(elementName);
    const [upImg, setUpImg] = useState();
    const imgRef = useRef();
    const previewCanvasRef = nodesRef;

    const [crop, setCrop] = useState(
        cropArray
    );

    useEffect(() => {

        if(sections) {
            const words = elementName.split("_");
            const name = words.map((word) => {
                return word.charAt(0). toUpperCase() + word.slice(1);
            })
            setElementLabel(name.join(" "));
        } else {
            setElementLabel( elementName === "hero" ? "Header Image" : elementName.charAt(0).toUpperCase() + elementName.slice(1) + " Image");
        }

    },[])

    const checkFound = () => {
        const found = fileNames?.find(el => {
            return el?.name === elementName;
        })
        return found || false;
    }

    const onSelectFile = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        setFileNames((prev) => ([
            ...prev,
            {name: elementName}
        ]))

        document.querySelector("." + CSS.escape(elementName) + "_form .bottom_section").classList.remove("hidden");
        if (window.innerWidth < 993) {
            document.querySelector("." + CSS.escape(elementName) + "_form").scrollIntoView({
                behavior: "smooth",
            });
        }

        createImage(files[0], setUpImg);
    };

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop[elementName]?.isCompleted || !previewCanvasRef.current[elementName] || !imgRef.current) {
            return;
        }

        completedImageCrop(completedCrop[elementName].isCompleted, imgRef, previewCanvasRef.current[elementName]);
    }, [completedCrop[elementName]]);

    const handleSubmit = (e) => {
        e.preventDefault();
        previewCanvasRef.current[elementName].toBlob(
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
        setShowLoader({
            show: true,
            icon: 'upload',
            position: 'fixed'
        });
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
        ).then((response) => {

            const packets = {
                [`${elementName}`]: response.key,
                ext: response.extension,
            };

            if(sections) {

                updateSectionImage(packets, currentSection.id)
                .then((data) => {
                    if (data.success) {
                        console.log(data.imagePath);
                        setSections(sections.map((section) => {
                            if (section.id === currentSection.id) {
                                return {
                                    ...section,
                                    image: data.imagePath,
                                }
                            }
                            return section;
                        }))

                        setShowLoader({
                            show: false,
                            icon: '',
                            position: ''
                        });

                        setFileNames(fileNames.filter(element => {
                            return element.name !== elementName
                        }));
                        setUpImg(null);
                        delete completedCrop[elementName];
                        setCompletedCrop(completedCrop);
                        document.querySelector(
                            "." + CSS.escape(elementName) +
                            "_form .bottom_section").
                            classList.
                            add("hidden");
                    }
                })

            } else {

                updateImage(packets, pageData["id"]).
                    then((data) => {
                        if (data.success) {
                            dispatch({
                                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                payload: {
                                    value: data.imagePath,
                                    name: elementName
                                }
                            })
                            setShowLoader({
                                show: false,
                                icon: '',
                                position: ''
                            });

                            setFileNames(fileNames.filter(element => {
                                return element.name !== elementName
                            }));
                            setUpImg(null);
                            delete completedCrop[elementName];
                            setCompletedCrop(completedCrop);
                            document.querySelector(
                                "." + CSS.escape(elementName) +
                                "_form .bottom_section").
                                classList.
                                add("hidden");
                        }
                    })
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleCancel = (e) => {
        //setIsEditing(false);
        e.preventDefault();

        setFileNames(fileNames.filter(element => {
            return element.name !== elementName
        }));
        setUpImg(null);

        delete completedCrop[elementName];
        setCompletedCrop(completedCrop);
        document.querySelector("." + CSS.escape(elementName) + "_form .bottom_section").classList.add("hidden");
        /*setPageSettings({
            ...pageSettings,
            header_img: previousImage,
        });*/
    };

    return (
        <article className="my_row page_settings">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className={`${elementName}_form`}>
                    {!checkFound() && (
                        <>
                            <div className="top_section">
                                <label
                                    htmlFor={`${elementName}_file_upload`}
                                    className="custom"
                                >
                                    {elementLabel}
                                    <span className="edit_icon">
                                        <MdEdit />
                                        <div className="hover_text edit_image">
                                            <p>Edit {elementLabel}</p>
                                        </div>
                                    </span>
                                </label>
                                <input
                                    className="custom"
                                    id={`${elementName}_file_upload`}
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
                                    [`${elementName}`]: {
                                        isCompleted: c
                                    }
                                })}
                            />
                        </div>
                        <div className="bottom_row">
                            <button
                                type="submit"
                                className="button green"
                                disabled={!checkFound() && true}
                            >
                                Save
                            </button>
                            <a
                                className="button transparent gray"
                                href="#"
                                onClick={(e) => {
                                    handleCancel(e);
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

export default ImageComponent;
