import React, {useEffect, useState} from 'react';
import SingleProduct from './SingleProduct';
import ShopifyAddProducts from './ShopifyAddProducts';
import {isEmpty} from 'lodash';
import {getStores} from '../../../../../../Services/UserService';
import {ImPlus} from 'react-icons/im';

const AllProducts = ({
                             selectedProducts,
                             setSelectedProducts,
                             allProducts,
                             setDisplayAllProducts,
                             handleChange,
                             inputKey,
                             setCurrentLink
}) => {

    const handleClick = (e) => {
        e.preventDefault();
        handleChange(selectedProducts, inputKey)
        setCurrentLink((prev) => ({
            ...prev,
            shopify_products: selectedProducts

        }))
        setDisplayAllProducts(false);
    }

    return (
        <>
            <h3>Select Products to Add to Icon</h3>
            <small>(max 6 products per icon)</small>
            <div className="products_grid">
                {!isEmpty(allProducts) && allProducts?.map((product, index) => {
                    return (
                        <SingleProduct
                            key={index}
                            product={product}
                            setSelectedProducts={setSelectedProducts}
                            selectedProducts={selectedProducts}
                        />
                    )
                })}
            </div>
            <div className="button_wrap">
                <a className="button blue" href="#"
                   onClick={(e) => handleClick(e)}
                >
                    Add Selected Products
                </a>
            </div>
            <div className="button_wrap">
                <a className="button transparent gray" href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       setDisplayAllProducts(false);
                   }}
                >
                    Cancel
                </a>
            </div>

        </>
    );
};

export default AllProducts;
