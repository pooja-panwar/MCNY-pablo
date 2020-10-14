import { environment } from 'src/environments/environment';

//base urls
export const SITE_URL = '';
export const BASE_URL = environment.apiUrl;
export const IMG_URL = '';

export const ApiEndPoints = {
  LOGIN: `${BASE_URL}doctor/login`,
  REGISTER: `${BASE_URL}doctor/signup`,
  VERIFY_EMAIL: `${BASE_URL}verify-email`,
  GETUSERPROFILE: `${BASE_URL}doctor/getProfileData`,
  GETMASTERDATA: `${BASE_URL}doctor/getSignUpFormData`,
  FORGOT_PASSWORD: `${BASE_URL}doctor/forgotPassword`,
  RESET_PASSWORD: `${BASE_URL}doctor/resetPassword`,
  NOTIFICATION: `${BASE_URL}notifications`,
  EDIT_DOCTOR_PROFILE: `${BASE_URL}doctor/editProfile`,
  LOGOUT: `${BASE_URL}doctor/logout`,
};
