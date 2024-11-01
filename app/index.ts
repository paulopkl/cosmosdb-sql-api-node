import "dotenv/config";
import express from "express";

import itemsRoute from "./routes/items.route";

const app = express();

// Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", itemsRoute);

const port = 3333;
app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});
