
import mongoose from "mongoose";
 const db = mongoose.connection;

// const mongoURI = process.env.URI;
const mongoURI = 'mongodb://127.0.0.1/blind';
db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  

export default db; 