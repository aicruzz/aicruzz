export default function index() {
    return {
        AWS: {
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            s3Bucket: process.env.S3_BUCKET,
        },
        AI: {
            baseUrl: process.env.AI_BASE_URL,
            runwayApiKey: process.env.RUNWAY_API_KEY,
            pikaApiKey: process.env.PIKA_API_KEY,
            openaiApiKey: process.env.OPENAI_API_KEY,
        },
        JWT: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        },
        REDIS: {
            url: process.env.REDIS_URL,
        },
        SERVER: {
            port: process.env.PORT,
            nodeEnv: process.env.NODE_ENV,
        },
        CORS: {
            frontendUrl: process.env.FRONTEND_URL,
        },
    }
}