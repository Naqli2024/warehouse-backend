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
const creditNoteRoute = require("./routes/creditNoteRoute");
const employeeRoute = require("./routes/employeeRoute");
const authRoute = require("./routes/authRoute");
const cookieParser = require("cookie-parser");

// environment variables
env.config();
 
// Database
connectDb();
 
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend domain
  credentials: true, // Allow cookies & authentication headers
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
 
// Serve static files (uploads)
app.use("/uploads", express.static("uploads"));

// Define Routes
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
app.use("/api", creditNoteRoute);
app.use("/api", employeeRoute);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () =>
  console.log(`Server is connected at port ${process.env.PORT}`)
);
