# PC-Roadmap (Vercel 版本)

HP 产品可视化平台 - Vercel 部署专用版本

## 部署说明

### 1. 创建 Turso 数据库
1. 注册 https://turso.tech（免费，用 GitHub 登陆）
2. 创建数据库，获取 Database URL 和 Auth Token

### 2. 部署到 Vercel
1. 打开 https://vercel.com
2. 用 GitHub 登陆
3. Import 这个仓库
4. Framework: **Other**
5. Root Directory: `.`
6. Environment Variables 添加：
   - `TURSO_DATABASE_URL` = 你的 Turso Database URL
   - `TURSO_AUTH_TOKEN` = 你的 Turso Auth Token

### 3. 初始化数据库表
在 Turso 控制台执行：
```sql
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price REAL,
  performance_score INTEGER,
  cpu TEXT,
  gpu TEXT,
  ram TEXT,
  storage TEXT,
  screen_size REAL,
  image_url TEXT,
  source_url TEXT,
  source TEXT DEFAULT 'manual',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript + ECharts
- **后端**: Vercel Serverless Functions
- **数据库**: Turso (SQLite 云端)

## 本地开发

```bash
# 后端 (本地)
cd backend && npm install && npm start

# 前端 (本地)
cd frontend && python3 -m http.server 8080
```
