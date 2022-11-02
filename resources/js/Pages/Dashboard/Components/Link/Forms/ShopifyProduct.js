import React from 'react';

const ShopifyProduct = ({product}) => {

    const [id, title, product_url, image_url, price] = product;

    return (
        <div className="single_product">
            <a href={product_url}>
                <img src={image_url} alt={title}/>
                <h3>{title}</h3>
                <p>{price}</p>
            </a>
        </div>
    );
};

export default ShopifyProduct;
