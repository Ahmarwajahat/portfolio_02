const { db } = require('../config/firebase');

// Get all projects
const getProjects = async (req, res) => {
  try {
    const snapshot = await db.collection('projects').orderBy('created_at', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Get a single project
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection('projects').doc(id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Project not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Create a new project (Admin Only)
const createProject = async (req, res) => {
  try {
    const { title, description, image_url, live_link, github_link, tech_stack } = req.body;
    const newDoc = { title, description, image_url, live_link, github_link, tech_stack, created_at: new Date().toISOString() };
    const docRef = await db.collection('projects').add(newDoc);
    res.status(201).json({ message: 'Project created successfully', data: { id: docRef.id, ...newDoc } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Update a project (Admin Only)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const docRef = db.collection('projects').doc(id);
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    res.json({ message: 'Project updated successfully', data: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

// Delete a project (Admin Only)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('projects').doc(id).delete();
    res.json({ message: 'Project deleted successfully', deleted: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
