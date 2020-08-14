const axios = require("axios");
const { GET_ACTIVE_USER_PROFILE_URL } = require("../constants");

module.exports = async (authHeader) => {
  try {
    const requestConfig = {
      headers: authHeader,
    };
    // Get user profile info
    const { data: userProfileData } = await axios.get(
      GET_ACTIVE_USER_PROFILE_URL,
      requestConfig
    );

    const newUserInfo = {
      createdAt: Date.now(),
      displayName: userProfileData.display_name,
      profileImageUrl: userProfileData.images[0].url,
      country: userProfileData.country,
    };

    // return JSON.stringify(userProfileRes.data, null, 2);
    return newUserInfo;
  } catch (error) {
    console.error(`Error in data request ${error}`);
  }
};
