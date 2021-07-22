import React, {useState, useEffect} from 'react';
import axios, {post} from "axios";

const page_profile_path = user.page_profile_path;

const PageProfile = ({page}) => {
    const currentPageProfileIMG = page_profile_path + "/" + page["profile_img"];

    const [pageProfileIMG, setPageProfileIMG] = useState(currentPageProfileIMG);
    //const [selectedFile, setSelectedFile] = useState();
    //const [preview, setPreview] = useState();

    // create a preview as a side effect, whenever selected file is changed
    /* useEffect(() => {
         if (!selectedFile) {
             setPreview(undefined)
             return
         }

         setPageHeader(selectedFile["name"]);

         const objectUrl = URL.createObjectURL(selectedFile)
         setPreview(objectUrl)

         // free memory when ever this component is unmounted
         return () => URL.revokeObjectURL(objectUrl)
     }, [selectedFile])*/

    /*useEffect(() => {

        const currentPageHeader = "/storage/page-headers/" + page["page_header_img"];
        setPageHeader(currentPageHeader);

    }, [pageHeader]);*/

    const onSelectFile = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }

        createImage(files[0]);

        // I've kept this example simple by using the first image instead of multiple
        //setSelectedFile(e.target.files[0])
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
        /*const packets = {
            page_header_img: pageHeader,
            page_id: page["id"]
        };

        axios.post('/dashboard/page/header', packets).then(
            response => alert(JSON.stringify(response.data))
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });*/
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
