import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express"
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import userRouter from './routes/userRoutes.js'
import { stripeWebHooks } from './controllers/stripeWebhooks.js'

const app = express()
const port = 3000

await connectDB()

// ✅ CORS middleware FIRST
const corsOptions = {
  origin: ["https://cinemago-client.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
app.use(cors(corsOptions))

// ✅ JSON parsing middleware for normal routes
app.use(express.json())

// ✅ Clerk middleware
app.use(clerkMiddleware())

// ✅ Stripe webhook route (requires raw body parser)
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebHooks)

// ✅ Your Routes
app.get('/', (req, res) => res.send('server is live!!'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.listen(port, () => console.log(`server listening at http://localhost:${port}`))
