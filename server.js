const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/eventpro', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Event Schema
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    location: String,
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    attendees: [{
        name: String,
        role: { type: String, enum: ['boss', 'senior', 'colleague', 'junior'] }
    }],
    agenda: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// API Endpoints

// Get all events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ start: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new event
app.post('/api/events', async (req, res) => {
    const event = new Event(req.body);
    try {
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update event
app.put('/api/events/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
