const { db } = require('../config/firebase');

const getBlogs = async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').orderBy('created_at', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, category, category_color, description, image_url, link } = req.body;
    const newDoc = { title, category, category_color: category_color || '#10b981', description, image_url, link, created_at: new Date().toISOString() };
    const docRef = await db.collection('blogs').add(newDoc);
    res.status(201).json({ message: 'Blog created', data: { id: docRef.id, ...newDoc } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const docRef = db.collection('blogs').doc(id);
    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    res.json({ message: 'Blog updated', data: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('blogs').doc(id).delete();
    res.json({ message: 'Blog deleted', deleted: { id } });
  } catch (err) {
    res.status(500).json({ error: err.message, status: 'failed' });
  }
};

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog };
