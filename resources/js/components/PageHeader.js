import React, {useState, useEffect} from 'react';
import axios, {post} from "axios";

const page_header_path = user.page_header_path;

const PageHeader = ({page}) => {

    const currentPageHeader = page_header_path + "/" + page["header_img"];

    const [pageHeader, setPageHeader] = useState(currentPageHeader);
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

        const currentPageHeader = "/storage/page-headers/" + page["header_img"];
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
            setPageHeader(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        fileUpload(pageHeader);
    }

   const fileUpload = (image) => {

       const packets = {
           header_img: image,
       };

       axios.post('/dashboard/page/header-update/' + page["id"], packets).then(
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
                    <img id="header_img" src={pageHeader} name="header_img" alt=""/>
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

export default PageHeader;
