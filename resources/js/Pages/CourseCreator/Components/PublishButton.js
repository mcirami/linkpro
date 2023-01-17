import React from 'react';
import {publishOffer} from '../../../Services/OfferRequests';
import {OFFER_ACTIONS} from '../Reducer';

const PublishButton = ({offerID, dispatchOffer}) => {


   const handleOnClick = (e) => {
       e.preventDefault();

       const packets = {
           published: true,
       };

       publishOffer(packets, offerID)
       .then((response) => {
           if (response.success) {
               dispatchOffer({
                   type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                   payload: {
                       value: true,
                       name: "published"
                   }
               })
           }
       });
   }

    return (
        <div className="my_row">
            <a className="button blue" href="#" onClick={(e) => handleOnClick(e)}>
                Publish
            </a>
        </div>
    );
};

export default PublishButton;
