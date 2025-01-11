const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/config");
const purchaseRoute = require("./routes/purchaseRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const saleOrderRoute = require("./routes/salesOrderRoute");

//environment variables
env.config();

//Database
connectDb();

app.use(express.json());
app.use(cors());
app.use("/api", purchaseRoute);
app.use("/api", inventoryRoute);
app.use("/api", saleOrderRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server is connected at port ${process.env.PORT}`)
);
