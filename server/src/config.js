export default {
  port: process.env.PORT || 3002,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  TOKEN_KEY: process.env.TOKEN_KEY,
};
