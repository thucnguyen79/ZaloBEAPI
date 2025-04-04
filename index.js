require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/check-oa-status", async (req, res) => {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const userId = req.query.userId;

  if (!userId) return res.status(400).json({ error: "Thiếu userId" });

  try {
    const response = await axios.get(
      `https://openapi.zalo.me/v2.0/oa/getprofile`,
      {
        params: {
          access_token: accessToken,
          data: JSON.stringify({ user_id: userId }),
        },
      }
    );

    const isFollowing = response.data.data?.is_subscribed === 1;
    res.json({ isFollowing });
  } catch (error) {
    console.error("❌ Lỗi Zalo API:", error?.response?.data || error.message);
    res.status(500).json({ error: "Lỗi khi kiểm tra trạng thái OA" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend đang chạy tại http://localhost:${PORT}`);
});
