const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();
//test

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// view engine
app.set('view engine', 'ejs');

// database connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sdev255:password255@cluster0.cezl033.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const dbURI = ('mongodb+srv://sdev255:password255@cluster0.cezl033.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// routes
app.use(checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/create', requireAuth, (req,res) => res.render('create'));

app.use(authRoutes);
app.use('/courses', requireAuth,courseRoutes);
app.use('/cart', requireAuth, cartRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});