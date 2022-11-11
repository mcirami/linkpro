import React, {useEffect, useState} from 'react';

const SingleProduct = ({product, setSelectedProducts, selectedProducts}) => {

    const {id, title, product_url, image_url, price} = product;
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {

        selectedProducts?.length > 0 && selectedProducts.find(function (e) {
            if (e.id === id) {
                setSelectedId(e.id)
            }
        })

    },[selectedProducts])

    const handleOnClick = (e) => {
        e.preventDefault();

        const id = e.target.dataset.id;
        let newProducts = [...selectedProducts];

        const foundProduct = newProducts.find(function(e) {
            return e.id === id
        })

        if (foundProduct) {
            setSelectedId(null);
            newProducts = newProducts.filter(element => element.id !== id);
            newProducts = newProducts.map((el, index) => {
                return ({
                    ...el,
                    position: index + 1
                })
            })

        } else {
            setSelectedId(id);
            const newObject = {
                id: id,
                title: e.target.dataset.title,
                image_url: e.target.dataset.image,
                product_url: e.target.dataset.url,
                price: e.target.dataset.price,
                position: newProducts.length + 1
            }
            newProducts = newProducts.concat(newObject)
        }
        setSelectedProducts(newProducts);
    }

    const getPosition = (id) => {
        const product = selectedProducts.length > 0 && selectedProducts?.find(function (e) {
            return e.id === id
        })
        return product.position;
    }

    return (
        <div className="single_product">
            <a href="resources/js/Pages/Dashboard/Components/Link/Forms/Shopify/ShopifyProduct#"
               className={selectedId === id ? "selected" : ""}
               data-id={id}
               data-image={image_url}
               data-title={title}
               data-url={product_url}
               data-price={price}
               onClick={(e) => handleOnClick(e)}
            >
                <div className="image_wrap">
                    <img src={image_url} alt={title}/>
                </div>
                <h3>{title}</h3>
                <p><sup>$</sup>{price}</p>
            </a>
            {selectedId === id &&
                <span className="position">{getPosition(id)}</span>
            }
        </div>
    );
};

export default SingleProduct;
