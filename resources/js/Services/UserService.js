const userSub = user.userSub;

export const checkSubStatus = () => {

    if (userSub) {

        const {braintree_status, ends_at, braintree_id} = {...userSub};
        if (braintree_id === "bypass") {
            return true;
        } else {
            const currentDate = new Date().valueOf();
            let t = ends_at.split(/[- :]/);
            let d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
            const endsAt = new Date(d);

            if ((braintree_status === 'active' || braintree_status ===
                'pending') || endsAt > currentDate) {
                return true;
            }
        }
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
