import React, {
    forwardRef,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {MdEdit} from 'react-icons/md';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
} from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import { canvasPreview } from '../../../Utils/canvasPreview';
import { useDebounceEffect } from '../../../Utils/useDebounceEffect';
import {completedImageCrop, createImage} from '../../../Services/ImageService';
import {
    updateImage,
    updateSectionImage,
} from '../../../Services/LandingPageRequests';
import {LP_ACTIONS} from '../Reducer';
import {HiMinus, HiPlus} from 'react-icons/hi';

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

const ImageComponent = forwardRef(function ImageComponent(props, ref) {

    const {
        completedCrop,
        setCompletedCrop,
        setShowLoader,
        elementName,
        cropArray,
        pageData = null,
        dispatch = null,
        sections = null,
        setSections = null,
        currentSection = null
    } = props;

    const [elementLabel, setElementLabel] = useState(elementName);
    const [upImg, setUpImg] = useState();
    const imgRef = useRef();
    const previewCanvasRef = ref;

    const [crop, setCrop] = useState(cropArray);
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(cropArray['aspect'] || 16 / 9)

    useEffect(() => {

        const words = elementName.split("_");
        setElementLabel( elementName === "hero" ? "Header Image" : words.join(" "));

    },[])

    useDebounceEffect(
        async () => {
            if (
                completedCrop[elementName]?.isCompleted.width &&
                completedCrop[elementName]?.isCompleted.height &&
                imgRef.current &&
                previewCanvasRef?.current[elementName]
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef?.current[elementName],
                    completedCrop[elementName]?.isCompleted,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop[elementName]?.isCompleted, scale, rotate],
    )

    const onSelectFile = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        setCrop(undefined)

        document.querySelector("." + CSS.escape(elementName) + "_form .bottom_section").classList.remove("hidden");
        if (window.innerWidth < 993) {
            document.querySelector("." + CSS.escape(elementName) + "_form").scrollIntoView({
                behavior: "smooth",
            });
        }

        createImage(files[0], setUpImg);
    };

    function onLoad(e) {
        if (aspect) {
            const {width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        previewCanvasRef.current[elementName].toBlob(
            (blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
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
        e.preventDefault();

        setUpImg(null);

        const copy = {...completedCrop};
        delete copy[elementName];
        setCompletedCrop(copy);

        document.querySelector("." + CSS.escape(elementName) + "_form .bottom_section").classList.add("hidden");
    };

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

    console.log("completedCrop: ", completedCrop)

    return (
        <article className="my_row page_settings">
            <div className="column_wrap">
                <form onSubmit={handleSubmit} className={`${elementName}_form`}>
                    {!completedCrop[elementName] && (
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
                                    onLoad={onLoad}
                                    src={upImg}
                                    ref={imgRef}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    alt="Crop me"/>
                            </ReactCrop>
                        </div>
                        <div className="bottom_row">
                            <button
                                type="submit"
                                className="button green"
                                disabled={!completedCrop[elementName]?.isCompleted && true}
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
        </article>
    );
});

export default ImageComponent;
