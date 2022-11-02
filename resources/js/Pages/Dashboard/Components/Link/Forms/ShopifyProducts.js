import React, {useState} from 'react';

const ShopifyProducts = ({selectedProducts, allProducts}) => {

    const [displayAllProducts, setDisplayAllProducts] = useState(false);

    return (
        <div className="my_row">

            {displayAllProducts ?

                <div className="all_products">
                    {allProducts.map((product) => {
                        return (
                            <ShopifyProduct
                                key={product.id}
                                product={product}
                            />
                        )
                    })}
                </div>

                :

                <div className="selected_products">
                    <h3>Products</h3>
                    {selectedProducts?.map((product) => {

                        return (
                            <ShopifyProduct
                                key={product.id}
                                product={product}
                            />
                        )
                    })}

                    <div className="add_link">
                        <a href="#" onClick={setDisplayAllProducts(true)}>
                            <span>+</span>
                            Add Products
                        </a>
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
