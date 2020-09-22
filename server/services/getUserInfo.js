// Get active user's info
const axios = require("axios");
const { GET_ACTIVE_USER_PROFILE_URL } = require("../constants");

module.exports = async (authHeader) => {
  try {
    const requestConfig = {
      headers: authHeader,
    };
    // Get user profile info
    console.log("getting user info");
    const { data: userProfileData } = await axios.get(
      GET_ACTIVE_USER_PROFILE_URL,
      requestConfig
    );

    const profileImage =
      userProfileData.images && userProfileData.images.length > 0
        ? userProfileData.images[0].url
        : ``;

    const newUserInfo = {
      _id: userProfileData.id,
      createdAt: Date.now(),
      displayName: userProfileData.display_name || null,
      profileImageUrl: profileImage,
      country: userProfileData.country,
    };

    // return JSON.stringify(userProfileRes.data, null, 2);
    return newUserInfo;
  } catch (error) {
    console.error(`Error in user profile request ${error}`);
  }
};
