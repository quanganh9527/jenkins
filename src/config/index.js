export default {
  serverURI:
    process.env.NODE_ENV === "production"
      ? "/inspection-api"
      : "http://localhost:1337",
  S3_IMAGE_PATH:
    process.env.NODE_ENV === "production"
      ? "images"
      : "images",
};

// 'https://eeac-portal.ee-acco-staging.test.infodation.vn/inspection-api'
