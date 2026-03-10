# Railway Deployment Guide

## Prerequisites
- Railway account (sign up at https://railway.app)
- Railway CLI installed (optional): `npm i -g @railway/cli`

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo" or "Empty Project"

2. **Connect Your Repository**
   - If using GitHub: Authorize Railway and select your repository
   - Select the `backend/laravel-backend` directory as the root

3. **Configure Environment Variables**
   Add these variables in Railway dashboard (Settings → Variables):

   ```
   APP_NAME=YourAppName
   APP_ENV=production
   APP_KEY=base64:YOUR_KEY_HERE
   APP_DEBUG=false
   APP_URL=https://your-app.railway.app
   
   DB_CONNECTION=mysql
   DB_HOST=${{MYSQLHOST}}
   DB_PORT=${{MYSQLPORT}}
   DB_DATABASE=${{MYSQLDATABASE}}
   DB_USERNAME=${{MYSQLUSER}}
   DB_PASSWORD=${{MYSQLPASSWORD}}
   
   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=database
   
   LOG_CHANNEL=stack
   LOG_LEVEL=error
   ```

4. **Add MySQL Database**
   - In your Railway project, click "New"
   - Select "Database" → "Add MySQL"
   - Railway will automatically inject the database credentials

5. **Generate APP_KEY**
   - Run locally: `php artisan key:generate --show`
   - Copy the output and set it as `APP_KEY` in Railway

6. **Deploy**
   - Railway will automatically detect the Dockerfile and deploy
   - Monitor the build logs in the Railway dashboard

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd backend/laravel-backend
   railway init
   ```

4. **Add MySQL Database**
   ```bash
   railway add --database mysql
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set APP_ENV=production
   railway variables set APP_DEBUG=false
   railway variables set APP_KEY=$(php artisan key:generate --show)
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## Post-Deployment

### Run Migrations
After first deployment, run migrations:
```bash
railway run php artisan migrate --force
```

### Check Logs
```bash
railway logs
```

### Open Your App
```bash
railway open
```

## Important Notes

1. **APP_KEY**: Must be generated before deployment
2. **Database**: Railway MySQL is recommended for production
3. **Storage**: Use Railway volumes or S3 for file storage
4. **CORS**: Update `config/cors.php` if you have a frontend
5. **Domain**: Configure custom domain in Railway settings

## Troubleshooting

### Build Fails
- Check Dockerfile is in the correct location
- Verify all dependencies in composer.json

### Database Connection Issues
- Ensure MySQL service is added to your Railway project
- Verify database environment variables are set correctly

### 500 Errors
- Check logs: `railway logs`
- Ensure APP_KEY is set
- Verify storage permissions in Dockerfile

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| APP_NAME | Application name | MyApp |
| APP_ENV | Environment | production |
| APP_KEY | Encryption key | base64:... |
| APP_DEBUG | Debug mode | false |
| APP_URL | Application URL | https://myapp.railway.app |
| DB_CONNECTION | Database driver | mysql |
| DB_HOST | Database host | Injected by Railway |
| DB_PORT | Database port | Injected by Railway |
| DB_DATABASE | Database name | Injected by Railway |
| DB_USERNAME | Database user | Injected by Railway |
| DB_PASSWORD | Database password | Injected by Railway |

## Useful Commands

```bash
# View logs
railway logs

# Run artisan commands
railway run php artisan migrate
railway run php artisan cache:clear
railway run php artisan config:clear

# SSH into container
railway shell

# Link to existing project
railway link
```

## Additional Resources

- Railway Documentation: https://docs.railway.app
- Laravel Deployment: https://laravel.com/docs/deployment
