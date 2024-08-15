
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const dbUrl="mongodb+srv://sudhakar:sudhakar@cluster0.odnra1b.mongodb.net/";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Schema and Model
const itemSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});
const workSchema=new mongoose.Schema({
   PartyName:{type:String, required:true},
   BoardSize:{type:String, required:true},
   CoatingSize:{type:String, required:true},
   Quantity:{type:String, required:true},
   Colour:{type:String, required:true},
   Plate:{type:String, required:true},
});


//Two tables are created
const AdminItem = mongoose.model('AdminLogin', itemSchema);
const EmployeeItem = mongoose.model('EmployeeLogin', itemSchema);
const WorkDetails = mongoose.model('WorkDetails',workSchema);







//only the admin has loged in
app.post('/AdminLogins', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  try {
    const existingUser = await AdminItem.findOne({ username, password });
    if (existingUser) {
      return res.status(200).send('User logged in successfully');
    } else {
      return res.status(401).send('Invalid credentials');
    }

  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});








//the admin has added a employee 
app.post('/AddEmployeeLogins', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  try {
    // Check if the user already exists
    const existingUser = await EmployeeItem.findOne({ username });
    if (existingUser) {
      return res.status(409).send('User already exists');
    }
    // Create a new user if not exists
    const newUser = new EmployeeItem({ username, password });
    await newUser.save();
    res.status(201).send('User added successfully');
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});






//the added employee only login
app.post('/EmployeeLogins', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  try {
    const existingUser = await EmployeeItem.findOne({ username, password });
    if (existingUser) {
      return res.status(200).send('User logged in successfully');
    } else {
      return res.status(401).send('Invalid credentials');
    }

  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});




  //employee sumbit the work
  app.post('/AddworkDetails', async (req, res) => {
    const { PartyName,BoardSize,CoatingSize,Quantity,Colour,Plate } = req.body;
    if (!PartyName||!BoardSize||!CoatingSize||!Quantity||!Colour||!Plate) {
      return res.status(400).send('works are required');
    }
    try {
      const newWork = new WorkDetails({  PartyName,BoardSize,CoatingSize,Quantity,Colour,Plate});
      await newWork.save();
      res.status(201).send('Work done successfully');
    } catch (error) {
      console.error('Error submiting work:', error);
      res.status(500).send('Error submiting');
    }
  });






//admin login view

app.get('/AdminLogins', async (req, res) => {
  try {
      const users = await AdminItem.find();
      res.json(users);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});


//employee login view 

app.get('/EmployeeLogins', async (req, res) => {
  try {
      const users = await EmployeeItem.find();
      res.json(users);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});



//employee login view 

app.get('/AddWorkDetails', async (req, res) => {
  try {
      const works = await WorkDetails.find();
      res.json(works);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});





//Edit the employee Details
//update employee 

app.put('/EmployeeLogins/:id', async (req, res) => { 
  try {
      const {username , password }= req.body;
      const id=req.params.id;
      const updateDetails = await EmployeeItem.findByIdAndUpdate(
        id,
        {username,password}
      )      
      if (!updateDetails){
        return res.status(404).json({message:"Details not found"})
      }
      res.json(updateDetails)
     
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});






//the admin only delete the  employee login details so the employee cannot be login

app.delete('/EmployeeLogins/:id', async (req, res) => { 
  try {
      const id=req.params.id;
      await EmployeeItem.findByIdAndDelete(id);
      res.status(204).end();
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});



app.delete('/AddWorkDetails/:id', async (req, res) => { 
  try {
      const id=req.params.id;
      await WorkDetails.findByIdAndDelete(id);
      res.status(204).end();
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});










// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});