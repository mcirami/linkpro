
const ShowPreviewButton = () => {

    const ShowPreview = () => {
        document.querySelector('.links_col.preview').classList.add('show');
        document.querySelector('body').classList.add('fixed');
    }

    return (

        <div className="preview_button_wrap my_row">
            <a className="button blue" onClick={ShowPreview}>
                Show Live Preview
            </a>
        </div>
    )
}

export default ShowPreviewButton;
