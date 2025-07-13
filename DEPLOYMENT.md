# Deployment Guide for Project Nova

This guide provides step-by-step instructions for deploying the Project Nova application to Netlify.

## Prerequisites

- A Netlify account (sign up at [https://app.netlify.com/signup](https://app.netlify.com/signup) if you don't have one)
- A GitHub, GitLab, or Bitbucket account with your project repository
- Node.js (v16 or later) and npm installed locally

## Deployment Steps

### 1. Prepare Your Repository

1. Make sure all your changes are committed and pushed to your Git repository
2. Ensure you have the following files in your project root:
   - `netlify.toml`
   - `next.config.js`
   - `package.json`
   - `public/robots.txt`
   - `public/_headers`
   - `public/_redirects`

### 2. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended for most users)

1. Go to [Netlify](https://app.netlify.com/) and log in
2. Click on "Add new site" > "Import an existing project"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure the build settings (Netlify should detect them automatically):
   - Build command: `npm run build`
   - Publish directory: `out`
   - Base directory: (leave empty unless your project is in a subdirectory)
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI (For advanced users)

1. Install the Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Log in to your Netlify account:
   ```bash
   netlify login
   ```

3. Build your project:
   ```bash
   npm run build
   ```

4. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### 3. Configure Environment Variables

1. In the Netlify dashboard, go to "Site settings" > "Build & deploy" > "Environment"
2. Click on "Edit variables"
3. Add the following environment variables:
   - `NEXT_PUBLIC_COINMARKETCAP_API_KEY` - Your CoinMarketCap API key
   - `NEXT_PUBLIC_SITE_URL` - Your site's URL (e.g., https://your-site.netlify.app)
   - `NODE_VERSION` - Set to "18" or your preferred Node.js version

### 4. Configure Custom Domain (Optional)

1. In the Netlify dashboard, go to "Domain management"
2. Click "Add custom domain"
3. Follow the instructions to verify domain ownership and configure DNS settings

### 5. Enable Automatic Deploys

1. In the Netlify dashboard, go to "Site settings" > "Build & deploy" > "Continuous deployment"
2. Under "Build hooks", click "Add build hook"
3. Configure the build hook and save it
4. Use this hook in your CI/CD pipeline or Git provider's webhook settings

## Post-Deployment

1. Verify your site is working correctly by visiting the provided Netlify URL
2. Check the build logs in the Netlify dashboard for any errors
3. Test all major functionality, including API routes and dynamic content

## Troubleshooting

### Build Failures

- Check the build logs in the Netlify dashboard for specific error messages
- Ensure all required environment variables are set
- Verify that your `package.json` has all necessary dependencies

### API Issues

- Make sure your CoinMarketCap API key is valid and has the required permissions
- Check the browser's developer console for any API-related errors

### Styling Issues

- Clear your browser cache or test in an incognito window
- Verify that all CSS and JavaScript files are loading correctly

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Netlify Status Page](https://www.netlifystatus.com/)

## Support

For support, please open an issue in the project's GitHub repository or contact the development team.
