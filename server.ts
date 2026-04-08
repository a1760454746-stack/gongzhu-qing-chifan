import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const DB_FILE = path.resolve('db.json');

function readDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      return { restaurants: [], orders: [] };
    }
  }
  return { restaurants: [], orders: [] };
}

function writeDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Ensure DB exists
readDB();

// ==========================================
// Helper function for PushPlus WeChat Notifications
// ==========================================
function sendPushPlusNotification(token: string, title: string, content: string) {
  if (!token) return;
  fetch('http://www.pushplus.plus/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: token,
      title: title,
      content: content,
      template: 'html'
    })
  }).catch(console.error);
}

// ==========================================
// API Routes
// ==========================================

// 1. Health Check Route (For UptimeRobot Keep-Alive)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/restaurants', (req, res) => {
  const db = readDB();
  res.json(db.restaurants);
});

app.get('/api/restaurants/:id', (req, res) => {
  const db = readDB();
  const restaurant = db.restaurants.find((r: any) => r.id === req.params.id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: 'Restaurant not found' });
  }
});

app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json(db.orders.sort((a: any, b: any) => b.createdAt - a.createdAt));
});

app.post('/api/orders', (req, res) => {
  const db = readDB();
  const newOrder = {
    id: Date.now().toString(),
    ...req.body,
    status: 'pending', // pending, accepted, delivering, completed
    createdAt: Date.now()
  };
  db.orders.push(newOrder);
  writeDB(db);
  
  // Send WeChat Notification to Boyfriend when order is placed
  if (process.env.PUSHPLUS_TOKEN) {
    const itemsText = newOrder.items.map((i: any) => `${i.name} x${i.quantity}`).join('<br/>');
    sendPushPlusNotification(
      process.env.PUSHPLUS_TOKEN,
      '【专属外卖】宝贝下单啦！',
      `<strong>餐厅：</strong>${newOrder.restaurantName}<br/><br/><strong>内容：</strong><br/>${itemsText}<br/><br/>快去控制台接单吧！`
    );
  }

  res.json(newOrder);
});

app.patch('/api/orders/:id', (req, res) => {
  const db = readDB();
  const orderIndex = db.orders.findIndex((o: any) => o.id === req.params.id);
  
  if (orderIndex > -1) {
    db.orders[orderIndex] = { ...db.orders[orderIndex], ...req.body };
    writeDB(db);
    
    const updatedOrder = db.orders[orderIndex];

    // Send WeChat Notification to Girlfriend if accepted
    if (req.body.status === 'accepted' && process.env.GF_PUSHPLUS_TOKEN) {
      sendPushPlusNotification(
        process.env.GF_PUSHPLUS_TOKEN,
        '【专属外卖】骑手已接单！',
        `亲爱的宝贝，你的外卖（<strong>${updatedOrder.restaurantName}</strong>）已被专属骑手接单啦！正在火速准备中~ 🛵💨`
      );
    }

    // Send WeChat Notification to Girlfriend if completed
    if (req.body.status === 'completed' && process.env.GF_PUSHPLUS_TOKEN) {
      sendPushPlusNotification(
        process.env.GF_PUSHPLUS_TOKEN,
        '【专属外卖】外卖已送达！',
        `亲爱的宝贝，你的外卖（<strong>${updatedOrder.restaurantName}</strong>）已经送达啦！快去享用吧~ 爱你哦！❤️`
      );
    }

    res.json(updatedOrder);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// ==========================================
// Server Setup
// ==========================================
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // Explicit SPA fallback for development
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();