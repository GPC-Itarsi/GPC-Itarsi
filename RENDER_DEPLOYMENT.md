# Deploying to Render

This guide explains how to deploy the GPC Itarsi website to Render.

## Prerequisites

1. Create a Render account at [render.com](https://render.com)
2. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)

## Cloudinary Setup

1. Sign up for a Cloudinary account
2. Note your Cloud Name, API Key, and API Secret from the Dashboard
3. These credentials are already configured in the backend `.env` file

## Deploying the Backend

1. Log in to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `gpc-itarsi-backend`
   - **Root Directory**: `mongodb-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (or select a paid plan for better performance)

5. Add the following environment variables:
   - `PORT`: 10000 (Render will use this internally)
   - `JWT_SECRET`: (create a secure random string)
   - `MONGODB_URI`: `mongodb+srv://GPC:anmol4328@gpc-itarsi.puza0ta.mongodb.net/gpc-itarsi`
   - `NODE_ENV`: `production`
   - `CLOUDINARY_CLOUD_NAME`: `daf99zwr2`
   - `CLOUDINARY_API_KEY`: `913341861574171`
   - `CLOUDINARY_API_SECRET`: `qTADLCaw8FaI6HwrC4tLdgpObrU`
   - `CLOUDINARY_URL`: `cloudinary://913341861574171:qTADLCaw8FaI6HwrC4tLdgpObrU@daf99zwr2`

6. Click "Create Web Service"

## Deploying the Frontend

1. In your Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `gpc-itarsi-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free (or select a paid plan for better performance)

4. Add the following environment variables:
   - `VITE_API_URL`: (URL of your backend service, e.g., `https://gpc-itarsi-backend.onrender.com`)

5. Click "Create Static Site"

## Important Notes

1. **File Storage**: All file uploads will be stored in Cloudinary, not on Render's servers. This ensures your files persist across deployments and server restarts.

2. **CORS Configuration**: You may need to update the CORS configuration in the backend to allow requests from your Render frontend URL.

3. **Database**: Make sure your MongoDB Atlas IP whitelist includes Render's IP addresses or is set to allow access from anywhere (0.0.0.0/0).

4. **Environment Variables**: Double-check all environment variables before deploying.

5. **Deployment Time**: The first deployment may take several minutes, especially on the free tier.

## Troubleshooting

1. **Image Upload Issues**: If images aren't uploading, check the Cloudinary credentials and ensure the frontend is correctly accessing the Cloudinary URLs.

2. **Connection Issues**: If the frontend can't connect to the backend, verify the CORS settings and ensure the API URL is correct.

3. **Database Connection**: If the backend can't connect to MongoDB, check the connection string and IP whitelist.

4. **Logs**: Use Render's log viewer to diagnose issues in real-time.

## Maintenance

1. **Updates**: Push changes to your GitHub repository, and Render will automatically redeploy your services.

2. **Monitoring**: Use Render's dashboard to monitor your service's health and performance.

3. **Scaling**: If needed, upgrade to a paid plan for better performance and more resources.
