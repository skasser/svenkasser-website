# Sven Kasser Personal Website

A React-based personal website featuring an interactive DNA helix navigation and phylogenetic tree background.

## Prerequisites

Before you begin, make sure you have:
- Node.js installed (download from nodejs.org - get the LTS version)
- A GitHub account
- Git installed on your computer

## Setup Instructions

### 1. Initial Setup

Open your terminal/command prompt and navigate to where you want to create the project:

```bash
# Navigate to your desired location, for example:
cd ~/Documents

# Create the project directory and navigate into it
mkdir svenkasser-website
cd svenkasser-website
```

Then copy all the files from this download into that folder.

### 2. Install Dependencies

```bash
npm install
```

This will install React, React DOM, and all necessary packages.

### 3. Test Locally (Optional but Recommended)

```bash
npm start
```

This will open the website in your browser at http://localhost:3000. Press Ctrl+C to stop the local server when done.

### 4. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### 5. Connect to GitHub

First, create a new repository on GitHub:
- Go to github.com
- Click the "+" icon → "New repository"
- Name it "svenkasser-website" (or any name you prefer)
- Make it **Public**
- Don't initialize with README
- Click "Create repository"

Then connect your local repository:

```bash
# Replace YOUR-USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR-USERNAME/svenkasser-website.git
git branch -M main
git push -u origin main
```

### 6. Deploy to GitHub Pages

```bash
npm run deploy
```

This command will:
- Build your React app
- Create a `gh-pages` branch
- Deploy the built files to that branch
- Your site will be live in 1-2 minutes!

### 7. Enable GitHub Pages (First Time Only)

1. Go to your repository on github.com
2. Click "Settings"
3. Click "Pages" in the left sidebar
4. Under "Source", it should already be set to "gh-pages" branch
5. If not, select "gh-pages" and click "Save"

### 8. Connect Your Custom Domain

**In GitHub:**
1. Still in Settings → Pages
2. Under "Custom domain", enter: `svenkasser.com`
3. Click "Save"
4. Check "Enforce HTTPS" (may take a few minutes to appear)

**In your domain registrar (where you bought svenkasser.com):**

Add these DNS records:

```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: YOUR-USERNAME.github.io
```

**Wait for DNS propagation** (5 minutes to 48 hours, usually ~1 hour)

## Making Updates

Whenever you want to update your website:

1. Make your changes to `src/App.js` or other files
2. Test locally with `npm start`
3. Deploy the changes:

```bash
git add .
git commit -m "Description of your changes"
git push
npm run deploy
```

The site will update in 1-2 minutes!

## Project Structure

```
svenkasser-website/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main React component (your landing page)
│   └── index.js            # React entry point
├── package.json            # Project configuration
├── .gitignore             # Files to ignore in git
└── README.md              # This file
```

## Troubleshooting

**Site not updating?**
- Wait 2-3 minutes after running `npm run deploy`
- Clear your browser cache
- Try accessing in an incognito/private window

**Build errors?**
- Make sure Node.js is installed: `node --version`
- Try deleting `node_modules` and running `npm install` again

**Domain not working?**
- Check DNS settings in your domain registrar
- Wait longer (DNS can take up to 48 hours)
- Verify GitHub Pages is enabled and custom domain is set

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [React Documentation](https://react.dev)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
