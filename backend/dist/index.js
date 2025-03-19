"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const entityRoutes_1 = require("./routes/entityRoutes");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/routes', entityRoutes_1.entityRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
