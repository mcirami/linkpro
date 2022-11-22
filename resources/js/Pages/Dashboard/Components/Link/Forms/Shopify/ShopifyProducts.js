import React, {useEffect, useState} from 'react';
import SingleProduct from './SingleProduct';
import ShopifyAddProducts from './ShopifyAddProducts';
import {isEmpty} from 'lodash';
import {getStores} from '../../../../../../Services/UserService';
import {ImPlus} from 'react-icons/im';

const ShopifyProducts = ({
                             selectedProducts,
                             setSelectedProducts,
                             allProducts,
                             setAllProducts,
                             displayAllProducts,
                             setDisplayAllProducts,
                             handleChange,
                             inputKey,
                             currentLink,
                             setCurrentLink,
                             setShowLoader,
                             shopifyStores
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

    const handleStoreChange = (e) => {
        e.preventDefault();

        setCurrentLink({
            ...currentLink,
            shopify_id: e.target.value,
            shopify_products: null,
        })
        setSelectedProducts([]);
    }

    return (
        <div className="my_row products_wrap">

            {displayAllProducts ?
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
                           onClick={(e) => { e.preventDefault(); setDisplayAllProducts(false);}}
                        >
                            Cancel
                        </a>
                    </div>
                </>

                :

                <>
                    <label>Shopify Stores</label>
                    <select
                        name="shopify_store"
                        onChange={(e) => handleStoreChange(e)}
                        value={currentLink.shopify_id || undefined}
                    >
                        <option>Select Store</option>
                        {!isEmpty(shopifyStores) && shopifyStores?.map((store) => {
                            return (
                                <option
                                    key={store.id}
                                    value={store.id}>{store.domain}
                                </option>
                            )
                        })}
                    </select>
                    <div className="my_row add_more_link mb-4 mt-3">
                        <a className="icon_wrap" href="#" onClick={(e) => handleAddStore(e)}>
                            <ImPlus />
                            <h3>Add a Store</h3>
                        </a>
                    </div>
                    <div className="my_row">
                        <label>Selected Products</label>
                        <div className="selected_products my_row">
                            {currentLink.shopify_products ?
                                <div className="products_grid">
                                    {currentLink.shopify_products?.map(
                                        (product) => {

                                            return (
                                                <SingleProduct
                                                    key={product.id}
                                                    product={product}
                                                />
                                            )
                                        })}
                                </div>
                                :
                                <div className="info_message">
                                    <p>You don't have any products selected.</p>
                                    <p>Click 'Add Products' below to start adding products from your store.</p>
                                </div>
                            }
                        </div>

                        <div className="add_more_link mb-4 mt-3">
                            <ShopifyAddProducts
                                setDisplayAllProducts={setDisplayAllProducts}
                                setAllProducts={setAllProducts}
                                setShowLoader={setShowLoader}
                                currentLink={currentLink}
                            />
                        </div>

                    </div>
                </>
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
