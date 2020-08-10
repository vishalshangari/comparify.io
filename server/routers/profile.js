const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", (req, res) => {
  // console.log("profile request");
  // console.log(req.headers);

  const options = {
    headers: { Authorization: req.headers.authorization },
    json: true,
  };
  // request.get(options, (error, response, body) => {
  //   res.send(body);
  // });

  const getProfile = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me",
        options
      );
      // console.log(response);
      res.json(response.data);
    } catch (error) {
      res.send(error);
      console.error(error);
    }
  };
  getProfile();
});

module.exports = router;
