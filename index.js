require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ZALO_OA_TOKEN = process.env.ZALO_OA_ACCESS_TOKEN;

app.post('/api/check-oa-status', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const response = await axios.get(
      'https://openapi.zalo.me/v2.0/oa/getprofile',
      {
        params: {
          data: JSON.stringify({ user_id }),
        },
        headers: {
          access_token: ZALO_OA_TOKEN,
        },
      }
    );

    const isFollowing = response.data?.data?.follow === true;
    res.json({ isFollowing });
  } catch (err) {
    console.error("Zalo API error:", err.response?.data || err.message);
    res.status(500).json({ error: 'Zalo API failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Zalo OA Backend running at http://localhost:${PORT}`);
});
