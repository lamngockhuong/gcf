## Run on local
Config chatwork information at .env file and run the following command:

```bash
ENDPOINT=monitoringHttp npm run start
```

## Deploy function

***1. Config google cloud project***
```bash
gcloud config set project project-id
```

***2. Run command***
```bash
npm run deploy
```

***3. Config "Runtime environment variables" at Google Cloud Console***

Edit log-monitoring function & config variables same .env file. After that, click re-deploy on Google Cloud Functions dashboard
