import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    forwardRef,
    useContext,
} from 'react';
import {MdEdit} from 'react-icons/md';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {completedImageCrop, createImage} from '../../../Services/ImageService';
import { updateIcon} from '../../../Services/OfferRequests';
import { updateImage} from '../../../Services/CourseRequests';
import {OFFER_ACTIONS, LP_ACTIONS} from '../Reducer';
import { useDebounceEffect } from '../../../Utils/useDebounceEffect';
import 'react-image-crop/dist/ReactCrop.css'
import { canvasPreview } from './Preview/canvasPreview';

function centerAspectCrop(
    mediaWidth,
    mediaHeight,
    aspect,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

const ImageComponent = ({
                            placeholder,
                            completedCrop,
                            setCompletedCrop,
                            fileNames,
                            setFileNames,
                            setShowLoader,
                            elementName,
                            cropArray,
                            data,
                            dispatch = null,
                            type,
                            nodesRef
}) => {

    const [elementLabel, setElementLabel] = useState(elementName);
    const [upImg, setUpImg] = useState('');
    const imgRef = useRef(null);
    const previewCanvasRef = nodesRef;
    const hiddenAnchorRef = useRef(null);
    const blobUrlRef = useRef('')
    const [crop, setCrop] = useState(cropArray);
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(16 / 9)

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef?.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef?.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    useEffect(() => {

        const words = elementName.split("_");
        setElementLabel( words.join(" "));

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
        setCrop(undefined)
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

   /* const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);*/

    function onLoad(e) {
        if (aspect) {
            const {width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    function handleToggleAspectClick() {
        if (aspect) {
            setAspect(undefined)
        } else if (imgRef.current) {
            const { width, height } = imgRef.current
            setAspect(16 / 9)
            const newCrop = centerAspectCrop(width, height, 16 / 9)
            setCrop(newCrop)
            // Updates the preview
            setCompletedCrop(convertToPixelCrop(newCrop, width, height))
        }
    }

   /* useEffect(() => {

        if (completedCrop?.width || completedCrop?.height || previewCanvasRef?.current || imgRef.current) {
            completedImageCrop(imgRef.current, previewCanvasRef?.current, completedCrop, scale, rotate);
        }
    }, [completedCrop]);*/

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

            if(elementName.includes('icon')) {
                updateIcon(packets, data["id"]).
                    then((data) => {
                        if (data.success) {
                            dispatch({
                                type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
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
                            document.querySelector("." + CSS.escape(elementName) +
                                "_form .bottom_section").classList.add("hidden");
                        } else {
                            setShowLoader({
                                show: false,
                                icon: '',
                                position: ''
                            });
                        }
                    })
            } else {
                updateImage(packets, data["id"])
                .then((data) => {
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
                            document.querySelector("." + CSS.escape(elementName) +
                                "_form .bottom_section").classList.add("hidden");
                        } else {
                            setShowLoader({
                                show: false,
                                icon: '',
                                position: ''
                            });
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
    };

    console.log("previewCanvasRef imageComp: ", previewCanvasRef);

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
                                    {data["icon"] ?
                                        <img src={data["icon"]} alt=""/>
                                        :
                                        ""
                                    }
                                    {type === "extPreview" &&
                                        placeholder
                                    }
                                    <span className="edit_icon">
                                        <MdEdit />
                                        <div className="hover_text edit_image">
                                            <p>Edit {elementLabel}</p>
                                        </div>
                                    </span>
                                </label>
                                <input
                                    className={`custom ${data["icon"] ? "active" : "" }`}
                                    id={`${elementName}_file_upload`}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    onChange={onSelectFile}
                                />
                                {type === "inlinePreview" &&
                                    <label>{placeholder}</label>
                                }
                            </div>
                            <div className="my_row info_text file_types">
                                <p className="m-0 char_count w-100 ">
                                    Allowed File Types:
                                    <span>png, jpg, jpeg, gif</span>
                                </p>
                            </div>
                        </>
                    )}

                    <div className="bottom_section hidden">
                        <div className="crop_section">
                            <div>
                                <label htmlFor="scale-input">Scale: </label>
                                <input
                                    id="scale-input"
                                    type="number"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => setScale(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label htmlFor="rotate-input">Rotate: </label>
                                <input
                                    id="rotate-input"
                                    type="number"
                                    value={rotate}
                                    onChange={(e) =>
                                        setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
                                    }
                                />
                            </div>
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                /*onComplete={(c) =>  setCompletedCrop({
                                    ...completedCrop,
                                    [`${elementName}`]: {
                                        isCompleted: c
                                    }
                                })}*/
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    onLoad={onLoad}
                                    src={upImg}
                                    ref={imgRef}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    alt="Crop me"/>
                            </ReactCrop>
                            {/*{!!completedCrop &&*/}
                                {/*<canvas
                                    ref={ previewCanvasRef }
                                    style={{
                                        border: '1px solid black',
                                        objectFit: 'contain',
                                        width: completedCrop.width,
                                        height: completedCrop.height,
                                    }}
                                />*/}
                          {/*  }*/}
                            {/*{(type === "inlinePreview" && fileNames.length > 0) &&
                                <div className="icon_col">
                                    <p>Icon Preview</p>
                                    <canvas
                                        ref={ref => nodesRef.current["icon"] = ref}
                                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                        style={{
                                            backgroundImage: nodesRef.current["icon"],
                                            backgroundSize: `cover`,
                                            backgroundRepeat: `no-repeat`,
                                            width: completedCrop[elementName]?.isCompleted ?
                                                `100%` :
                                                0,
                                            height: completedCrop[elementName]?.isCompleted ?
                                                `100%` :
                                                0,
                                            borderRadius: `20px`,
                                        }}

                                    />
                                </div>

                            }*/}
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
