const { db } = require('../config/firebase');

const getSkills = async (req, res) => {
  try {
    const snapshot = await db.collection('skills').orderBy('proficiency', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, icon, proficiency } = req.body;
    const newDoc = { name, icon, proficiency: Number(proficiency), created_at: new Date().toISOString() };
    const docRef = await db.collection('skills').add(newDoc);
    res.status(201).json({ message: 'Skill added successfully', data: { id: docRef.id, ...newDoc } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.proficiency) updates.proficiency = Number(updates.proficiency);
    const docRef = db.collection('skills').doc(id);
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    res.json({ message: 'Skill updated successfully', data: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('skills').doc(id).delete();
    res.json({ message: 'Skill deleted successfully', deleted: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
};
