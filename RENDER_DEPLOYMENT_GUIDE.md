# GPC Itarsi - Render Deployment Guide

This guide provides step-by-step instructions for deploying the GPC Itarsi project on Render.com.

## Prerequisites

1. A Render.com account
2. Your GitHub repository with the GPC Itarsi project
3. MongoDB Atlas account with your database set up
4. Cloudinary account for media storage

## Step 1: Deploy the MongoDB Backend

1. Log in to your Render dashboard at https://dashboard.render.com
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `gpc-itarsi-backend-8dod`
   - **Root Directory**: `mongodb-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or select a paid plan for better performance)

5. Add the following environment variables:
   - `PORT`: 5001
   - `JWT_SECRET`: (Render can generate this for you)
   - `MONGODB_URI`: `mongodb+srv://GPC:anmol4328@gpc-itarsi.puza0ta.mongodb.net/gpc-itarsi`
   - `NODE_ENV`: `production`
   - `CLOUDINARY_CLOUD_NAME`: `daf99zwr2`
   - `CLOUDINARY_API_KEY`: `913341861574171`
   - `CLOUDINARY_API_SECRET`: `qTADLCaw8FaI6HwrC4tLdgpObrU`
   - `CLOUDINARY_URL`: `cloudinary://913341861574171:qTADLCaw8FaI6HwrC4tLdgpObrU@daf99zwr2`

6. Add disk storage:
   - Create a disk resource named "uploads" with 1GB
   - Mount path: `/opt/render/project/src/uploads`

7. Click "Create Web Service" and wait for the deployment to complete
8. Note the URL of your deployed backend (e.g., `https://gpc-itarsi-backend-8dod.onrender.com`)

## Step 2: Deploy the Frontend

1. In your Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `gpc-itarsi-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free (or select a paid plan for better performance)

4. Add the following environment variables:
   - `VITE_API_URL`: (URL of your backend service from Step 1)

5. Click "Create Static Site" and wait for the deployment to complete
6. Note the URL of your deployed frontend (e.g., `https://gpc-itarsi-frontend.onrender.com`)

## Step 3: Deploy the Developer Portal

1. In your Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `gpc-itarsi-developer`
   - **Root Directory**: `developer`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free (or select a paid plan for better performance)

4. Add the following environment variables:
   - `VITE_API_URL`: (URL of your backend service from Step 1)

5. Click "Create Static Site" and wait for the deployment to complete

## Step 4: Initialize the Database (if needed)

If your database is empty, you may need to run the initialization script:

1. Go to your backend service in the Render dashboard
2. Click on "Shell"
3. Run the command: `npm run init-db`

## Step 5: Verify Deployment

1. Visit your frontend URL to ensure it's working correctly
2. Test the connection to the backend by trying to log in or view data
3. Visit your developer portal URL to ensure it's working correctly

## Troubleshooting

### Common Issues and Solutions

1. **Deployment Fails with Cloudinary Error**:
   - Make sure you're using cloudinary version 1.x (not 2.x) as multer-storage-cloudinary requires cloudinary ^1.21.0
   - Check your package.json to ensure the correct version is specified

2. **CORS Errors**:
   - Ensure your backend CORS configuration includes all your Render domains
   - The backend should have all frontend and developer portal URLs in its CORS allowed origins

3. **Database Connection Issues**:
   - Make sure your MongoDB Atlas IP whitelist allows access from anywhere (0.0.0.0/0)
   - Verify your connection string is correct

4. **File Upload Issues**:
   - Ensure Cloudinary credentials are correctly set in environment variables
   - Check that the disk storage is properly configured for the uploads folder

5. **Frontend Can't Connect to Backend**:
   - Verify the VITE_API_URL environment variable is set correctly
   - Check for any typos in the backend URL

### Checking Logs

To view logs for debugging:

1. Go to your service in the Render dashboard
2. Click on "Logs" in the left sidebar
3. Select the appropriate log type (Build, Deploy, or Event)

## Maintenance

1. **Updates**: Push changes to your GitHub repository, and Render will automatically redeploy your services
2. **Monitoring**: Use Render's dashboard to monitor your service's health and performance
3. **Scaling**: Upgrade to paid plans if you need more resources or better performance

## Important Notes

1. **Free Tier Limitations**: Render's free tier has some limitations:
   - Services spin down after 15 minutes of inactivity
   - Limited bandwidth and compute resources
   - Consider upgrading to a paid plan for production use

2. **File Storage**: All file uploads should be stored in Cloudinary, not on Render's servers

3. **Environment Variables**: Double-check all environment variables before deploying

4. **Deployment Time**: The first deployment may take several minutes, especially on the free tier
