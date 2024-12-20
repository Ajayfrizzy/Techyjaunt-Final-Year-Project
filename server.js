const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3300;
const propertiesFilePath = path.join(__dirname, 'properties.json');

// Add CORS configuration before other middleware
app.use(cors({
    origin: 'http://127.0.0.1:5502' || '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Increase payload size limits
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('public'));

// Endpoint to get properties
app.get('/api/properties', (req, res) => {
    fs.readFile(propertiesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read properties file' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a property
app.post('/api/properties', (req, res) => {
    const newProperty = req.body;
    fs.readFile(propertiesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read properties file' });
        }
        const properties = JSON.parse(data);
        properties.push(newProperty);
        fs.writeFile(propertiesFilePath, JSON.stringify(properties, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write properties file' });
            }
            res.status(201).json(newProperty);
        });
    });
});

// Endpoint to delete a property
app.delete('/api/properties/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    fs.readFile(propertiesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read properties file' });
        }
        const properties = JSON.parse(data);
        if (index < 0 || index >= properties.length) {
            return res.status(400).json({ error: 'Invalid property index' });
        }
        properties.splice(index, 1);
        fs.writeFile(propertiesFilePath, JSON.stringify(properties, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write properties file' });
            }
            res.status(204).end();
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});