/**
 * Vercel Serverless API - 数据库配置
 * 使用 Turso HTTP API
 */

const BASE_URL = (process.env.TURSO_DATABASE_URL || '').replace('libsql://', 'https://');
const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

async function execute(sql, params = []) {
  const url = `${BASE_URL}/v2/pipeline`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        type: 'execute',
        stmt: {
          sql: sql,
          args: params,
        }
      }, {
        type: 'close'
      }]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error.message || JSON.stringify(result.error));
  }
  
  if (result.results && result.results[0] && result.results[0].response && result.results[0].response.error) {
    throw new Error(result.results[0].response.error.message || JSON.stringify(result.results[0].response.error));
  }

  // 提取结果
  if (result.results && result.results[0] && result.results[0].response && result.results[0].response.result) {
    const r = result.results[0].response.result;
    return {
      rows: r.rows ? r.rows.map(row => {
        const obj = {};
        r.cols.forEach((col, i) => {
          obj[col.name || col] = row[i]?.value ?? row[i];
        });
        return obj;
      }) : [],
      columns: r.cols || [],
    };
  }
  
  return { rows: [], columns: [] };
}

// 封装类似 @libsql/client 的接口
const client = {
  execute: async (sql, params) => {
    try {
      return await execute(sql, params);
    } catch (error) {
      console.error('DB Error:', error.message);
      throw error;
    }
  }
};

module.exports = client;
