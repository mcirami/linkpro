import React, {useState} from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './CropImage';
import Slider from '@material-ui/core/Slider'

const ImageCropper = ({getBlob, inputImg}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const onCropComplete = async (_, croppedAreaPixels) => {
        const croppedImage = await getCroppedImg(
            inputImg,
            croppedAreaPixels
        )
        getBlob(croppedImage);
    }

    return (
        <div className="crop_container">
            <div className="cropper">
                <Cropper image={inputImg} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
            </div>
            <div className="controls">
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e, zoom) => setZoom(zoom)}
                    classes={{ root: 'slider' }}
                />
            </div>
        </div>
    )
}
export default ImageCropper
