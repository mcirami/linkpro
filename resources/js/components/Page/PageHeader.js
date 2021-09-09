import React, {
    useState,
    useContext,
    useCallback,
    useRef,
    useEffect,
    createContext,
} from 'react';
import axios from "axios";
import {MdCancel, MdEdit, MdFileUpload} from 'react-icons/md';
import { PageContext } from '../App';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
import EventBus from '../../Utils/Bus';

export const RefContext = createContext();
export const cropStatus = createContext();

const PageHeader = ({setRef, completedCrop, setCompletedCrop, fileName, setFileName}) => {

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

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedCrop;

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
                    fileUpload(reader.result);
                }
            },
            'image/png',
            1
        );
    }

    const fileUpload = (image) => {

        const packets = {
            header_img: image,
        };

        axios.post('/dashboard/page/update-header-image/' + pageSettings["id"], packets)
        .then(
            (response) => {
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                setFileName(null)
                setUpImg(null)
                setCompletedCrop(false)
                document.querySelector('form.header_img_form .bottom_section').classList.add('hidden');
            }
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);
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
                            <div className="top_section">
                                <label htmlFor="header_file_upload" className="custom">
                                    Header Image
                                    <span className="edit_icon">
                                        <MdEdit/>
                                    </span>
                                </label>
                                <input className="custom" id="header_file_upload" type="file"
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
                                onComplete={(c) => setCompletedCrop(c)}
                            />
                            <div className="bottom_row">
                                <button type="submit" className="button green" disabled={!fileName && true}>
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

export default PageHeader;
