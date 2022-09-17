import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import api from './routes/api.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static('images'));
app.use('/images', express.static('images'));
app.disable('x-powered-by');
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/v1', api);
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
	res.status(404).json({
		status: 'fail',
		data: {
			resource: 'Not found',
		},
	});
});

export default app;
