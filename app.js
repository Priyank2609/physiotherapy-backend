const { configDotenv } = require("dotenv");
const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express();
configDotenv();
const userRoutes = require("./routes/user.route");
const doctorRoutes = require("./routes/doctor.route");
const appointmentRoutes = require("./routes/appointment.route");
const serviceRoutes = require("./routes/service.route");
const blogRoutes = require("./routes/blog.route");
const reviewRoutes = require("./routes/review.route");
const galleryRoutes = require("./routes/gallery.route");
const contactRoutes = require("./routes/contact.route");
const cookieParser = require("cookie-parser");
require("./utiles/autoCancelAppointments");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB is connected successfully");
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOrigin = {
  origin: "https://physioterapiaclinic.vercel.app",
  credentials: true,
};

app.use(cors(corsOrigin));

app.use("/users", userRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/services", serviceRoutes);
app.use("/blogs", blogRoutes);
app.use("/reviews", reviewRoutes);
app.use("/galleries", galleryRoutes);
app.use("/contacts", contactRoutes);


app.get("/", (req, res) => {
  res.send("I am working");
});
app.listen(process.env.PORT, () => {
  console.log("I am listening");
});
