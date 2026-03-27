const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin with credentials from env
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
      console.log('✅ Firebase Admin Initialized successfully');
    } else {
      console.warn("⚠️ Firebase Admin SDK not initialized. Provide FIREBASE_SERVICE_ACCOUNT_JSON in .env");
    }
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin:", error.message);
  }
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Return mock user in dev mode if requested by user without valid keys for now to unblock testing
    if (process.env.NODE_ENV === 'development') {
      req.user = { uid: 'dev-admin', email: 'admin@dev.local' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized Access. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("❌ Error verifying auth token:", error.message);
    res.status(403).json({ error: 'Forbidden. Invalid or expired token.' });
  }
};

module.exports = verifyToken;
