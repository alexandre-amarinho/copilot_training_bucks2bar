const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Create Resend SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
    }
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

app.post('/api/send-chart', limiter, async (req, res) => {
    const { email, username, chartImage } = req.body;
    console.log("SEND EMAIL WORKS");
    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Sanitize username
    const sanitizedUsername = username.replace(/[<>]/g, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(chartImage.split(',')[1], 'base64');
    
    const mailOptions = {
        from: 'Bucks2Bar <onboarding@resend.dev>',
        to: email,
        subject: 'Your Bucks2Bar Financial Chart',
        html: `<p>Hello ${sanitizedUsername},</p><p>Please find your financial chart attached.</p>`,
        attachments: [{
            filename: 'financial-chart.png',
            content: imageBuffer,
            contentType: 'image/png'
        }]
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Resend SMTP error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// An array of 10 dummy cars with the following properties: engine position, manufacturer, power, name
// function generateDummyCars(nb_items = 10) {
//     const manufacturers = ['Toyota', 'Ford', 'Chevrolet', 'Honda', 'BMW'];
//     const enginePositions = ['front', 'mid', 'rear'];
//     const carNames = ['Model A', 'Model B', 'Model C', 'Model D', 'Model E'];
//     const cars = [];
//     for (let i = 0; i < nb_items; i++) {
//         const car = {
//             engine_position: enginePositions[Math.floor(Math.random() * enginePositions.length)],
//             manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
//             power: Math.floor(Math.random() * 400) + 100, // Power between 100 and 500 HP
//             name: carNames[Math.floor(Math.random() * carNames.length)]
//         };
//         cars.push(car);
//     }
//     return cars;
// }

// console.log(generateDummyCars());