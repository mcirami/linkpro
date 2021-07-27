const Preview = ({links, page, count, defaultIconPath}) => {

    return (
        <div className="preview_wrap">

            <div className="inner_content">
                <h2>{page["title"]}</h2>
                <div className="icons_wrap">
                    {links.map((linkItem) => {
                        const { id, url, icon, active_status } = linkItem;
                        return (
                            <div key={id || Math.random()}>
                                { active_status ?
                                    <div className="icon_col" key={id}>
                                        <a target="_blank" href={url}>
                                            <img src={icon} />
                                        </a>
                                    </div>
                                 : "" }
                             </div>
                        )
                    })}
                    {count < 9 ?
                        <DefaultIcon count={count}
                                     defaultIconPath={defaultIconPath}
                                    />
                        : ""
                    }
                </div>
            </div>
        </div>
    );
}

const DefaultIcon = ({count, defaultIconPath}) => {

    let n = 9 - count;
    return (
        <>
            {_.times( n, () =>

                <div className="icon_col disabled" key={n}>
                    <a target="_blank" href={null}>
                        <img src={defaultIconPath} />
                    </a>
                </div>
            )}
        </>

    )
}


export default Preview;

