const { db } = require('../config/firebase');

const getProfile = async (req, res) => {
  try {
    const snapshot = await db.collection('profile').limit(1).get();
    if (snapshot.empty) {
      return res.status(200).json({});
    }
    const doc = snapshot.docs[0];
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    const snapshot = await db.collection('profile').limit(1).get();
    
    if (!snapshot.empty) {
      // Update existing
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ ...profileData, updated_at: new Date().toISOString() });
      const updatedDoc = await docRef.get();
      res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
    } else {
      // Insert new
      const newDoc = { ...profileData, created_at: new Date().toISOString() };
      const docRef = await db.collection('profile').add(newDoc);
      res.status(200).json({ id: docRef.id, ...newDoc });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };
