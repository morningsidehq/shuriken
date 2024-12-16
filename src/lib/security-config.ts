export const securityConfig = {
  rateLimits: {
    api: {
      points: 100,
      duration: 60, // 1 minute
    },
    auth: {
      points: 5,
      duration: 300, // 5 minutes
    },
  },
  allowedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Add other allowed origins
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['application/pdf', 'application/msword'],
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
}
