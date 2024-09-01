const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
const port = process.env.PORT

const SongRoute = require('./routes/SongRoute');
const connectDB = require('./config/Db');
connectDB();

app.use(cors());
app.use(express.json());

app.use('/song', SongRoute)

app.get("/docker", (req, res) => {
    res.send("Hello from Docker!\n");
})

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})

