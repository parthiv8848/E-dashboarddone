const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const sharp = require("sharp");
const fs = require('fs');
// const config = require('./db/config');
// const fs = require('fs');
dotenv.config();

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};



// app.use('/uploads', express.static('uploads'));
require('./db/config');
const User = require("./db/User");
const Product = require("./db/Product.js");
// const jwt = require("jsonwebtoken");
const OTP = require("./db/OTP"); 
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  app.post('/login',async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email});
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isPasswordValid =bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });
  
      const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, name: user.name, email: user.email });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });



// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, './uploads'); // Ensure this path is correct
  },
  filename: function (_req, file, cb) {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});


// Create the multer instance with the storage configuration


const upload = multer({
  storage: multer.memoryStorage(), // Store images in memory for processing
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

// ...

// Route to add a product with an image
app.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    // Extract product details from the request body
    const { name, price, category, company } = req.body;

    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    // Process and compress the uploaded image using sharp
    const imageBuffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 }) // Resize image as needed
      .jpeg({ quality: 90 }) // Convert to JPEG format with 90% quality (adjust as needed)
      .toBuffer();

    // Define the directory where you want to save the image
    const uploadDir = './uploads';

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate a unique file name
    const uniqueFileName = `${Date.now()}-compressed.jpg`;

    // Build the full path to save the file
    const imagePath = path.join(uploadDir, uniqueFileName);

    // Write the processed image to the server
    fs.writeFileSync(imagePath, imageBuffer);

    // Construct the image URL based on your server's public URL
    const publicImageUrl = `https://okdone.onrender.com/uploads/${uniqueFileName}`;

    // Create a new product with the processed image path
    const newProduct = new Product({
      name,
      price,
      category,
      company,
      image: publicImageUrl, // Use the public image URL here
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});


app.get("/products" ,async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: "No Product found" })
    }
})


app.delete("/product/:id" ,async(req,resp)=>{
    let result=await Product.deleteOne({_id:req.params.id});
    resp.send(req.params);
})



app.get("/product/:id",async(req,resp)=>{
    let result=await Product.findOne({_id:req.params.id});

    if(result){
        resp.send(result);
    }
    else{
        resp.send({result: "no prodduct found"})
    }
})


app.put('/product/:id', upload.single('image'), async (req, res) => {
    try {
      // Extract product details from the request body
      const { name, price, category, company } = req.body;
      
      // Check if the request contains a file (image) and update the image field accordingly
      if (req.file) {
        const imagePath = req.file.path;
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            name,
            price,
            category,
            company,
            image: imagePath, // Save the file path of the updated image in the database
          },
          { new: true } // This option returns the updated document
        );
        
        res.json(updatedProduct);
      } else {
        // If no file (image) is provided in the request, update the product without changing the image field
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            name,
            price,
            category,
            company,
          },
          { new: true } // This option returns the updated document
        );
  
        res.json(updatedProduct);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });


app.get("/search/:key", async (req, resp) => {

let result= await Product.find({
    "$or":[
        { name: { $regex: req.params.key } },
        { category: { $regex: req.params.key } },
        { company: { $regex: req.params.key } }
    ]

    
});

resp.send(result);

})

app.get("/profile/:id",  async (req, res) => {
    try {
   
      const user = await User.findOne().select("-password");
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });
  
  app.put("/profile/:id", async (req, res) => {
    try {
      // Get the user ID from the request parameters
    
  
      // Extract updated profile data from the request body
      const { name, email } = req.body;
  
      // Find the user in the database by ID
      const user = await User.findOne();
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's name and email
      user.name = name;
      user.email = email;
  
      // Save the updated user data to the database
      const updatedUser = await user.save();
  
      // Send the updated user data as the response
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });


  
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.random().toString(36).substr(2, 6); // Generate a 6-digit random OTP

    // Create an OTP document and set the expiration time to 10 minutes
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    const otpDocument = new OTP({ email, otp, expiresAt });
    await otpDocument.save();

    // Send the OTP to the user's email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ message: 'OTP sent successfully' });
      }
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and reset password
app.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if the OTP is valid and not expired
    const otpDocument = await OTP.findOne({ email, otp, expiresAt: { $gt: new Date() } });
    if (!otpDocument) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Delete the OTP document
    await OTP.findOneAndDelete({ email, otp });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});








app.listen(5000);
