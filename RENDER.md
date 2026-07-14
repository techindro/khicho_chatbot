# Deploying to Render

This project is configured to deploy to Render as a **Static Site** using the Blueprint configuration in `render.yaml`.

## Prerequisites

Before deploying, make sure you have:
1. A **GitHub**, **GitLab**, or **Bitbucket** repository with this project's code pushed to it.
2. A **Render** account (register at [render.com](https://render.com)).

## Deployment Steps

### Step 1: Add Blueprint on Render
1. Log in to the [Render Dashboard](https://dashboard.render.com).
2. Click **New** in the top right corner and select **Blueprint**.
3. Connect your repository (`khicho_chatbot`).
4. Render will automatically detect the `render.yaml` file in the root of your repository and display the configuration details.

### Step 2: Configure Environment Variables (Optional)
Both API keys are **completely optional** for the application to build and run:
- **If you do not provide keys**: The application will automatically fall back to using **Pollinations.AI** (which is completely free and requires no API key or setup) for text-to-image generation.
- **If you want premium features**: 
  - Provide `VITE_IDEOGRAM_API_KEY` to enable the high-quality Ideogram model (for paid tiers).
  - Provide `VITE_HF_TOKEN` to enable the reference image-to-image generation feature.

To add these keys:
1. Go to your Static Site service dashboard in Render.
2. Go to **Environment** settings.
3. Add `VITE_HF_TOKEN` and/or `VITE_IDEOGRAM_API_KEY` with their respective values.
4. Click **Save Changes** (Render will automatically trigger a rebuild with the new variables).

### Step 3: Verify and Access
Once the build is complete:
1. Render will host your site on a free `onrender.com` subdomain (e.g., `khicho-chatbot.onrender.com`).
2. You can access the live URL from the service page in your dashboard.
3. Client-side routing is handled automatically via Render rewrite rules (mapping all paths to `index.html`).
