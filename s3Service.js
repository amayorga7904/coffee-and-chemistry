require('dotenv').config(); // Load environment variables from .env file

const axios = require('axios');

async function uploadFile(file) {
  const { originalname, buffer } = file;
  const contentType = file.mimetype;
  const fileName = originalname; // You may want to generate a unique file name here
  
  const bucketName = process.env.S3_BUCKET; // Get S3 bucket name from environment variable
  const s3Url = `https://${bucketName}.s3.amazonaws.com/${fileName}`;

  try {
    const response = await axios.put(s3Url, buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.length,
        // Add any other headers required for authentication or metadata
      },
    });
    console.log('File uploaded successfully:', response.data);
    return s3Url;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
}

module.exports = uploadFile; // Export the uploadFile function
