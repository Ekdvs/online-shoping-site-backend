import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect('mongodb+srv://stu0752678:rg2a8kWUOtzG3BCd@cluster0.kughe.mongodb.net/onlineShop?retryWrites=true&w=majority&appName=cluster0').then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
