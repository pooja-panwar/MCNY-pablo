//base urls
export const SITE_URL = "http://walkabout.live/";
export const BASE_URL = "http://walkabout.live/api/v1/";
export const IMG_URL = "http://walkabout.live/profile_image/"

//api list
const APIList = {
    LOGIN: `${BASE_URL}users/login`,
    REGISTER: `${BASE_URL}users/registration`,
    FORGOT_PASSWORD: `${BASE_URL}users/forgot-password`,
    HOME_TOUR_LIST: `${BASE_URL}tour/list`,
    TOUR_DETAIL: `${BASE_URL}tour/detail`,
    CHANGE_PASSWORD: `${BASE_URL}users/change-password`,
    PROFILE: `${BASE_URL}users/edit-profile`,
    GETBTTOKEN: `${BASE_URL}tour/getClientToken`,
    PAYMENT: `${BASE_URL}tour/payment`,
    USER_TOUR_LIST: `${BASE_URL}tour/user`,
    MAGAZINE_LIST: `${BASE_URL}magazine/list`,
    ADD_SUBSCRIPTION: `${BASE_URL}tour/add-subscription`,
    MY_SUBSCRIPTIONS: `${BASE_URL}tour/subscription`,
    VERIFY_OTP: `${BASE_URL}magazine/verify-otp`,
    DOWNLOAD_REPORT: `${BASE_URL}tour/download`
};
export default APIList;
