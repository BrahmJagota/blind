//  api key of apyhub to validate email address
// APY0FobpiGXExB3UfxrOzdzv05MKa3ckSXn9T7FmoYYHPBnaFbMX0z9bnfaUzoGQWYtNT

import express from "express";
// import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import session from 'express-session';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
const MongoDBStore = connectMongoDBSession(session);
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import db from "../database.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { otpModel, userModel, threadsModel, chatModel, roomModel } from "../models/models.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; 
import cors from 'cors';

dotenv.config();
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["POST", "GET"],
  credential: true,
};
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017',
  databaseName: 'blind',
  collection: 'sessions'
});

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret_key",
    unset: 'destroy',
    store: store,
    cookie: {
      sameSite: true,
      maxAge: 2000000,
      secure: false,
      httpOnly: true,
    },
  })
);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "demouser2832@gmail.com",
    pass: "pwpbzbfhgiupodhi",
  },
});

let details = {
  from: "demouser2832@gmail.com",
  to: "brahmjagota1@gmail.com",
  subject: "testing our mail",
  text: "test our first email",
};



//  generate otp
let otp = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
});

const authUser = (req, res, next) => {
  if(req.session.userId){
    console.log("auth works");
    // req.session.destroy();
    next();
  } else {
    console.log("auth works df");
    return res.json({
      success: false,
      redirect: true,
      message: "you are not allowed in this route"
    })
  }
}
app.get('/me', authUser, (req, res)=> {
  const userId = req.session.userId;
  res.json({
    success: true,
    redirect: false,
    message: userId
  })
})
  app.get('/test', authUser ,(req,res)=> {
    console.log("test", req.session.userEmail)
    res.json({
      email: req.session.email,
      success: true,
      message: "hello this is a test"
    })
  })

    app.get('/api/logout', (req, res)=> {
      req.session.destroy((err)=> {
        console.log('session destroyed')
      })
      res.json({
        success: true
      })
    })
// there is a loop hole here which is yet to fix as anyone with any email can generate otp
app.post("/api/generate-otp", (req, res) => {  
  // generate otp
  const { email } = req.body;
  let otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  console.log("otp", otp);  
  const result = new otpModel({
    email: email,
    otp: otp
  }).save();
  if(result){
    res.json({
      success: true,
      message: otp
    });  
  } else {
    res.json({
      success: false,
      message: "failed to save otp"
    })
  }
  
});

// save threads
app.post("/api/create-thread", async (req, res)=> {
  try{
    const { thread, createdBy } = req.body;
    if(thread !== '') {
      const findThread = await threadsModel.findOne({thread: thread});
      if(findThread) {
        return res.json({success: false,
        message: "This thread is already created by someone else."})
      } else{
      const data = new threadsModel({
        thread: thread,
        createdBy: createdBy
      });
      const result =  await data.save();
      if(result) {
       return res.json({
        success: true,
        message: result
       })
      } else {
        return res.send("oops failed to save your thread please try again!!");
      }
    }
    } else {
      return res.send("thread is not valid argument please enter some valid name");
    }
  } catch (err){
    return console.log(err);
  }
})

app.get('/api/get-threads', authUser ,async (req, res) => {
  try{
    const getThreads = await threadsModel.find({});
    if(getThreads){
      return res.json({success: true,
      message: getThreads})
    } else {
      return res.json({
        success: false,
        message: "Failed to fetch data from database."
      })
    }
  } catch (err) {
    res.json({
      success: false,
      message: "Failed to fetch data from database."
    })
    console.log("error from get threads",err);
  }
})
// encrypt the password
app.post("/api/register", async (req, res) => {
  const url = "https://api.apyhub.com/validate/email/academic";
  let isStudentValid;
  try {
    const validateUser = {
      email: req.body.email,
      password: req.body.password,
      cPassword: req.body.cpassword,
    };
    // console.log(validateUser)
    if (
      !validateUser.email ||
      !validateUser.password ||
      !validateUser.cPassword
    ) {
      return res.send("enter valid inputs");
    } else {
      const options = {
        method: "POST",
        headers: {
          "apy-token":
            "APY0FobpiGXExB3UfxrOzdzv05MKa3ckSXn9T7FmoYYHPBnaFbMX0z9bnfaUzoGQWYtNT",
          "content-type": "application/json",
        },
        body: `{"email": "${validateUser.email}"}`,
      };
      //   later move it to another file
      async function fetchData(url, options) {
        try {
          const response = await fetch(url, options);
          const json = await response.json();
          return json.data;
        } catch (err) {
          console.error("Error:", err);
          throw err; // Propagate the error
        }
      }

      async function processStudentStatus() {
        try {
          let isStudent = await fetchData(url, options);
          // console.log("isStudent:", isStudent);

          if (!isStudent) {
            isStudent = false;
            console.log("isStudent:", isStudent);
            return res.json({
              success: false,
             message :"sorry you are not allowed as you are not a student"
          });
          } else if (validateUser.password !== validateUser.cPassword) {
            return res.json({
              success: false,
             message: "password didn't match"}
              );
          } else {
            const checkIfUserExists = await userModel.findOne({
              email: validateUser.email,
            });
            if (checkIfUserExists) {
              return res.json({
                success: false,
                message: "user already exists"
              });
            } else {
              let detailss = {
                from: "demouser2832@gmail.com",
                to: "brahmjagota1@gmail.com",
                subject: "testing our mail",
                text: `your otp is ${otp}`,
              };

              // transporter.sendMail(detailss, (err) => {
              //   if (err) throw err;
              //   else {
              //     console.log("email send successfull");
              //   }
              // });

              // save otp
              const email = validateUser.email
              const payload = { email, otp };
              // const dbOtp = await otpModel.create(payload);
              const user = new userModel(validateUser);
              const saltRounds = 3;
              const hashedPassword = await bcrypt.hash(
                validateUser.password,
                saltRounds
                );
                user.password = hashedPassword;
                const result = await user.save();
              if(result){
                req.session.userEmail = result.email;
                req.session.userId = result._id;
                console.log("id", result._id);
                req.session.save();
                console.log("session", req.session.userEmail);
                console.log("result", result)
                return res.json({
                  success: true,
                  message: "user registered succesfull",
                });
              } else {
                return res.json({
                  success: false,
                  message: "failed to save the user"
                })
              }
            }
          }
        } catch (err) {
          console.error("Error:", err);
        }
      }
      processStudentStatus();
    }
  } catch (err) {
    console.error(err);
  }
});

app.post("/api/verify-otp", async (req, res) => {
    const { otp, email } = req.body;
    try{
      let result = await otpModel.findOne({email: email ,otp: otp})
      if(result) {
        return res.json({
         success: true,
         message: "otp verification successfull"
        })
      } else {
        return res.json({
         success: false,
         message: 'otp verification failed'
        })
      }
    } catch (err) {
      cosnole.log(err)
    }
})

app.post("/api/resend-otp", async (req, res)=> {
    const { email } = req.body;
    try{
      let detailss = {
        from: "demouser2832@gmail.com",
        to: "brahmjagota1@gmail.com",
        subject: "testing our mail",
        text: `your otp is ${otp}`,
      };

      transporter.sendMail(detailss, (err) => {
        if (err) throw err;
        else {
          console.log("email send successfull");
        }
      });

      // save otp
      const payload = { email, otp };
      console.log(payload)
      const dbOtp = await otpModel.findOneAndReplace({email: email, otp: otp});
      if(dbOtp) {
        return res.send(true);
      } else{
        return res.send(false);

      }
    } catch(err) {
      console.log(err)
    }
})

app.post("/api/login", async (req, res) => {
  const validateUser = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    const user = await userModel.findOne({ email: validateUser.email });
    if (!user) {
      res.send("user not found");
    } else {
      const checkPass = await bcrypt.compare(
        validateUser.password,
        user.password
      );
      if (!checkPass) {
        res.json({
          success: false,
          message: 'access failed '
        })
      } else {
        req.session.userId = user._id;
        req.session.userEmail = user.email;
        req.session.save();
        res.json({
          success: true,
          message: 'access granted '
        })
      }
    }
  } catch (err) {
    console.log("Authentication Failed");
    res.status(403).send("Nope. Not allowed, mate.");
  }
});

// load chat
app.post('/api/load-chat', async (req, res) => {
  try{
    const { slug } = req.body;
    console.log("sssss",slug);
    const result = await chatModel.find({sendTo: slug})
    if(result) {
     return res.json({
      success: true,
      message: result,
    })
    } else {
      return res.json({
        success: false
    })
    }
  } catch (err) {
    console.error("cannot load chat because of error:",err);
    res.send("error")
  }
})
app.post('/api/save-chat', authUser, async (req, res)=> {
  const sendBy = req.session.userId;
  const { slug, message } = req.body;
  try{
    const chat = {
      chat: message,
      sendBy: sendBy,
      sendTo: slug
    };
    const result = await new chatModel(chat).save();
    if(result){
      res.json({
        success: true,
        message: "chat saved successfully"
      })
    } else {
      res.json({
        success: false,
        message: "couldn't save chat"
      })
    }
  } catch (err) {
    console.log("error from save chat", err);
  }
})
// rooms joined
app.get('/api/rooms-joined', authUser ,async (req, res)=> {
  const id = req.session.userId
  try{
      const rooms = await roomModel.find({user_id: id})
    if(rooms.length){
      console.log('rooms', rooms);
      return res.json({
        success: true,
        message: rooms
      })
    } else{ 
     return res.json({
        success: false,
        message: "no room joined"
      })
   }
  }catch(err) {
    console.log(err)
  }
}) 
app.get("/hh", (req, res) => {
  res.send("hello")
})
export { app };
