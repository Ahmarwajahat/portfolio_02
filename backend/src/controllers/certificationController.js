const { db } = require('../config/firebase');

const getCertifications = async (req, res) => {
  try {
    const snapshot = await db.collection('certifications').orderBy('created_at', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createCertification = async (req, res) => {
  try {
    const { title, issuer, description, color } = req.body;
    const newDoc = { title, issuer, description, color: color || '#10b981', created_at: new Date().toISOString() };
    const docRef = await db.collection('certifications').add(newDoc);
    res.status(201).json({ message: 'Certification created', data: { id: docRef.id, ...newDoc } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const docRef = db.collection('certifications').doc(id);
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    res.json({ message: 'Certification updated', data: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('certifications').doc(id).delete();
    res.json({ message: 'Certification deleted', deleted: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = { getCertifications, createCertification, updateCertification, deleteCertification };
