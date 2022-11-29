import React from 'react';
import {isEmpty} from 'lodash';
import {ImPlus} from 'react-icons/im';

const StoreDropdown = ({
                           currentLink,
                           setCurrentLink,
                           setSelectedProducts,
                           setShowAddStore,
                           shopifyStores,
}) => {

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
        <div>
            <label htmlFor="shopify_store">Shopify Stores</label>
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
        </div>
    );
};

export default StoreDropdown;
