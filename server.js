const express = require("express");
const app = express();
const env = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/config");
const purchaseRoute = require("./routes/purchaseRoute");
const inventoryRoute = require("./routes/inventoryRoute");
const saleOrderRoute = require("./routes/salesOrderRoute");
const packageRoute = require("./routes/packageRoute");
const shipmentRoute = require("./routes/shipmentRoute");
const sourceDepartmentRoute = require("./routes/sourceDepartment");
const vendorRoute = require("./routes/vendorsRoute");
const challanRoute = require("./routes/deliveryChallanRoute");
const categoryRoute = require("./routes/categoryRoute");
const customerRoute = require("./routes/customerRoute");
const salesReturnRoute = require("./routes/salesReturnRoute");
const salesInvoiceRoute = require("./routes/salesInvoiceRoute");

//environment variables
env.config();

//Database
connectDb();

app.use(express.json());
app.use(cors());
app.use("/api", purchaseRoute);
app.use("/api", inventoryRoute);
app.use("/api", saleOrderRoute);
app.use("/api", packageRoute);
app.use("/api", shipmentRoute);
app.use("/api", sourceDepartmentRoute);
app.use("/api", vendorRoute);
app.use("/api", challanRoute);
app.use("/api", categoryRoute);
app.use("/api", customerRoute);
app.use("/api", salesReturnRoute);
app.use("/api", salesInvoiceRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server is connected at port ${process.env.PORT}`)
);
