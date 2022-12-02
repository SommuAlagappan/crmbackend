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

app.use(express(json()))
app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Post user
app.post("/user",  async function (req, res) {
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


app.listen(process.env.PORT || 3001)