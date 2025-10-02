# Firebase Storage CORS Fix Instructions

## The Problem
Your Firebase Storage is blocking requests from localhost:3000 due to CORS (Cross-Origin Resource Sharing) policy.

## The Solution

### Step 1: Install Google Cloud SDK
1. Download from: https://cloud.google.com/sdk/docs/install-sdk
2. Choose "Windows" and download the installer
3. Run the installer and follow the setup instructions
4. Restart your command prompt/PowerShell after installation

### Step 2: Authenticate with Google Cloud
Open PowerShell/Command Prompt and run:
```bash
gcloud auth login
```
This will open a browser to authenticate with your Google account.

### Step 3: Set Your Project
```bash
gcloud config set project glowy-31b8a
```

### Step 4: Apply CORS Configuration
Navigate to your project directory and run:
```bash
gsutil cors set cors.json gs://glowy-31b8a.firebasestorage.app
```

### Step 5: Verify CORS Configuration
```bash
gsutil cors get gs://glowy-31b8a.firebasestorage.app
```

## Alternative: Firebase Console Method

If you prefer using the Firebase Console:

1. Go to: https://console.firebase.google.com/project/glowy-31b8a/storage
2. Click on "Rules" tab
3. Update your storage rules to allow uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Testing
After applying the CORS fix:
1. Restart your development server
2. Try uploading images again
3. Check browser console for any remaining errors

## Files Created
- `cors.json` - CORS configuration file
- This instruction file

## Need Help?
If you encounter issues, check:
1. Google Cloud SDK is properly installed
2. You're authenticated with the correct Google account
3. Your Firebase project ID is correct (glowy-31b8a)
