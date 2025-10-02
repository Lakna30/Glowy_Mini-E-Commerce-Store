@echo off
echo Installing Google Cloud SDK and fixing CORS...
echo.
echo Step 1: Download and install Google Cloud SDK from:
echo https://cloud.google.com/sdk/docs/install-sdk
echo.
echo Step 2: After installation, run these commands one by one:
echo.
echo gcloud auth login
echo gcloud config set project glowy-31b8a
echo gsutil cors set cors.json gs://glowy-31b8a.firebasestorage.app
echo.
echo Step 3: Verify the CORS configuration:
echo gsutil cors get gs://glowy-31b8a.firebasestorage.app
echo.
pause

