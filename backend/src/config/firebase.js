const admin = require('firebase-admin');
require('dotenv').config();

if (!admin.apps.length) {
  try {
    const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (serviceAccountStr) {
      const serviceAccount = typeof serviceAccountStr === 'string' 
        ? JSON.parse(serviceAccountStr) 
        : serviceAccountStr;
        
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
        
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('✅ Firebase Admin & Firestore Initialized successfully');
    } else {
      console.warn("⚠️ Firebase Admin SDK not initialized. Provide FIREBASE_SERVICE_ACCOUNT_JSON");
    }
  } catch (error) {
    console.error("❌ Failed to initialize Firebase:", error.message);
  }
}

const db = admin.firestore();

module.exports = { admin, db };
