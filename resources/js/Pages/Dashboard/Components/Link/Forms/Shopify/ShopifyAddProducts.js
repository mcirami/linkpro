import React, {useEffect, useState} from 'react';
import {ImPlus} from 'react-icons/im';
import {getAllProducts} from '../../../../../../Services/UserService';
import {isEmpty} from 'lodash';
import {FaExclamationTriangle} from 'react-icons/fa';

const ShopifyAddProducts = ({
                                setDisplayAllProducts,
                                setAllProducts,
                                setShowLoader,
                                currentLink
}) => {

    const [error, setError] = useState(null);

    useEffect(() => {

        if(error) {
            const errorTimeout = setTimeout(() => {
                setError(null);
            }, 3000);

            return () => window.clearTimeout(errorTimeout);
        }

    },[error])

    const handleClick = (e) => {
        e.preventDefault();

        if (currentLink.shopify_id) {
            setShowLoader({show: true, icon: "loading", position: "absolute"});

            getAllProducts(currentLink.shopify_id).then(
                (data) => {
                    if (data.success) {
                        !isEmpty(data.products) &&
                        setAllProducts(data.products);
                        setDisplayAllProducts(true)
                        setShowLoader({show: false, icon: "", position: ""});
                    }
                }
            )
        } else {
            setError("Please select a Shopify store above to add products")
        }
    }

    return (
        <>
            <a className="icon_wrap" href="resources/js/Pages/Dashboard/Components/Link/Forms/Shopify/ShopifyAddProducts#" onClick={(e) => handleClick(e)}>
                <ImPlus />
                <h3>Add Products</h3>
            </a>
            {error &&
                <div className="inline_error_message">
                    <FaExclamationTriangle />
                    <p>{error}</p>
                </div>
            }
        </>

    )
};

export default ShopifyAddProducts;