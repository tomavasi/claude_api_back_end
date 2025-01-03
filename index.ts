import 'dotenv/config'
import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from './routes/users';
import { authRouter } from './routes/auth';
import { claudeRouter } from './routes/claude';


const app: Express = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true
};

app.use(express.json());
app.use(cors(options))
app.use(cookieParser());

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/', (req, res) => {
  res.send("Hello to LUMO Claude Api")
})

apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/claude', claudeRouter);

app.listen(PORT, () => {
  console.log(`Listeng to port: ${PORT}`)
})
