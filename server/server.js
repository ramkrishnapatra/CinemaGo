// import express from 'express'
// import cors from 'cors'
// import 'dotenv/config'
// import connectDB from './configs/db.js';
// import { clerkMiddleware } from '@clerk/express'
// import { serve } from "inngest/express";
// import { inngest, functions } from "./inngest/index.js"
// import showRouter from './routes/showRoutes.js';
// import bookingRouter from './routes/bookingRoutes.js';
// import adminRouter from './routes/adminRoutes.js';
// import userRouter from './routes/userRoutes.js';
// import { stripeWebHooks } from './controllers/stripeWebhooks.js';

// const app=express();
// const port=3000;

// await connectDB()

// // stripe webhook route 
// app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebHooks);


// // middleware
// app.use(express.json())
// // app.use(cors())
// app.use(clerkMiddleware())
// app.use(cors())


// // API routes
// app.get('/',(req,res)=>res.send('server is live!!'))
// app.use('/api/inngest',serve({ client: inngest, functions }))
// app.use('/api/show',showRouter)
// app.use('/api/booking',bookingRouter)
// app.use('/api/admin',adminRouter)
// app.use('/api/user',userRouter)


// app.listen(port,()=>console.log(`server listening at http://localhost:${port}`))




import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebHooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = 3000;

await connectDB();

// Configure CORS options
const corsOptions = {
  origin: [
    'https://cinemago-client.vercel.app',
    'http://localhost:3000', // for local development
    process.env.FRONTEND_URL // if you have this in your env
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Clerk-Auth-Request', // for Clerk authentication
    'X-Clerk-Auth-Status',  // for Clerk authentication
    'X-Clerk-Auth-Version', // for Clerk authentication
    'X-Clerk-Auth-Message'  // for Clerk authentication
  ],
  credentials: true // if you're using cookies/sessions
};

// stripe webhook route (needs to be before body parser)
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebHooks);

// middleware
app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS with configuration
app.use(clerkMiddleware());

// API routes
app.get('/', (req, res) => res.send('server is live!!'));
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

// Handle OPTIONS requests for preflight
app.options('*', cors(corsOptions));

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));