# Chiwei Bot Server

基于 NestJS 的多功能后端服务器，提供图片管理、代理功能、翻译服务和飞书集成等多种服务。

## 功能特性

- **认证系统**：基于 JWT 的身份认证和角色管理
- **图片存储**：集成 OSS 的图片上传、下载和管理系统
- **代理服务**：可配置的代理功能
- **下载任务管理**：异步下载任务处理
- **翻译服务**：文本翻译功能
- **飞书集成**：与飞书平台的集成服务
- **多数据库支持**：
  - MongoDB 用于文档存储
  - MySQL 用于关系数据
  - Redis 用于缓存
  - OSS 用于对象存储

## 环境要求

- Node.js (v14 或更高版本)
- MongoDB
- MySQL
- Redis
- 阿里云 OSS 账号
- 飞书开发者账号（用于飞书集成）

## 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/bezhai/chiwei_bot_server.git
cd chiwei_bot_server/code
```

2. 安装依赖：

```bash
npm install
```

3. 配置环境变量：
在 code 目录下创建 `.env` 文件，包含以下配置：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/chiwei
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USERNAME=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=chiwei

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379

# OSS配置
OSS_REGION=your_region
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=your_bucket_name

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# 飞书配置
LARK_APP_ID=your_app_id
LARK_APP_SECRET=your_app_secret
```

## 运行应用

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

## API 模块说明

### 认证模块 (Auth)

- 用户认证和授权
- 基于角色的访问控制
- JWT 令牌管理

### 图片存储模块 (Image Store)

- 图片上传和存储
- 图片下载和获取
- 图片元数据管理

### 代理模块 (Proxy)

- 请求代理
- 自定义代理配置
- 请求/响应转换

### 下载任务模块 (Download Task)

- 异步下载管理
- 任务状态跟踪
- 进度监控

### 翻译模块 (Translation)

- 文本翻译服务
- 翻译历史记录
- 多语言支持

### 飞书文件传输模块 (Lark File Transfer)

- 飞书文件转发服务
- 支持多目标平台传输（如302ai）
- 基于MySQL的文件传输缓存
- 避免重复的文件下载和上传操作

### 设置模块 (Setting)

- 系统配置管理
- 用户偏好设置
- 应用程序设置

## 测试

```bash
# 单元测试
npm run test

# E2E测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## 项目结构

```
src/
├── auth/           # 认证和授权
├── common/         # 共享工具、装饰器和过滤器
├── database/       # 数据库配置和服务
├── download-task/  # 下载任务管理
├── image-store/    # 图片存储和管理
├── lark/          # 飞书平台集成
├── lark-file-transfer/ # 飞书文件传输服务
├── proxy/         # 代理服务
├── setting/       # 系统设置
├── translation/   # 翻译服务
└── users/         # 用户管理
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
