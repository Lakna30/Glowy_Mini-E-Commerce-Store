# Cloudinary Setup Instructions

## Why Cloudinary?
✅ **No CORS issues** - Works perfectly with localhost  
✅ **Automatic optimization** - Images are automatically compressed and optimized  
✅ **CDN delivery** - Fast image loading worldwide  
✅ **Image transformations** - Resize, crop, format conversion on-the-fly  
✅ **Free tier** - 25GB storage and 25GB bandwidth per month  

## Setup Steps

### 1. Create Cloudinary Account
1. Go to: https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Verify your email

### 2. Get Your Credentials
After logging in to your Cloudinary dashboard:
1. Go to **Dashboard** (main page)
2. Copy these values:
   - **Cloud Name** (e.g., "dxxxxx")
   - **API Key** (e.g., "123456789012345")
   - **API Secret** (keep this private)

### 3. Create Upload Preset
1. Go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `glowy-products`
   - **Signing Mode**: `Unsigned` (for frontend uploads)
   - **Folder**: `glowy/products` (optional, for organization)
   - **Allowed formats**: `jpg,png,gif,webp`
   - **Transformation**: 
     - **Quality**: `auto`
     - **Format**: `auto`
     - **Max width**: `1200` (optional)
     - **Max height**: `1200` (optional)
5. Click **Save**

### 4. Update Configuration

**Option A: Using Environment Variables (Recommended)**
1. Copy `.env.example` to `.env` in your project root
2. Update the values in `.env`:
```bash
REACT_APP_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=glowy-products
```

**Option B: Direct Configuration**
Edit `src/config/cloudinary.js` and replace:
```javascript
export const CLOUDINARY_CONFIG = {
  cloudName: 'your-actual-cloud-name', // Replace with your Cloud Name
  uploadPreset: 'glowy-products', // Must match the preset you created
};
```

### 5. Test Upload
1. Restart your development server
2. Go to Add Product page
3. Try uploading an image
4. Check browser console for success messages

## Example Configuration
```javascript
// src/config/cloudinary.js
export const CLOUDINARY_CONFIG = {
  cloudName: 'dxyz123abc', // Your actual cloud name
  uploadPreset: 'glowy-products',
};
```

## Troubleshooting

### Error: "Upload preset not found"
- Make sure the upload preset name matches exactly
- Ensure the preset is set to "Unsigned"

### Error: "Invalid cloud name"
- Double-check your cloud name from the dashboard
- Make sure there are no extra spaces or characters

### Error: "Upload failed"
- Check your internet connection
- Verify the upload preset allows the file format
- Check file size limits in your preset settings

## Benefits You'll Get
- **Instant uploads** - No CORS issues
- **Optimized images** - Automatic compression
- **Responsive images** - Different sizes for different devices
- **Fast loading** - Global CDN delivery
- **Easy management** - Web interface to manage all images

## Next Steps
After setup:
1. Test image uploads
2. Remove Firebase Storage dependencies (if desired)
3. Update other components to use Cloudinary URLs
4. Set up image transformations for different use cases

