//run npm init first 
//And have all the recuired libraries installed

//change the .env info about port,db,..,etc

//.gitignore should have node_modules and .env 
//with any other files we dont need to push

require('dotenv').config();

var mongoose = require('mongoose');
const {app} = require('./app');
const port=process.env.PORT || 5000;

// const uri = process.env.ATLAS_URI;
// mongoose.connect(process.env.LOCALDB, { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true });

// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log("MongoDB database connection established successfully");
// });

// //making the app listen on a port
// app.listen(port, () => {
//     console.log(`Listening on port: ${port}`);
// });


mongoose.connect('mongodb+srv://mongobdwezza:abcd@cluster0.ocblc.mongodb.net/db1?retryWrites=true&w=majority')

.then(()=>{
    app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
})

.catch((err)=>
{
    console.log(err);
}) 