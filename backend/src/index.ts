import express = require('express');
import cors = require('cors');
import dotenv = require('dotenv');
import {entityRoutes} from './routes/entityRoutes';
import {pokemonRoutes} from './routes/pokemonRoutes';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
	origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://localhost:3000'],
	credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/entity', entityRoutes);
app.use('/api/pokemon', pokemonRoutes)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});