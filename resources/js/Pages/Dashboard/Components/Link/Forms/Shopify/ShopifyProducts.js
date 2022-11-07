import React, {useState} from 'react';
import SingleProduct from './SingleProduct';
import {ImPlus} from 'react-icons/im';
import ShopifyAddProducts from './ShopifyAddProducts';
import {isEmpty} from 'lodash';

const ShopifyProducts = ({
                             selectedProducts,
                             setSelectedProducts,
                             allProducts,
                             displayAllProducts,
                             setDisplayAllProducts,
                             handleChange,
                             inputKey
}) => {

    const handleClick = (e) => {
        e.preventDefault();
        handleChange(selectedProducts, inputKey)
        setDisplayAllProducts(false);
    }

    return (
        <div className="my_row products_wrap">

            {displayAllProducts ?
                <>
                    <h3>Select Products to Add to Icon</h3>
                    <small>(max 6 products per icon)</small>
                    <div className="products_grid">
                        {!isEmpty(allProducts) && allProducts?.map((product) => {
                            return (
                                <SingleProduct
                                    key={product.id}
                                    product={product}
                                    setSelectedProducts={setSelectedProducts}
                                    selectedProducts={selectedProducts}

                                />
                            )
                        })}
                    </div>
                    <div className="button_wrap">
                        <a className="button blue" href="resources/js/Pages/Dashboard/Components/Link/Forms/Shopify/ShopifyProducts#"
                           onClick={(e) => handleClick(e)}
                        >
                            Add Selected Products
                        </a>
                    </div>
                    <div className="button_wrap">
                        <a className="button transparent gray" href="resources/js/Pages/Dashboard/Components/Link/Forms/Shopify/ShopifyProducts#"
                           onClick={(e) => { e.preventDefault(); setDisplayAllProducts(false);}}
                        >
                            Cancel
                        </a>
                    </div>
                </>

                :

                <div className="selected_products">
                    <h3>Selected Products</h3>
                    <div className="products_grid">
                        {selectedProducts?.map((product) => {

                            return (
                                <SingleProduct
                                    key={product.id}
                                    product={product}
                                />
                            )
                        })}
                    </div>

                    <div className="add_more_link my-4">
                        <ShopifyAddProducts setDisplayAllProducts={setDisplayAllProducts}/>
                    </div>

                </div>
            }

            {/*{products &&
                <div className="my_row remove_link">
                    <a href="#" onClick={(e) => handleClick(
                        e)}>
                        Remove Connection
                    </a>
                </div>
            }*/}
        </div>
    );
};

export default ShopifyProducts;
