


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");









const app = express();

dotenv.config();

const port = process.env.PORT;

// For testing
app.get('/', (req, res) => {
    res.send('API is working');
});



// const connect = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB database connected');
//     } catch (err) {
//         console.error('MongoDB database connection failed', err);
//     }
// };



app.use(express.json());
app.use(cors());
app.use(cookieParser());




const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'anuragpandey21193@gmail.com', // Your Gmail email address
        pass: 'shgf rmpl jfrd bkma', // Your Gmail password (use an app-specific password)
    },
});

app.post('/send_email', (req, res) => {
    const { name, phone, email, area } = req.body;

    const mailOptions = {
        from: "anuragpandey21193@gmail.com",
        to: ['ap1663392@gmail.com'],// Receiver's email address

        subject: 'Kismat Form Submission',
        // text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nIntrestested_City: ${intrested_city}\nDo You Own A Gym : ${own_gym}\nInvestment Range: ${investment_range}\nMessage: ${message}`,
        html: `
        <table style="border: 1px solid #000; border-collapse: collapse; width: 50%;">
    <tr>
        <th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #f2f2f2;">Name:</th>
        <td style="border: 1px solid #000; padding: 8px;">${name}</td>
    </tr>
    <tr>
        <th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #f2f2f2;">Email:</th>
        <td style="border: 1px solid #000; padding: 8px;">${email}</td>
    </tr>
    <tr>
        <th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #f2f2f2;">Phone:</th>
        <td style="border: 1px solid #000; padding: 8px;">${phone}</td>
    </tr>
    <tr>
        <th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #f2f2f2;">Phone:</th>
        <td style="border: 1px solid #000; padding: 8px;">${area}</td>
    </tr>
    
   
</table>

        `,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, error: 'An error occurred while sending the email' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ success: true, message: 'Email sent successfully' });
        }
    });
});






app.listen(port, () => {

    console.log('Server is up on port ' + port)
})




