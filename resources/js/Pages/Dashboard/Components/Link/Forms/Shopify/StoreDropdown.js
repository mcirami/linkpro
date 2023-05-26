import React, {useEffect, useRef} from 'react';
import {isEmpty} from 'lodash';
import {ImPlus} from 'react-icons/im';
import {
    HandleBlur,
    HandleFocus,
    InputEventListener,
} from '../../../../../../Utils/InputAnimations';

const StoreDropdown = ({
                           currentLink,
                           setCurrentLink,
                           setSelectedProducts,
                           setShowAddStore,
                           shopifyStores,
}) => {

    const myRef = useRef(null);

    useEffect(() => {

        InputEventListener(myRef.current);

    },[])

    const handleStoreChange = (e) => {
        e.preventDefault();

        setCurrentLink({
            ...currentLink,
            shopify_id: e.target.value,
            shopify_products: null,
        })
        setSelectedProducts([]);
    }

    const handleAddStore = (e) => {
        e.preventDefault();
        setShowAddStore(true);
    }

    return (
        <div className="my_row position-relative">
            <select
                ref={myRef}
                name="shopify_store"
                onChange={(e) => handleStoreChange(e)}
                onBlur={(e) => HandleBlur(e.target)}
                onFocus={(e) => HandleFocus(e.target)}
                value={currentLink.shopify_id || undefined}
            >
                <option value=""></option>
                {!isEmpty(shopifyStores) && shopifyStores?.map((store) => {
                    return (
                        <option
                            key={store.id}
                            value={store.id}>{store.domain}
                        </option>
                    )
                })}
            </select>
            <label htmlFor="shopify_store">Shopify Stores</label>
            <div className="my_row add_more_link mb-4 mt-3">
                <a className="icon_wrap" href="#" onClick={(e) => handleAddStore(e)}>
                    <ImPlus />
                    <h3>Add a Store</h3>
                </a>
            </div>
        </div>
    );
};

export default StoreDropdown;
