


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');




const fs = require("fs");
const https = require("https");
const http = require("http");
const path = require('path')

const cookieParser = require('cookie-parser');
const nodemailer = require("nodemailer");
const user = require('./modal/user');
const PhoneModal = require('./modal/PhoneModal');
const { default: axios } = require('axios');
const VerifyModal = require('./modal/VerifyModal');









const app = express();

dotenv.config();

const port = process.env.PORT;

// For testing
app.get('/', (req, res) => {
    res.send('API is working');
});



const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB database connected');
    } catch (err) {
        console.error('MongoDB database connection failed', err);
    }
};



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



// app.post('/send_otp', async (req, res) => {
//     const { phone } = req.body;

//     try {
//         // Generate a random 6-digit OTP
//         const otp = Math.floor(100000 + Math.random() * 900000);

//         let url = `http://91.108.105.7/api/v2/SendSMS?SenderId=JDMGPL&Is_Unicode=false&Is_Flash=false&Message=Dear%20User%20Your%20Login%20OTP%20is%20${otp}%20JDMGPL&MobileNumbers=91${phone}&ApiKey=cq9GcyKZvfszs%2BYHGwOwTuKuGMQixXkAhftMttgKOjI%3D&ClientId=040bee8a-801c-4bf0-8b55-37b7fb85896b`;

//         const response = await axios.get(url);

//         // Check if OTP was sent successfully
//         if (response.status === 200) {
//             res.json({ success: true, message: 'OTP sent successfully', otp: otp });
//         } else {
//             res.status(500).json({ success: false, message: 'Failed to send OTP' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, message: 'An error occurred' });
//     }
// });

app.post('/send_otp', async (req, res) => {
    const { phone } = req.body;

    try {
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        let url = `https://api.shinenetcore.in/api/v2/SendSMS?SenderId=JDMGPL&Is_Unicode=false&Is_Flash=false&Message=Dear%20User%20Your%20Login%20OTP%20is%20${otp}%20JDMGPL&MobileNumbers=91${phone}&ApiKey=cq9GcyKZvfszs%2BYHGwOwTuKuGMQixXkAhftMttgKOjI%3D&ClientId=040bee8a-801c-4bf0-8b55-37b7fb85896b`;

        const response = await axios.get(url);

        // Check if OTP was sent successfully
        if (response.status === 200) {
            // Save phone number and OTP to MongoDB
            const newPhone = new PhoneModal({ phone, otp });
            await newPhone.save();
            res.json({ success: 1, message: 'OTP sent successfully' });
        } else {
            res.status(500).json({ success: 0, message: 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: 1, message: 'An error occurred' });
    }
});

app.post('/verify_otp', async (req, res) => {
    const { phone, otp } = req.body;
    console.log(otp)
    try {
        // Find the latest phone number in PhoneModal collection based on _id
        const latestPhoneEntry = await PhoneModal.findOne({ phone }).sort({ _id: -1 });
        console.log(latestPhoneEntry)

        // Check if phone number and OTP match
        if (latestPhoneEntry && latestPhoneEntry.otp == otp) {
            // OTP matched, save phone number and OTP to VerifyModal collection
            const newVerifyMobile = new VerifyModal({ phone, otp });
            await newVerifyMobile.save();

            res.json({ success: 1, message: 'Phone number verified ' });
        } else {
            // OTP did not match or phone number not found
            res.status(200).json({ success: 0, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: 0, message: 'An error occurred' });
    }
});


app.post('/send_email', async (req, res) => {
    const { name, phone, email, area } = req.body;

    // Save form data to MongoDB
    try {
        const newUser = new user({ name, phone, email, area });
        await newUser.save();

        // Send email using Nodemailer (uncomment this section if you want to send email)

        const mailOptions = {
            from: "anuragpandey21193@gmail.com",
            to: ['Kismatpropertycustomer@gmail.com', 'rohitraic8@gmail.com'],

            subject: 'Kismat Form Submission',
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
                        <th style="border: 1px solid #000; padding: 8px; text-align: left; background-color: #f2f2f2;">Area:</th>
                        <td style="border: 1px solid #000; padding: 8px;">${area}</td>
                    </tr>
                </table>
            `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ success: 0, error: 'An error occurred while sending the email' });
            } else {
                console.log('Email sent:', info.response);
                res.json({ success: 1, message: 'Email sent successfully' });
            }
        });


        res.json({ success: 1, message: ' data saved successfully' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ success: 0, error: 'An error occurred while saving form data' });
    }
});




let filePath = path.join(__dirname, './cert.pem');
const certificate = fs.readFileSync(filePath, 'utf8');
let filePath1 = path.join(__dirname, './private.key');
const pvtkey = fs.readFileSync(filePath1, 'utf8');
const options = {
    key: pvtkey,
    cert: certificate,
};
https.createServer(options, app)
    .listen(port, function (req, res) {
        connect()
        console.log("Server started at port https " + port);
    });




// app.listen(port, () => {
//     connect()
//     console.log('Server is up on port ' + port)
// })




