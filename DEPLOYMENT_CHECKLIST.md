# Deployment Security Checklist

## Pre-Deployment Security Audit ✅

### Environment Variables
- [x] ✅ Moved all API keys to environment variables
- [x] ✅ Created `.env.example` template
- [x] ✅ Added `.env` to `.gitignore`
- [x] ✅ Added environment validation on app startup
- [x] ✅ Added user-friendly error messages for missing config

### API Security
- [x] ✅ OpenRouter API key format validation
- [x] ✅ Input sanitization for all user messages
- [x] ✅ File upload validation (type, size limits)
- [x] ✅ Error handling for API failures

### Database Security
- [x] ✅ Supabase Row Level Security (RLS) enabled
- [x] ✅ User authentication required for all operations
- [x] ✅ Database policies restrict access to user's own data

### Code Security
- [x] ✅ No hardcoded credentials in source code
- [x] ✅ XSS prevention through input sanitization
- [x] ✅ File upload security measures
- [x] ✅ Proper error handling without exposing sensitive info

## Deployment Steps

### 1. Platform Setup
Choose your deployment platform:
- [ ] Vercel (Recommended for React apps)
- [ ] Netlify
- [ ] Railway
- [ ] Heroku
- [ ] Other: ___________

### 2. Environment Variables Configuration
Set these in your deployment platform:

```
VITE_SUPABASE_URL=your_actual_supabase_url
VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
VITE_OPENROUTER_API_KEY=your_actual_openrouter_api_key
VITE_OPENROUTER_MODEL=amazon/nova-2-lite-v1:free
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
```

### 3. Build Configuration
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node.js version: 18+ (recommended)

### 4. Domain & SSL
- [ ] Configure custom domain (if applicable)
- [ ] Ensure HTTPS is enabled
- [ ] Test SSL certificate

### 5. Performance & Security Headers
Add these headers in your deployment platform:

```
# Security Headers
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin

# Performance Headers
Cache-Control: public, max-age=31536000, immutable (for static assets)
```

### 6. Testing
- [ ] Test with production environment variables locally
- [ ] Verify all features work in production
- [ ] Test file uploads
- [ ] Test authentication flow
- [ ] Test chat functionality
- [ ] Test on mobile devices
- [ ] Test error scenarios (invalid API keys, network issues)

### 7. Monitoring Setup
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor API usage and costs
- [ ] Set up uptime monitoring
- [ ] Configure alerts for high error rates

### 8. Post-Deployment Security
- [ ] Verify no sensitive data in browser dev tools
- [ ] Test for XSS vulnerabilities
- [ ] Verify file upload restrictions work
- [ ] Check database access is properly restricted
- [ ] Test rate limiting (if implemented at server level)

## Platform-Specific Instructions

### Vercel
1. Connect GitHub repository
2. Set environment variables in Project Settings
3. Deploy automatically on push to main branch

### Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Site Settings

### Railway
1. Connect GitHub repository
2. Add environment variables in Variables tab
3. Deploy automatically

## Security Monitoring

### Regular Tasks
- [ ] Rotate API keys monthly
- [ ] Update dependencies regularly
- [ ] Monitor for security advisories
- [ ] Review access logs weekly
- [ ] Check for unusual API usage patterns

### Emergency Response Plan
If security breach detected:
1. Immediately rotate all API keys
2. Check recent access logs
3. Review recent code changes
4. Update environment variables
5. Monitor for continued suspicious activity

## Performance Optimization

### After Deployment
- [ ] Enable gzip compression
- [ ] Configure CDN (if needed)
- [ ] Optimize images and assets
- [ ] Monitor Core Web Vitals
- [ ] Set up performance monitoring

## Backup & Recovery

- [ ] Database backups configured in Supabase
- [ ] Source code backed up in version control
- [ ] Environment variables documented securely
- [ ] Recovery procedures documented

## Compliance & Legal

- [ ] Privacy policy updated (if collecting user data)
- [ ] Terms of service reviewed
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policies defined

---

## Final Verification

Before going live:
- [ ] All items in this checklist completed
- [ ] Security review passed
- [ ] Performance testing completed
- [ ] Monitoring and alerts configured
- [ ] Team trained on incident response

**Deployment Date:** ___________
**Deployed By:** ___________
**Reviewed By:** ___________