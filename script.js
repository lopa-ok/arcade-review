const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://philopater123essam:<password>@cluster0.8hvdyzp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const reviewSchema = new mongoose.Schema({
    name: String,
    review: String,
    date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint to handle review submission
app.post('/submit-review', async (req, res) => {
    const { name, review } = req.body;
    const newReview = new Review({ name, review });

    try {
        await newReview.save();
        res.status(201).send('Review submitted successfully!');
    } catch (err) {
        res.status(500).send('Error submitting review');
    }
});

// Endpoint to retrieve all reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).send('Error fetching reviews');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
