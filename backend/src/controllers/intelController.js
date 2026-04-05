const { db } = require('../config/firebase');

const getLogs = async (req, res) => {
  try {
    const snapshot = await db.collection('classified_logs').orderBy('created_at', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createLog = async (req, res) => {
  try {
    const { title, description, image_url, date, category, link } = req.body;
    const newDoc = { title, description, image_url, date, category, link, created_at: new Date().toISOString() };
    const docRef = await db.collection('classified_logs').add(newDoc);
    res.status(201).json({ message: 'Log created', data: { id: docRef.id, ...newDoc } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const docRef = db.collection('classified_logs').doc(id);
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    res.json({ message: 'Log updated', data: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('classified_logs').doc(id).delete();
    res.json({ message: 'Log deleted', deleted: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = { getLogs, createLog, updateLog, deleteLog };
