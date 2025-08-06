# Deployment Guide

This guide covers various deployment options for the Task Management Dashboard with Deployment Tracking application.

## Prerequisites

Before deploying, ensure you have:
- Node.js (version 16 or higher)
- npm or yarn package manager
- Git (for version control)
- Access to your chosen deployment platform

## Building for Production

### 1. Create Production Build

```bash
# Install dependencies
npm install

# Create optimized production build
npm run build
```

This creates a `dist/` folder with optimized static files ready for deployment.

### 2. Preview Production Build Locally

```bash
# Preview the production build
npm run preview
```

This serves the production build locally at `http://localhost:4173` for testing.

## Deployment Options

### Option 1: Netlify (Recommended)

Netlify offers easy deployment with automatic builds from Git repositories.

#### Method A: Drag and Drop

1. Build your project: `npm run build`
2. Go to [Netlify](https://netlify.com)
3. Drag the `dist/` folder to the deployment area
4. Your site will be live with a random URL

#### Method B: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (in Environment variables)
4. Deploy automatically on every push

#### Netlify Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 2: Vercel

Vercel provides excellent performance and easy deployment.

#### Deployment Steps

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to configure your project
4. Your app will be deployed with a `.vercel.app` domain

#### Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Option 3: GitHub Pages

Deploy directly from your GitHub repository.

#### Setup Steps

1. Install gh-pages: `npm install --save-dev gh-pages`

2. Add deployment script to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Update `vite.config.ts` for GitHub Pages:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repository-name/', // Replace with your repo name
})
```

4. Deploy: `npm run deploy`

5. Enable GitHub Pages in repository settings

### Option 4: Firebase Hosting

Google Firebase provides fast global CDN hosting.

#### Setup Steps

1. Install Firebase CLI: `npm install -g firebase-tools`

2. Login to Firebase: `firebase login`

3. Initialize Firebase in your project:

```bash
firebase init hosting
```

4. Configure `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

5. Deploy:

```bash
npm run build
firebase deploy
```

### Option 5: AWS S3 + CloudFront

For enterprise-grade hosting with AWS.

#### Setup Steps

1. Create an S3 bucket
2. Enable static website hosting
3. Upload the `dist/` folder contents
4. Set up CloudFront distribution
5. Configure custom domain (optional)

#### AWS CLI Deployment

```bash
# Build the project
npm run build

# Sync to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Option 6: Traditional Web Server

Deploy to any web server (Apache, Nginx, etc.).

#### Steps

1. Build the project: `npm run build`
2. Upload `dist/` folder contents to your web server
3. Configure server for SPA routing

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache Configuration

Create `.htaccess` in the `dist/` folder:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## Environment Configuration

### Environment Variables

For different environments, create environment files:

```bash
# .env.production
VITE_APP_TITLE="Task Management Dashboard"
VITE_API_URL="https://api.yourdomain.com"
```

### Build Optimization

Optimize your build for production:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## Performance Optimization

### 1. Enable Compression

Most hosting platforms automatically enable gzip compression. For custom servers:

```nginx
# Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. CDN Configuration

Use a CDN for better global performance:
- CloudFlare (free tier available)
- AWS CloudFront
- Google Cloud CDN

### 3. Caching Strategy

```nginx
# Cache static assets for 1 year
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Cache HTML for 1 hour
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

## Security Considerations

### 1. HTTPS

Always use HTTPS in production:
- Most hosting platforms provide free SSL certificates
- Use Let's Encrypt for custom servers

### 2. Security Headers

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### 3. Content Security Policy

Add CSP meta tag to `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
```

## Monitoring and Analytics

### 1. Error Tracking

Integrate error tracking services:
- Sentry
- LogRocket
- Bugsnag

### 2. Analytics

Add analytics tracking:
- Google Analytics
- Plausible Analytics
- Mixpanel

### 3. Performance Monitoring

- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## Troubleshooting

### Common Issues

**404 errors on refresh:**
- Ensure SPA routing is configured correctly
- Check server configuration for fallback to index.html

**Assets not loading:**
- Verify the `base` URL in vite.config.ts
- Check file paths and permissions

**Performance issues:**
- Enable compression
- Optimize images
- Use a CDN
- Check bundle size

### Debugging

```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck

# Audit for vulnerabilities
npm audit
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Custom Domain Setup

### 1. DNS Configuration

Point your domain to your hosting provider:
- **A Record**: Point to IP address
- **CNAME**: Point to hosting provider's domain

### 2. SSL Certificate

Most hosting providers offer free SSL certificates:
- Let's Encrypt (automatic)
- CloudFlare (free tier)
- AWS Certificate Manager

### 3. Domain Verification

Follow your hosting provider's domain verification process.

---

**Need help?** Check the hosting provider's documentation or open an issue in the project repository.