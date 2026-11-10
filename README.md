# Chiwei Bot Server

部署在阿里云函数计算（香港）上的 NestJS 服务，是 media-sync-worker 访问 pixiv 的出口，同时在香港 OSS 保留一份图片副本。服务不连接任何数据库，也不保存 pixiv 鉴权信息；去重、记账都由调用方完成。

## 接口

两个接口都要求请求头带 `x-salt` 和 `x-token`，`x-token = sha256(salt + JSON 请求体 + HTTP_SECRET)`，校验不通过返回 403。请求体里的 `pixiv_auth` 必须带非空的 `cookie` 和 `user_agent`，`sec_ch_ua` 可选（不带就不发这个头），否则返回 400。

- `POST /api/v2/proxy`：按 `url`、`referer` 和 `pixiv_auth` 请求 pixiv ajax 接口，原样返回 pixiv 的响应。
- `POST /api/v2/image-store/download`：下载 `pixiv_url` 指向的图片，上传到 OSS，响应的 `data.tos_file_name` 是实际写入的 key（`pixiv_img_v2/YYYYMMDD/<文件名>`）。每次调用都会下载并上传，不查重。

## 环境变量

- `HTTP_SECRET`：接口签名的密钥，和调用方共用。
- `INTERNAL_END_POINT`：OSS 内网 endpoint。
- `OSS_ACCESS_KEY_ID`、`OSS_ACCESS_KEY_SECRET`、`OSS_BUCKET`：OSS 凭据和 bucket。

部署时传给函数的环境变量见 `s.yaml`。

## 开发

```bash
cd code
npm install
npm run build
npm run start:prod   # 监听 8888 端口
npm test
```

## 部署

push 到 main 后由 `s.yaml` 部署到函数计算，部署前会执行 `npm install` 和 `npm run build`。
