const cloudinary = require("cloudinary").v2;

(async function () {
  // Configuration
  try {
    cloudinary.config({
      cloud_name: "dj5s3ankx",
      api_key: "464676147295243",
      api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
    });
    console.log("Successfully connect cloudinary");
  } catch (err) {
    console.log(err);
  }
})();

module.exports = cloudinary;
