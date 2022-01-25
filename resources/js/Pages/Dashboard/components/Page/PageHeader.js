import React, {
    useState,
    useContext,
    useCallback,
    useRef,
    useEffect,
    createContext,
} from 'react';
import {MdEdit} from 'react-icons/md';
import { PageContext } from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import {headerImage} from '../../../../Services/PageRequests';
import {completedImageCrop} from '../../../../Services/ImageService';

export const RefContext = createContext();
export const cropStatus = createContext();

const PageHeader = ({setRef, completedCrop, setCompletedCrop, fileName, setFileName, setShowLoader}) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [previousImage, setPreviousImage] = useState(pageSettings['header_img']);

    const [upImg, setUpImg] = useState();
    const imgRef = useRef();
    const previewCanvasRef = setRef;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        setFileName(files[0]["name"]);
        document.querySelector('form.header_img_form .bottom_section').classList.remove('hidden');
        if (window.innerWidth < 993) {
            document.querySelector('.header_img_form').scrollIntoView({
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
                header_img: e.target.result,
            });
            setUpImg(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        completedImageCrop(completedCrop, imgRef, previewCanvasRef);

    }, [completedCrop]);

    const handleSubmit = (e) => {
        e.preventDefault();
        previewCanvasRef.current.toBlob(
            (blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob)
                reader.onloadend = () => {
                    setPageSettings({
                        ...pageSettings,
                        header_img: reader.result,
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
                header_img: response.key,
                ext: response.extension
            };

            headerImage(packets, pageSettings["id"])
            .then((data) => {
                setShowLoader(false);

                if (data.success) {
                    setFileName(null)
                    setUpImg(null)
                    setCompletedCrop(false)
                    document.querySelector('form.header_img_form .bottom_section').
                        classList.
                        add('hidden');
                }
            })

        }).catch(error => {
            console.log(error);
            /*if (error.response) {
                EventBus.dispatch("error", { message: error.response.data.errors.profile_img[0] });
                console.log("ERROR: " + error.response);
            } else {
                console.log("ERROR:: ", error);
            }*/
        });

    }

    const handleCancel = () => {
        //setIsEditing(false);
        setFileName(null)
        setUpImg(null)
        setCompletedCrop(false)
        document.querySelector('form.header_img_form .bottom_section').classList.add('hidden');
        setPageSettings({
            ...pageSettings,
            header_img: previousImage,
        });
    }

    return (

        <div className="row page_settings">
            <div className="col-12">
                <div className="column_wrap">
                    <form onSubmit={handleSubmit}  className="header_img_form">
                        {!fileName &&
                            <>
                            <div className="top_section">
                                <label htmlFor="header_file_upload" className="custom">
                                    Header Image
                                    <span className="edit_icon">
                                        <MdEdit/>
                                        <div className="hover_text edit_image"><p>Edit Header Image</p></div>
                                    </span>
                                </label>
                                <input className="custom" id="header_file_upload" type="file" accept="image/png, image/jpeg, image/jpg, image/gif"
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
                                    onComplete={(c) => setCompletedCrop(c)}
                                />
                            </div>
                            <div className="bottom_row">
                                <button type="submit" className="button green" disabled={!fileName &&
                                true}>
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

export default PageHeader;
