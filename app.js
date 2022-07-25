import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
// import api from './routes/api.js';

const app = express();
app.disable('x-powered-by');
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);
app.use(morgan('dev'));
app.use(express.json());
// app.use('/v1', api);
app.use(express.urlencoded({ extended: true }));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
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
