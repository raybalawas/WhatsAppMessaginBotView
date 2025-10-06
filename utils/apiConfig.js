// export const API_BASE_URL = "http://localhost:3000/api"; // Backend URL
// export const API_BASE_URL = "https://whatsappmessaginbot.onrender.com/api";
export const API_BASE_URL = "https://whatsappmessaginbot-1.onrender.com";
export const SIGNUP_ENDPOINT = `${API_BASE_URL}/users/signup`;
export const SIGNIN_ENDPOINT = `${API_BASE_URL}/users/login`;
export const USER_PROFILE_UPDATE_ENDPOINT = `${API_BASE_URL}/users/update`;
export const USER_LIST_ENDPOINT = `${API_BASE_URL}/users/list`;
export const USER_CAMPAIGN_SUBMIT = `${API_BASE_URL}/users/submit-campaign`;
export const USER_CAMP_FETCH_BY_USER_ID = `${API_BASE_URL}/users/get-camp-by-user-id`;
export const getUserCampaignsUrl = (id) =>
  `${API_BASE_URL}/users/get-camp-by-user-id/${id}`;
export const USER_DELETE_WITH_CAMPAIGN = `${API_BASE_URL}/users/delete`;
