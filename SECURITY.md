# Security Guide

## Environment Variables

This application uses environment variables to securely manage sensitive configuration. **Never commit your `.env` file to version control.**

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter API Configuration
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_OPENROUTER_MODEL=amazon/nova-2-lite-v1:free
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
```

### Getting Your Credentials

#### Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the Project URL and anon/public key

#### OpenRouter
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up/Login
3. Go to Keys section
4. Generate a new API key

## Security Features

### Input Sanitization
- All user inputs are sanitized to prevent XSS attacks
- File uploads are validated for type and size
- API keys are validated for correct format

### File Upload Security
- Maximum file size: 10MB
- Allowed file types: Images, videos, PDFs, documents
- Files are validated before processing

### Environment Validation
- Application validates all required environment variables on startup
- Shows user-friendly error messages for missing configuration

### Rate Limiting
- Message sending: 30 requests per minute
- File uploads: 10 requests per minute

## Deployment Security Checklist

### Before Deployment

- [ ] Ensure `.env` file is not committed to version control
- [ ] Verify `.gitignore` includes `.env` and other sensitive files
- [ ] Update environment variables in your deployment platform
- [ ] Test the application with production environment variables
- [ ] Verify all API keys are valid and have appropriate permissions

### Production Environment

- [ ] Use HTTPS only
- [ ] Set up proper CORS policies
- [ ] Configure Content Security Policy headers
- [ ] Enable rate limiting at the server level
- [ ] Monitor API usage and set up alerts
- [ ] Regularly rotate API keys
- [ ] Keep dependencies updated

### Supabase Security

- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Review and test database policies
- [ ] Use the anon key (not service role key) in client-side code
- [ ] Set up proper user authentication flows
- [ ] Monitor database access logs

### OpenRouter Security

- [ ] Use API keys with minimal required permissions
- [ ] Monitor API usage and costs
- [ ] Set up usage limits and alerts
- [ ] Regularly review API access logs

## Incident Response

If you suspect a security breach:

1. **Immediately rotate all API keys**
2. **Check access logs for suspicious activity**
3. **Review recent code changes**
4. **Update all environment variables**
5. **Monitor for unusual API usage patterns**

## Security Updates

- Regularly update all dependencies
- Monitor security advisories for used packages
- Keep Node.js and npm/yarn updated
- Review and update security policies quarterly

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. Do not create public GitHub issues for security vulnerabilities
2. Contact the development team directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure