import React, {
    createRef,
    useCallback,
    useContext, useEffect,
    useRef,
    useState,
} from 'react';
import IconList from "./IconList";
import axios from "axios";
import { LinksContext, PageContext } from '../App';
import EventBus from '../../Utils/Bus';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/src/ReactCrop.scss';
const iconPaths = user.icons;

const SubmitForm = ({
    editID,
    setEditID,
    setUserLinks,
    userLinks,
    originalArray,
    setOriginalArray,
}) => {

    //const  { userLinks, setUserLinks } = useContext(LinksContext);
    const  { pageSettings, setPageSettings } = useContext(PageContext);


    const iconRef = createRef(null)
    const [completedIconCrop, setCompletedIconCrop] = useState(null);
    const [iconSelected, setIconSelected] = useState(false);

    //image cropping

    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = iconRef;
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 });
    const [customIcon, setCustomIcon] = useState(null);

    const [ currentLink, setCurrentLink ] = useState(
        userLinks.find(function(e) {
            return e.id === editID
        }) || null );

    let iconArray = [];

    iconPaths.map((iconPath) => {
        const end = iconPath.lastIndexOf("/");
        const newPath = iconPath.slice(end);
        const newArray = newPath.split(".")
        const iconName = newArray[0].replace("/", "");
        const tmp = {"name": iconName, "path" : iconPath}
        iconArray.push(tmp);
    });

    const [input, setInput] = useState("");
    const handleChange = (e) => {
        e.preventDefault();
        setInput(e.target.value);
    }
    if (input.length > 0 ) {
        iconArray = iconArray.filter((i) => {
            return i.name.match(input);
        });
    }

    const selectCustomIcon = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setIconSelected(true);
        //document.querySelector('form.profile_img_form .bottom_section').classList.remove('hidden');
        createImage(files[0]);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            /*setCurrentLink({
                ...currentLink,
                icon: e.target.result
            })*/
            setUpImg(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    useEffect(() => {
        if (!customIcon) {
            //setPreview(undefined)
            return
        }
        //setPageHeader(selectedFile["name"]);
        const objectUrl = URL.createObjectURL(customIcon)
        //setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [customIcon]);

    useEffect(() => {
        if (!completedIconCrop || !previewCanvasRef.current || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = previewCanvasRef.current;
        const crop = completedIconCrop;

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
    }, [completedIconCrop]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (iconSelected) {

            previewCanvasRef.current.toBlob(
                (blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob)
                    reader.onloadend = () => {
                        submitWithCustomIcon(reader.result);
                    }
                },
                'image/png',
                1
            );

        } else {

            const packets = {
                name: currentLink.name,
                url: currentLink.url,
                icon: currentLink.icon,
                page_id: pageSettings["id"],
            };

            axios.post('/dashboard/links/update/' + editID, packets).then(
                (response) => {
                    const returnMessage = JSON.stringify(response.data.message);
                    EventBus.dispatch("success", {message: returnMessage});
                    setUserLinks(
                        userLinks.map((item) => {
                            if (item.id === editID) {
                                return {
                                    ...item,
                                    name: currentLink.name,
                                    url: currentLink.url,
                                    icon: currentLink.icon
                                }
                            }
                            return item;
                        })
                    )
                    setOriginalArray(
                        originalArray.map((item) => {
                            if (item.id === editID) {
                                return {
                                    ...item,
                                    name: currentLink.name,
                                    url: currentLink.url,
                                    icon: currentLink.icon
                                }
                            }
                            return item;
                        })
                    )
                    setEditID(null)
                }
            ).catch(error => {
                if (error.response) {
                    console.log("ERROR:: ", error.response.data);
                } else {
                    console.log("ERROR:: ", error);
                }

            });
        }

    };

    const submitWithCustomIcon = (image) => {

        const packets = {
            name: currentLink.name ? currentLink.name : null,
            url: currentLink.url ? currentLink.url : null,
            icon: image ? image : null,
            page_id: pageSettings["id"],
        };

        axios.post('/dashboard/links/update/' + editID, packets).then(
            (response) => {
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", {message: returnMessage});
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === editID) {
                            return {
                                ...item,
                                name: currentLink.name,
                                url: currentLink.url,
                                icon: image
                            }
                        }
                        return item;
                    })
                )
                setOriginalArray(
                    originalArray.map((item) => {
                        if (item.id === editID) {
                            return {
                                ...item,
                                name: currentLink.name,
                                url: currentLink.url,
                                icon: image
                            }
                        }
                        return item;
                    })
                )
                setEditID(null)
            }
        ).catch(error => {
            if (error.response) {
                console.log("ERROR:: ", error.response.data);
            } else {
                console.log("ERROR:: ", error);
            }

        });
    }

    return (
        <div className="edit_form popup" key={editID}>
            <form onSubmit={handleSubmit} className="link_form">
                <div className="row">
                    <div className="col-12">
                        <div className={ !iconSelected ? "crop_section hidden" : "crop_section"}>
                            {iconSelected ? <p>Crop Icon</p> : ""}
                            <ReactCrop
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedIconCrop(c)}
                            />
                            <div className="icon_col">
                                {iconSelected ? <p>Icon Preview</p> : ""}
                                <canvas
                                    ref={iconRef}
                                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                    style={{
                                        backgroundImage: iconRef,
                                        backgroundSize: `cover`,
                                        backgroundRepeat: `no-repeat`,
                                        width: completedIconCrop ? `100%` : 0,
                                        height: completedIconCrop ? `100%` : 0,
                                        borderRadius: `20px`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className="icon_row">
                            <div className="icon_box">
                                <div className="my_row top">
                                    <input type="text" placeholder="Search Icons"
                                           onChange={handleChange}
                                    />
                                    <div className="uploader">
                                        <label htmlFor="custom_icon_upload" className="custom text-uppercase button blue">
                                            Custom Icon
                                        </label>
                                        <input id="custom_icon_upload" type="file" className="custom" onChange={selectCustomIcon}/>
                                    </div>
                                </div>

                                <IconList currentLink={currentLink} setCurrentLink={setCurrentLink} iconArray={iconArray}/>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <input
                            name="name"
                            type="text"
                            defaultValue={ editID.toString().includes("new") ? "" : currentLink.name}
                            placeholder="Link Name"
                            onChange={(e) => setCurrentLink({
                                ...currentLink,
                                name: e.target.value
                            }) }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <input
                            name="url"
                            type="text"
                            defaultValue={editID.toString().includes("new") ? "" : currentLink.url }
                            placeholder="https://linkurl.com"
                            onChange={(e) => setCurrentLink({
                                ...currentLink,
                                url: e.target.value
                            }) }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 button_row">
                        <button className="button green" type="submit">
                            Save
                        </button>
                        <a href="#" className="button red" onClick={(e) => {e.preventDefault(); setEditID(null); }}>
                            Cancel
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubmitForm;
