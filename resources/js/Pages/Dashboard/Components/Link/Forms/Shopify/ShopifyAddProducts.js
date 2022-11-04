import React from 'react';
import {ImPlus} from 'react-icons/im';

const ShopifyAddProducts = ({setDisplayAllProducts}) => {

    const handleClick = (e) => {
        e.preventDefault();
        setDisplayAllProducts(true)
    }

    return (
        <a className="icon_wrap" href="resources/js/Pages/Dashboard/Components/Link/Forms/Shopify/ShopifyAddProducts#" onClick={(e) => handleClick(e)}>
            <ImPlus />
            <h3>Add Products</h3>
        </a>
    )
};

export default ShopifyAddProducts;
