import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB bağlantı xətası: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('Məsləhət: MongoDB Atlas-da IP ünvanınızın whitelist-ə əlavə olunduğundan və internet bağlantınızın SRV qeydlərini dəstəklədiyindən əmin olun.');
    }
    process.exit(1);
  }
};

export default connectDB;
