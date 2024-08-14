import cors from 'cors';
import express from 'express';
import { connectToDB, db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
    res.json("server is running successfully!");
});

app.post('/ast', async (req, res) => {
    try {
        const result = await db.collection("ast").find().toArray();
        res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const user = await db.collection("ast").findOne({ Gmail: req.body.Gmail });
        if (user?.Password === req.body.password) {
            res.json({ message: "login success", values: user });
        } else {
            res.json({ error: "user not found" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to sign in" });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const result = await db.collection("ast").insertOne({ Gmail: req.body.Gmail, Password: req.body.password });
        if (result) {
            res.json({ message: "Signup success", values: result });
        } else {
            res.json({ error: "Failed" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Failed to sign up" });
    }
});

connectToDB(() => {
    app.listen(9000, () => {
        console.log("server running at 9000");
    });
});
