const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const slotRoutes = require("./routes/slot");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 6767;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);

mongoose.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));


app.get("/", (req, res) => {
	console.log("[debug: works");
	res.json({
		debug: "hello, world!"
	});
});



app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});
