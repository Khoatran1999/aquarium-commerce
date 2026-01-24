const express = require('express')
const router = express.Router()
const { supabase } = require('../supabaseClient')

router.get('/health', (req, res) => res.json({ ok: true }))

router.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(100)
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
