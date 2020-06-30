// config/db.ts
const productConfig = {
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'nest-es', // 库名
    connectionLimit: 10, // 连接限制
  },
};

const localConfig = {
  mysql: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'nest-es', // 库名
    connectionLimit: 10, // 连接限制
  },
};

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// 本地运行是没有 process.env.NODE_ENV 的，借此来区分[开发环境]和[生产环境]
const config = process.env.NODE_ENV ? productConfig : localConfig;

export default config;
