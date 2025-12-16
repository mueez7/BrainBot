
# BrainBot - AI Study Assistant

An intelligent chatbot web application designed to help students learn and study effectively. Built with React, TypeScript, Vite, and powered by OpenRouter AI with Supabase backend.

## Features

- 🤖 AI-powered study assistance using Amazon Nova 2 Lite
- 📁 File upload support (images, documents, videos)
- 💬 Real-time chat interface with message history
- 🔐 Secure user authentication via Supabase
- 📱 Responsive design with mobile support
- 🎨 Beautiful UI with 3D elements and animations

## Security Features

- 🔒 Environment variable management for API keys
- 🛡️ Input sanitization and XSS protection
- 📋 File upload validation and size limits
- 🚦 Rate limiting for API requests
- 🔑 API key format validation
- 🗄️ Row Level Security (RLS) on database

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd chatbot-web-application
npm install
```

### 2. Environment Configuration

**⚠️ IMPORTANT: Never commit your `.env` file to version control!**

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # OpenRouter API Configuration
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_OPENROUTER_MODEL=amazon/nova-2-lite-v1:free
   VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   ```

### 3. Get Your API Keys

#### Supabase Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. Run the database setup (see Database Setup section)

#### OpenRouter Setup
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up/Login
3. Go to Keys section
4. Generate a new API key

### 4. Database Setup

The application will guide you through database setup on first run, or you can manually run the SQL commands from `MIGRATION_ADD_ATTACHMENTS.sql`.

### 5. Run the Application

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/
│   ├── components/     # React components
│   └── App.tsx        # Main app component
├── lib/
│   ├── supabase.ts    # Supabase client configuration
│   ├── openrouter.ts  # OpenRouter AI integration
│   └── security.ts    # Security utilities
├── styles/            # CSS and styling
└── main.tsx          # Application entry point
```

## Security Considerations

- All API keys are stored in environment variables
- Input sanitization prevents XSS attacks
- File uploads are validated and size-limited
- Database uses Row Level Security (RLS)
- Rate limiting prevents API abuse

For detailed security information, see [SECURITY.md](./SECURITY.md).

## Deployment

### Environment Variables in Production

Make sure to set all required environment variables in your deployment platform:

- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables  
- Railway: Project > Variables
- Heroku: Settings > Config Vars

### Build Command

```bash
npm run build
```

### Security Checklist

Before deploying to production:

- [ ] Verify `.env` is in `.gitignore`
- [ ] Set environment variables in deployment platform
- [ ] Test with production API keys
- [ ] Enable HTTPS
- [ ] Configure CORS policies
- [ ] Set up monitoring and alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For security issues, please see [SECURITY.md](./SECURITY.md).
For other issues, please create a GitHub issue.