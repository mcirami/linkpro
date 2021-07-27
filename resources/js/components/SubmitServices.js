import axios from 'axios';

const SubmitServices = {

    selectIcon: function(e, source) {

        const el = e.target;
        el.classList.add("active");

        const packets = {
            name: name,
            url: url,
            icon: source,
            page_id: pageID,
        };

        if (id) {
            axios
            .post("/dashboard/links/" + id, packets)
            .then(
                (response) => console.log(JSON.stringify(response.data)),
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                name: item.name,
                                url: item.url,
                                icon: source,
                            };
                        }
                        return item;
                    })
                ),
                setShowIcons(false)
            )
            .catch((error) => {
                console.log("ERROR:: ", error.response.data);
            });

        } else {
            axios
            .post("/dashboard/links/new", packets)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                const link_id = JSON.stringify(response.data.link_id);
                setUserLinks(
                    userLinks.map((item) => {
                        if (item.id === id) {
                            return {
                                ...item,
                                id: link_id,
                                name: item.name,
                                url: item.url,
                                icon: source,
                                page_id: pageID,
                            };
                        }
                        return item;
                    })
                );

                setShowIcons(false);
            })
            .catch((error) => {
                console.log("ERROR:: ", error.response.data);
            });
        }
    }
};

export default SubmitServices;
