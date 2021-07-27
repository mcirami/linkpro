import React, {useState, useEffect} from 'react';
import axios, {post} from "axios";

const page_profile_path = user.page_profile_path;

const PageProfile = ({page}) => {
    const currentPageProfileIMG = page_profile_path + "/" + page["profile_img"];

    const [pageProfileIMG, setPageProfileIMG] = useState(currentPageProfileIMG);

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        createImage(files[0]);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            setPageProfileIMG(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fileUpload(pageProfileIMG);
    }

    const fileUpload = (image) => {

        const packets = {
            profile_img: image,
        };

        axios.post('/dashboard/page/profile-update/' + page["id"], packets).then(
            response => console.log(JSON.stringify(response.data))
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {/*{selectedFile ? <img src={preview} /> :*/}
            <div className="row">
                <div className="col-3">
                    <img id="profile_img" src={pageProfileIMG} name="profile_img" alt=""/>
                </div>
            {/*  }*/}
                <div className="col-9">
                    <input type="file"
                           onChange={onSelectFile}
                    />
                    <button type="submit">
                        Upload
                    </button>
                </div>
            </div>
        </form>

    )
}

export default PageProfile;
