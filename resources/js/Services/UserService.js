const userSub = user.userSub;

export const checkSubStatus = (icon) => {

    if (icon && icon.toString().includes('custom')) {
        if (userSub) {
            const {braintree_status, ends_at} = {...userSub};
            const currentDate = new Date().valueOf();
            const endsAt = new Date(ends_at).valueOf();

            if ((braintree_status === 'active' || braintree_status === 'pending') || endsAt > currentDate) {
                return icon;
            } else {
                return Vapor.asset(
                    'images/icon-placeholder.png');
            }
        }
    } else {
        return icon;
    }
}
