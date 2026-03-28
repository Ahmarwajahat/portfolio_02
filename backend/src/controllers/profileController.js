const supabase = require('../config/supabase');

// Get the profile (returns the first row, since we only have one admin profile)
const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data || {});
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Update the profile (or insert if it doesn't exist)
const updateProfile = async (req, res) => {
  try {
    const profileData = req.body;
    
    // Check if a profile exists
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profile')
      .select('id')
      .limit(1);

    if (checkError) {
       return res.status(500).json({ error: checkError.message });
    }

    let result;
    if (existingProfiles && existingProfiles.length > 0) {
      // Update existing
      result = await supabase
        .from('profile')
        .update({ ...profileData, updated_at: new Date() })
        .eq('id', existingProfiles[0].id)
        .select();
    } else {
      // Insert new
      result = await supabase
        .from('profile')
        .insert([{ ...profileData }])
        .select();
    }

    if (result.error) {
       return res.status(500).json({ error: result.error.message });
    }
    
    res.status(200).json(result.data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

module.exports = { getProfile, updateProfile };
