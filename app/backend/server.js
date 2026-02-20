const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
// Tăng giới hạn payload để có thể upload chuỗi Base64 dài
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Kết nối PostgreSQL thông qua biến môi trường từ Docker
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'lixi_tet',
  password: process.env.POSTGRES_PASSWORD || 'adminpassword',
  port: 5432,
});

// Dữ liệu mẫu dự phòng cực kỳ quan trọng để giao diện không bị treo khi DB trống
const MOCK_CAMPAIGN = {
  id: 'default',
  name: 'Chiến dịch Xuân 2026',
  budget: 5000000,
  spent: 0,
  envelope_count: 8,
  envelope_images: [],
  prizes: [
    { id: 1, amount: 10000, quantity: 100, image_url: "https://upload.wikimedia.org/wikipedia/vi/thumb/e/e6/10000_dong_front.jpg/640px-10000_dong_front.jpg" },
    { id: 2, amount: 20000, quantity: 50, image_url: "https://upload.wikimedia.org/wikipedia/vi/thumb/6/62/20000_dong_front.jpg/640px-20000_dong_front.jpg" },
    { id: 3, amount: 50000, quantity: 20, image_url: "https://upload.wikimedia.org/wikipedia/vi/6/6f/50000_dong_front.jpg" }
  ]
};

// --- API ROUTES ---

// --- API QUẢN LÝ CÀI ĐẶT CHUNG (Settings) ---
app.get('/api/admin/settings/:key', async (req, res) => {
  try {
    const result = await pool.query('SELECT value FROM app_settings WHERE key = $1', [req.params.key]);
    if (result.rows.length > 0) {
      return res.json(JSON.parse(result.rows[0].value));
    }
    res.json(null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    await pool.query(
      'INSERT INTO app_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
      [key, JSON.stringify(value)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 1. Thêm mới chiến dịch
app.post('/api/admin/campaigns', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id, name, budget, envelope_count, envelope_images, prizes } = req.body;
    
    // Tạo chiến dịch
    await client.query(
      'INSERT INTO campaigns (id, name, budget, spent, envelope_count, envelope_images) VALUES ($1, $2, $3, 0, $4, $5)',
      [id, name, budget, envelope_count, JSON.stringify(envelope_images || [])]
    );

    // Thêm danh sách giải thưởng
    if (prizes && prizes.length > 0) {
      for (let p of prizes) {
        await client.query(
          'INSERT INTO prizes (campaign_id, amount, quantity, image_url) VALUES ($1, $2, $3, $4)',
          [id, p.amount, p.quantity, p.image_url]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// 2. Sửa chiến dịch đã có
app.put('/api/admin/campaigns/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const { name, budget, envelope_count, envelope_images, prizes } = req.body;

    // Cập nhật thông tin chiến dịch
    await client.query(
      'UPDATE campaigns SET name = $1, budget = $2, envelope_count = $3, envelope_images = $4 WHERE id = $5',
      [name, budget, envelope_count, JSON.stringify(envelope_images || []), id]
    );

    // Xóa giải thưởng cũ và thêm lại cái mới
    await client.query('DELETE FROM prizes WHERE campaign_id = $1', [id]);
    
    if (prizes && prizes.length > 0) {
      for (let p of prizes) {
        await client.query(
          'INSERT INTO prizes (campaign_id, amount, quantity, image_url) VALUES ($1, $2, $3, $4)',
          [id, p.amount, p.quantity, p.image_url]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Lấy danh sách chiến dịch (Admin)
app.get('/api/admin/campaigns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
    res.json(result.rows.length > 0 ? result.rows : [MOCK_CAMPAIGN]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy thông tin chi tiết một chiến dịch (User)
app.get('/api/lixi/campaign/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching campaign: ${id}`);
    
    let campRes = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
    
    if (campRes.rows.length === 0) {
      campRes = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC LIMIT 1');
    }
    
    if (campRes.rows.length === 0) {
      console.log("Database is empty, returning mock data");
      return res.json(MOCK_CAMPAIGN);
    }
    
    const campaign = campRes.rows[0];
    const prizesRes = await pool.query('SELECT * FROM prizes WHERE campaign_id = $1', [campaign.id]);
    
    res.json({ 
      ...campaign, 
      envelope_count: campaign.envelope_count || 8,
      envelope_images: typeof campaign.envelope_images === 'string' ? JSON.parse(campaign.envelope_images) : (campaign.envelope_images || []),
      prizes: prizesRes.rows 
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.json(MOCK_CAMPAIGN); 
  }
});

// Xử lý quay thưởng
app.post('/api/lixi/spin', async (req, res) => {
  const client = await pool.connect();
  try {
    const { campaignId } = req.body;
    await client.query('BEGIN');

    const dbCheck = await client.query('SELECT id FROM campaigns WHERE id = $1', [campaignId]);
    if (dbCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.json(MOCK_CAMPAIGN.prizes[Math.floor(Math.random() * MOCK_CAMPAIGN.prizes.length)]);
    }

    const prizesRes = await client.query(
      'SELECT * FROM prizes WHERE campaign_id = $1 AND quantity > 0 FOR UPDATE',
      [campaignId]
    );

    if (prizesRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "Hết giải thưởng!" });
    }

    const wonPrize = prizesRes.rows[Math.floor(Math.random() * prizesRes.rows.length)];

    await client.query(
      'UPDATE prizes SET quantity = quantity - 1 WHERE id = $1',
      [wonPrize.id]
    );

    await client.query('COMMIT');
    res.json(wonPrize);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// Lưu giao dịch nhận tiền
app.post('/api/lixi/confirm', async (req, res) => {
  try {
    const { campaignId, prizeId, amount, user_name, bank_code, bank_account } = req.body;
    
    const dbCheck = await pool.query('SELECT id FROM campaigns WHERE id = $1', [campaignId]);
    if (dbCheck.rows.length === 0) {
      return res.json({ success: true, note: "Mock data session, not saved to DB" });
    }

    const transactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    await pool.query(
      'INSERT INTO transactions (id, campaign_id, user_name, bank_code, bank_account, amount, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [transactionId, campaignId, user_name, bank_code, bank_account, amount, 'PENDING']
    );

    await pool.query('UPDATE campaigns SET spent = spent + $1 WHERE id = $2', [amount, campaignId]);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy hàng đợi thanh toán cho Admin
app.get('/api/admin/queue', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions WHERE status = 'PENDING' ORDER BY created_at ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xác nhận đã trả thưởng
app.post('/api/admin/pay/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE transactions SET status = 'PAID' WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PHỤC VỤ FRONTEND ---
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: "API Endpoint not found" });
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}. Static files at: ${publicPath}`));