import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

const DB_FILE = path.resolve('db.json');

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.QQ_EMAIL_USER,
    pass: process.env.QQ_EMAIL_PASS,
  },
});

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

// API Routes
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
  
  // Send Email to Boyfriend
  if (process.env.QQ_EMAIL_USER && process.env.QQ_EMAIL_PASS) {
    const itemsText = newOrder.items.map((i: any) => `${i.name} x${i.quantity}`).join('\n');
    transporter.sendMail({
      from: process.env.QQ_EMAIL_USER,
      to: process.env.QQ_EMAIL_USER,
      subject: '【专属外卖】宝贝下单啦！',
      text: `宝贝刚刚下了一个新订单！\n\n餐厅：${newOrder.restaurantName}\n内容：\n${itemsText}\n\n快去控制台接单吧！`
    }).catch(console.error);
  }

  res.json(newOrder);
});

app.patch('/api/orders/:id', (req, res) => {
  const db = readDB();
  const orderIndex = db.orders.findIndex((o: any) => o.id === req.params.id);
  if (orderIndex > -1) {
    db.orders[orderIndex] = { ...db.orders[orderIndex], ...req.body };
    writeDB(db);
    
    // Send Email to Girlfriend if completed
    if (req.body.status === 'completed' && process.env.GF_EMAIL && process.env.QQ_EMAIL_USER) {
      transporter.sendMail({
        from: process.env.QQ_EMAIL_USER,
        to: process.env.GF_EMAIL,
        subject: '【专属外卖】你的外卖送达啦！',
        text: `亲爱的宝贝，你的外卖（${db.orders[orderIndex].restaurantName}）已经送达啦！快去享用吧~ 爱你哦！❤️`
      }).catch(console.error);
    }

    res.json(db.orders[orderIndex]);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

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
