# OG 图片生成器

轻量级、高效的 Open Graph 图片生成工具，基于 Next.js 和 Cloudflare Workers 构建，用于社交媒体分享时生成精美的预览卡片。

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/catpddo/og-image)

## 功能特点

- 🖼️ 自定义 OG 图片生成
- 🔄 基于 KV 的图片缓存系统
- 📂 R2 存储图片资源
- 🔒 访问密钥保护，防止未授权使用
- 🕒 支持设置过期时间
- 📱 响应式设计，完美支持各种设备

## 快速开始

### 前置要求

- Cloudflare 账户

### 部署步骤

1. 点击上方 "Deploy to Cloudflare Workers" 按钮
2. 按照指引配置您的 Worker
3. 在 Cloudflare 部署界面中，设置以下构建环境变量:
   - `R2_DOMAIN`: R2 存储桶的域名
   - `ACCESS_SECRET`: 访问密钥，用于保护生成接口
4. 确认构建命令为 `npm run build`，部署命令为 `npm run deploy`
5. 项目部署完成后，在 Cloudflare Workers 控制面板中再次确认环境变量设置正确

### 绑定自定义域名

为了更好的使用体验，强烈建议为您的 Worker 绑定自定义域名：

1. 登录 Cloudflare 控制台
2. 进入 Workers & Pages > 您的应用 > 设置 > 自定义域
3. 点击"添加自定义域"，输入您的域名（如 `og.example.com`）
4. 按照提示完成 DNS 记录配置

绑定自定义域名后，您可以通过 `https://og.example.com` 访问您的 OG 图片生成器，而不是使用默认的 `.workers.dev` 域名。这对于生产环境非常重要，也有助于保持 URL 的简洁性。

### 环境变量说明

#### R2_DOMAIN

`R2_DOMAIN` 是您的 R2 存储桶的域名，用于访问存储在 R2 中的图片资源。您有两种配置方式:

1. 使用 Cloudflare R2 默认域名: `img.r2.dev`
2. 使用自定义域名 (推荐): `img.example.com`

此参数决定了生成的 OG 图片 URL 的来源。如果使用自定义域名，请确保已在 Cloudflare DNS 中正确配置。

#### ACCESS_SECRET

`ACCESS_SECRET` 是一个访问密钥，用于保护您的 OG 图片生成接口，防止未授权使用。建议设置一个强密码，并妥善保管。

### R2 CORS 配置说明

#### 重要提示

为了确保生成的 OG 图片可以被正常访问，您需要为 R2 存储桶配置正确的 CORS 策略。如果不配置 CORS，可能会导致某些网站无法正确显示您的 OG 图片。

#### 配置步骤

1. 登录 Cloudflare 控制台
2. 进入 R2 > 您的存储桶 > 设置 > CORS 配置
3. 添加 CORS 规则，将 `AllowedOrigins` 设置为您 Workers 的自定义域名:

```json
[
  {
    "AllowedOrigins": ["https://your-worker-domain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

此配置允许您的 Worker 域名通过 GET 和 HEAD 方法访问您存储桶中的资源，这对于 OG 图片被社交媒体平台正确加载至关重要。

## 使用说明

### 访问生成器

```
https://your-worker.example.com/?secret=YOUR_ACCESS_SECRET
```

在此页面您可以:
- 填写标题、描述、URL 等信息
- 上传或选择图片
- 点击生成按钮获取 OG 预览链接

### 访问仪表盘

```
https://your-worker.example.com/dashboard?secret=YOUR_ACCESS_SECRET
```

在仪表盘中您可以:
- 查看所有已生成的 OG 图片
- 删除不需要的 OG 图片
- 复制 OG 预览链接用于分享

## 技术栈

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [OpenNextJS Cloudflare](https://opennext.js.org/cloudflare/overview)

## 特别感谢

- [Cloudflare](https://www.cloudflare.com/) - 提供强大的 Workers、R2 和 KV 服务
- [Vercel](https://vercel.com/) - Next.js 框架的开发者
- [Shadcn](https://ui.shadcn.com/) - 提供美观实用的 UI 组件
- [OpenNext](https://opennext.js.org/) - 实现 Next.js 应用在 Cloudflare 上的部署

## 许可证

MIT
