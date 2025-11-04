import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017/exampledb',
  },
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

export default config;