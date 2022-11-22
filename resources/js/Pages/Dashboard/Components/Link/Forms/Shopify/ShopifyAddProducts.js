import React from 'react';
import {ImPlus} from 'react-icons/im';
import {getAllProducts} from '../../../../../../Services/UserService';
import {isEmpty} from 'lodash';

const ShopifyAddProducts = ({
                                setDisplayAllProducts,
                                setAllProducts,
                                setShowLoader,
                                currentLink
}) => {

    const handleClick = (e) => {
        e.preventDefault();
        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getAllProducts(currentLink.shopify_id).then(
            (data) => {
                if (data.success) {
                    !isEmpty(data.products) && setAllProducts(data.products);
                    setDisplayAllProducts(true)
                    setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
    }

    return (
        <a className="icon_wrap" href="resources/js/Pages/Dashboard/Components/Link/Forms/Shopify/ShopifyAddProducts#" onClick={(e) => handleClick(e)}>
            <ImPlus />
            <h3>Add Products</h3>
        </a>
    )
};

export default ShopifyAddProducts;
