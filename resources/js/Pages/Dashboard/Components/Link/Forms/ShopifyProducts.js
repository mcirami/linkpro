import React, {useState} from 'react';
import ShopifyProduct from './ShopifyProduct';
import {ImPlus} from 'react-icons/im';
import ShopifyAddProducts from './ShopifyAddProducts';

const ShopifyProducts = ({
                             selectedProducts,
                             setSelectedProducts,
                             allProducts,
                             displayAllProducts,
                             setDisplayAllProducts
}) => {

    const handleOnClick = () => {

    }

    return (
        <div className="my_row products_wrap">

            {displayAllProducts ?
                <>
                    <h3>Select Products to Add to Icon</h3>
                    <small>(max 6 products per icon)</small>
                    <div className="all_products">
                        {allProducts?.map((product) => {
                            return (
                                <ShopifyProduct
                                    key={product.id}
                                    product={product}
                                    setSelectedProducts={setSelectedProducts}
                                    selectedProducts={selectedProducts}

                                />
                            )
                        })}
                    </div>
                    <div className="button_wrap">
                        <a className="button blue" href="#"
                           onClick={(e) => { e.preventDefault(); setDisplayAllProducts(false);}}
                        >
                            Add Selected Products
                        </a>
                    </div>
                    <div className="button_wrap">
                        <a className="button transparent gray" href="#"
                           onClick={(e) => { e.preventDefault(); setDisplayAllProducts(false); setSelectedProducts([])}}
                        >
                            Cancel
                        </a>
                    </div>
                </>

                :

                <div className="selected_products">
                    <h3>Selected Products</h3>
                    {selectedProducts.length > 0  && selectedProducts?.map((product) => {

                        return (
                            <ShopifyProduct
                                key={product.id}
                                product={product}
                            />
                        )
                    })}

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
