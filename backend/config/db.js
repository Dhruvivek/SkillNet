// FILE: config/db.js
const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  // Use Google DNS to resolve MongoDB Atlas SRV records
  // Fixes ECONNREFUSED on networks that block SRV lookups
  dns.setServers(['8.8.8.8', '8.8.4.4']);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
