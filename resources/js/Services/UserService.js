const userSub = user.userSub;

export const checkSubStatus = () => {

    if (userSub) {
        const {braintree_status, ends_at} = {...userSub};
        const currentDate = new Date().valueOf();
        const endsAt = new Date(ends_at).valueOf();

        console.log(userSub);

        return (braintree_status === 'active' || braintree_status ===
            'pending') || endsAt > currentDate;

    }


    return false;
}

export const checkIcon = (icon, type) => {
    let asset;

    if(type === "preview") {
        asset = Vapor.asset('images/icon-placeholder-preview.png')
    } else {
        asset = Vapor.asset('images/icon-placeholder.png');
    }

    if (icon && icon.toString().includes('custom')) {
        return checkSubStatus() ? icon : asset;
    } else {
        return icon;
    }
}
