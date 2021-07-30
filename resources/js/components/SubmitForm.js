import React from "react";
import IconList from "./IconList";

const SubmitForm = ({
    handleSubmit,
    deleteItem,
    linkID,
    setLinkID,
    currentLink,
    setName,
    setLink,
    setLinkIcon,
    showIcons,
    setShowIcons,
    page,
}) => {
    let { id, name, link, link_icon } = currentLink;

    //setName(name);
    //setLink(link);

    return (
        <div className="edit_form">
            <form onSubmit={handleSubmit} className="links_forms">
                <div className="row">
                    <div className="col-4">
                        {/*<input name="name" type="file" onChange={(e) => handleChange(e) }/>*/}
                        <img
                            id="current_icon"
                            src={link_icon}
                            name="link_icon"
                            alt=""
                        />

                        <a href="#" onClick={(e) => setShowIcons(true)}>
                            Change Icon
                        </a>
                        {showIcons ? (
                            <IconList setShowIcons={setShowIcons} />
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="col-8">
                        <input
                            name="name"
                            type="text"
                            defaultValue={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            name="link"
                            type="text"
                            defaultValue={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                        <input type="hidden" value={page["id"]} />
                    </div>
                </div>
                <button type="submit">
                    {linkID && !linkID.toString().includes("new")
                        ? "Update"
                        : "Add Link"}
                </button>
                {linkID && !linkID.toString().includes("new") ? (
                    <a href="#" onClick={(e) => deleteItem(e)}>
                        Delete
                    </a>
                ) : (
                    ""
                )}
                <a href="#" onClick={() => setLinkID(null)}>
                    Cancel
                </a>
            </form>
        </div>
    );
};

export default SubmitForm;
