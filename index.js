const express = require('express'); 
const port = 3000; 
const compression = require('compression');
const app = express(); 
const bodyParser = require('body-parser');

require('./db')
require('./Models/User')
require('./Models/Post')
require('./Models/Message')


const authRoutes = require('./routes/authRoutes')
const uploadMediaRoutes = require('./routes/uploadMediaRoutes')
const messageRoutes = require('./routes/messageRoutes');



app.use(bodyParser.json())
app.use(authRoutes)
app.use(uploadMediaRoutes)
app.use(messageRoutes)
app.use(compression());

app.get('/',(req,res) => { 
    res.send("Hello World");
})


app.listen(port, () => {
    console.log("Server Runnning On Port "+port)
})