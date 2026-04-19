import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.ORDER_SERVICE_MONGO_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MongoDB URI. Set ORDER_SERVICE_MONGO_URI or MONGO_URI.");
  }

  await mongoose.connect(mongoUri);
  console.log("[order-service] MongoDB connected");
};

export default connectDB;
