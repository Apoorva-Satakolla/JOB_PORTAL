import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'

const app = express();

// Connect to MongoDB
await connectDB();

// Middlewares — webhook comes first to preserve raw body
app.use('/webhooks', express.raw({ type: "*/*" })); 
app.post('/webhooks', clerkWebhooks);

// Now JSON middleware for all other routes
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => res.send("API Working"));

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
