# Deployment Checklist - Data Links Application

## Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Node.js installed (v14 or higher)
- [ ] MongoDB connection string configured
- [ ] Google Drive API credentials set up
- [ ] `.env` file created with all required variables
- [ ] Dependencies installed (`npm install`)

### ✅ Configuration
- [ ] `MONGODB_URI` set in `.env`
- [ ] `PORT` configured (default: 3000)
- [ ] `API_KEY` for Google Drive API
- [ ] `CLIENT_ID` for Google OAuth
- [ ] `FOLDER_ID` for Google Drive folder

### ✅ Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile devices (iOS/Android)
- [ ] Test theme toggle on all pages
- [ ] Test grid/list view toggle
- [ ] Test search and filter functionality
- [ ] Test user registration and login
- [ ] Test link management (add, edit, delete)
- [ ] Test note management
- [ ] Test file upload/download
- [ ] Test mobile menu
- [ ] Test all forms
- [ ] Test error handling

### ✅ Performance
- [ ] Check page load times
- [ ] Verify smooth animations (60fps)
- [ ] Test with slow network connection
- [ ] Check memory usage
- [ ] Verify no console errors
- [ ] Test with large datasets

### ✅ Security
- [ ] Environment variables not exposed
- [ ] Passwords properly hashed
- [ ] Input validation working
- [ ] HTTPS configured (production)
- [ ] CORS configured properly
- [ ] Rate limiting implemented (recommended)

### ✅ Code Quality
- [ ] No console.log statements in production code
- [ ] Code properly commented
- [ ] No unused variables or functions
- [ ] Consistent code formatting
- [ ] Error handling in place

## Deployment Steps

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start the server
npm start

# 4. Open browser
# Navigate to http://localhost:3000
```

### Production Deployment (Vercel)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard
# - MONGODB_URI
# - API_KEY
# - CLIENT_ID
# - FOLDER_ID

# 5. Deploy to production
vercel --prod
```

### Production Deployment (Other Platforms)

#### Heroku
```bash
# 1. Install Heroku CLI
# 2. Login
heroku login

# 3. Create app
heroku create your-app-name

# 4. Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set API_KEY=your_api_key
heroku config:set CLIENT_ID=your_client_id
heroku config:set FOLDER_ID=your_folder_id

# 5. Deploy
git push heroku main
```

#### DigitalOcean/AWS/Azure
1. Set up server instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Set up environment variables
6. Configure reverse proxy (nginx)
7. Set up SSL certificate
8. Start application with PM2

## Post-Deployment Checklist

### ✅ Verification
- [ ] Application accessible at production URL
- [ ] All pages load correctly
- [ ] Theme toggle works
- [ ] Grid/list view toggle works
- [ ] User registration works
- [ ] Login/logout works
- [ ] Link management works
- [ ] Note management works
- [ ] File upload/download works
- [ ] Mobile view works
- [ ] No console errors
- [ ] SSL certificate valid (HTTPS)

### ✅ Monitoring
- [ ] Set up error logging
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure backup system
- [ ] Set up alerts for errors

### ✅ Documentation
- [ ] Update README with production URL
- [ ] Document any deployment-specific configurations
- [ ] Create user guide
- [ ] Document API endpoints
- [ ] Create troubleshooting guide

## Environment Variables

### Required
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=3000
API_KEY=your_google_api_key
CLIENT_ID=your_google_client_id
FOLDER_ID=your_google_drive_folder_id
```

### Optional
```env
NODE_ENV=production
SESSION_SECRET=your_session_secret
MAX_FILE_SIZE=750000000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## Performance Optimization

### Production Recommendations
1. **Enable Compression**
   - Already implemented in `index.js`
   - Reduces response size

2. **Use CDN**
   - Serve static assets from CDN
   - Faster load times globally

3. **Enable Caching**
   - Set appropriate cache headers
   - Use Redis for session storage

4. **Minify Assets**
   - Minify CSS and JavaScript
   - Optimize images

5. **Database Optimization**
   - Create indexes on frequently queried fields
   - Use connection pooling

## Security Hardening

### Production Security
1. **HTTPS Only**
   - Force HTTPS redirect
   - Use valid SSL certificate

2. **Security Headers**
   ```javascript
   app.use(helmet());
   ```

3. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   app.use(limiter);
   ```

4. **CORS Configuration**
   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

5. **Input Sanitization**
   - Already implemented
   - Validate all user inputs

## Backup Strategy

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)

# Automated daily backup
0 2 * * * /path/to/backup-script.sh
```

### File Backup
- Google Drive files are already backed up
- Consider additional backup for user uploads

## Monitoring Tools

### Recommended Tools
1. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom
   - StatusCake

2. **Error Tracking**
   - Sentry
   - Rollbar
   - Bugsnag

3. **Performance Monitoring**
   - New Relic
   - DataDog
   - AppDynamics

4. **Log Management**
   - Loggly
   - Papertrail
   - Splunk

## Troubleshooting

### Common Issues

#### Application Won't Start
- Check environment variables
- Verify MongoDB connection
- Check port availability
- Review error logs

#### Theme Not Persisting
- Check localStorage support
- Verify theme-manager.js loaded
- Check browser console for errors

#### Mobile Menu Not Working
- Verify JavaScript loaded
- Check for console errors
- Test on different devices

#### File Upload Failing
- Check Google API credentials
- Verify file size limits
- Check network connectivity
- Review server logs

## Rollback Plan

### If Deployment Fails
1. Keep previous version running
2. Test new version in staging
3. Have rollback script ready
4. Document rollback procedure
5. Notify users of maintenance

### Rollback Steps
```bash
# Vercel
vercel rollback

# Heroku
heroku releases:rollback

# Manual
git revert HEAD
git push origin main
```

## Support Contacts

### Technical Support
- Developer: panuwattakham2002@gmail.com
- MongoDB Support: support.mongodb.com
- Google Cloud Support: cloud.google.com/support

### Emergency Contacts
- On-call developer: [Phone Number]
- System administrator: [Phone Number]
- Database administrator: [Phone Number]

## Success Criteria

### Deployment Successful When:
- ✅ Application accessible at production URL
- ✅ All features working correctly
- ✅ No critical errors in logs
- ✅ Performance metrics acceptable
- ✅ Security checks passed
- ✅ Monitoring systems active
- ✅ Backup systems configured
- ✅ Documentation updated

---

**Last Updated**: February 2026  
**Version**: 2.0  
**Status**: Ready for Deployment
