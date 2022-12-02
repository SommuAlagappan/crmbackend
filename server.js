const express = require("express")
const cors = require("cors")
const mongodb = require("mongodb")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoClient = mongodb.MongoClient
const dotenv = require("dotenv").config()
const URL = process.env.DB
const DB="crmapp"


const app = express()

app.use(express.json())
app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

 //Authenticate
let authenticate = (req, res, next) => {
    // console.log(req.headers)
    if (req.headers.authorization) {
      try {
        let decode = jwt.verify(req.headers.authorization, process.env.SECRET);
        if (decode) {
          next();
        }
      } catch (error) {
        console.log(error);
        res.status(401).json("Unauthorised");
      }
    } else {
      res.status(401).json("Unauthorised");
    }
  };
  
  // Post user
  app.post("/user", authenticate,  async function (req, res) {
    try {
      // Step1: Create a connection between Nodejs and MongoDB
      const connection = await mongoClient.connect(URL);
  
      // Step2: Select the DB
      const db = connection.db(DB);
  
      // Step3: Select the collection
      // Step4: Do the operation (Create,Read,Update and Delete)
      await db.collection("users").insertOne(req.body);
  
      // Step5: Close the connection
      await connection.close();
      res.status(200).json({ message: "Data inserted successfully" });
    } catch (error) {
      console.log(error);
      //If any error throw error
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  // Get users
  app.get("/users", authenticate,  async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resUser = await db.collection("users").find().toArray();
  
      await connection.close();
  
      res.json(resUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  // Get userbyID
  app.get("/user/:id", authenticate, async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resUser = await db
        .collection("users")
        .findOne({ _id: mongodb.ObjectId(req.params.id) });
  
      await connection.close();
  
      res.json(resUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  //Put User
  app.put("/user/:id", authenticate, async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resUser = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: mongodb.ObjectId(req.params.id) },
          { $set: req.body }
        );
  
      await connection.close();
  
      res.json({ message: "Details updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  //Delete user
  app.delete("/user/:id", authenticate, async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resUser = await db
        .collection("users")
        .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
  
      await connection.close();
  
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  //Register user
  app.post("/register", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db(DB);
      
      let salt = await bcrypt.genSalt(10);
      // console.log(salt)
      let hash = await bcrypt.hash(req.body.password, salt);
      // console.log(hash)
      req.body.password = hash;
  
      await db.collection("users").insertOne(req.body)
      await connection.close();
      res.json("User registered successfully");
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  });
  
  //Login User
  app.post("/login", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db(DB);
  
      let user = await db.collection("users").findOne({ emailAddress: req.body.emailAddress });
  
      if (user) {
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (compare) {
          let token = jwt.sign({ _id: user._id }, process.env.SECRET, {
            expiresIn: "1h"
          })  
          res.json({token})
        } else {
          res.status(401).json({ message: "Username or Password is incorrect"});
        }
      } else {
        res.status(401).json({ message: "Username or Password is incorrect"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Something went wrong");
    }
  });
  
  
  
  // Post employee
  app.post("/employee", authenticate,  async function (req, res) {
    try {
      // Step1: Create a connection between Nodejs and MongoDB
      const connection = await mongoClient.connect(URL);
  
      // Step2: Select the DB
      const db = connection.db(DB);
  
      // Step3: Select the collection
      // Step4: Do the operation (Create,Read,Update and Delete)
      await db.collection("employees").insertOne(req.body);
  
      // Step5: Close the connection
      await connection.close();
      res.status(200).json({ message: "Employee added successfully" });
    } catch (error) {
      console.log(error);
      //If any error throw error
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  // Get employee
  app.get("/employees", authenticate,  async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resEmployee = await db.collection("employees").find().toArray();
  
      await connection.close();
  
      res.json(resEmployee);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  // Get employeebyID
  app.get("/employee/:id", authenticate, async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resEmployee = await db
        .collection("employees")
        .findOne({ _id: mongodb.ObjectId(req.params.id) });
  
      await connection.close();
  
      res.json(resEmployee);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  //Put Employee
  app.put("/employee/:id", authenticate, async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resEmployee = await db
        .collection("employees")
        .findOneAndUpdate(
          { _id: mongodb.ObjectId(req.params.id) },
          { $set: req.body }
        );
  
      await connection.close();
  
      res.json({ message: "Employee details updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  //Delete employee
  app.delete("/employee/:id", authenticate, async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resEmployee = await db
        .collection("employees")
        .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
  
      await connection.close();
  
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  
  
  //Admin Register
  app.post("/adminregister", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db(DB);
      
      let salt = await bcrypt.genSalt(10);
      // console.log(salt)
      let hash = await bcrypt.hash(req.body.password, salt);
      // console.log(hash)
      req.body.password = hash;
  
      await db.collection("admin").insertOne(req.body)
      await connection.close();
      res.json("Admin registered successfully");
    } catch (error) {
      console.log(error);
      res.json(error);
    }
  });
  
  //Admin login
  app.post("/login", async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db(DB);
  
      let user = await db.collection("admin").findOne({ emailAddress: req.body.emailAddress });
  
      if (user) {
        let compare = await bcrypt.compare(req.body.password, user.password);
        if (compare) {
          let token = jwt.sign({ _id: user._id }, process.env.SECRET, {
            expiresIn: "1h"
          })  
          res.json({token})
        } else {
          res.status(401).json({ message:"Username or Password is incorrect"});
        }
      } else {
        res.status(401).json({ message:"Username or Password is incorrect"});
      }
    } catch (error) {
      console.log(error);
      res.status(500).json("Something went wrong");
    }
  });
  
  
  
  
  //Messages post
  app.post("/message", authenticate,  async function (req, res) {
    try {
      // Step1: Create a connection between Nodejs and MongoDB
      const connection = await mongoClient.connect(URL);
  
      // Step2: Select the DB
      const db = connection.db(DB);
  
      // Step3: Select the collection
      // Step4: Do the operation (Create,Read,Update and Delete)
      await db.collection("messages").insertOne(req.body);
  
      // Step5: Close the connection
      await connection.close();
      res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      console.log(error);
      //If any error throw error
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  //Messages get
  app.get("/messages", authenticate,  async function (req, res) {
    try {
      const connection = await mongoClient.connect(URL);
  
      const db = connection.db(DB);
  
      let resMessage = await db.collection("messages").find().toArray();
  
      await connection.close();
  
      res.json(resMessage);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  

app.listen(process.env.PORT || 3001)