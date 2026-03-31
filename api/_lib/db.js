/**
 * Vercel Serverless API - 数据库配置
 * 使用 Turso HTTP API 直接调用（绕过 @libsql/client 的 migration 问题）
 */

// 将 libsql:// 转换为 https:// API URL
function getApiUrl(libsqlUrl) {
  if (!libsqlUrl) return null;
  return libsqlUrl.replace('libsql://', 'https://');
}

const BASE_URL = getApiUrl(process.env.TURSO_DATABASE_URL);
const AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

// 直接使用 fetch 调用 Turso HTTP API
async function execute(sql, params = []) {
  const response = await fetch(`${BASE_URL}/v2/pipeline`, {
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
      }]
    })
  });

  const result = await response.json();
  if (result.error) {
    throw new Error(result.error.message || result.error);
  }
  return result;
}

// 封装类似 @libsql/client 的接口
const client = {
  execute: async (sql, params) => {
    const result = await execute(sql, params);
    // 转换结果格式以匹配 @libsql/client
    if (result.results && result.results[0]) {
      return {
        rows: result.results[0].rows || [],
        columns: result.results[0].cols || [],
      };
    }
    return { rows: [], columns: [] };
  }
};

module.exports = client;
