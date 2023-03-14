import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import api from './routes/api.js';

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/v1', api);
app.use(express.urlencoded({ extended: true }));

console.log('AGENCY TOKEN:', process.env.JWT_SECRET);

app.get('*', (req, res) => {
	res.status(404).json({
		status: 'fail',
		data: {
			resource: 'Not found',
		},
	});
});

export default app;
