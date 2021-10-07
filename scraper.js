const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const getProduct = async (yourPrice) => {
    try {
        const url = 'https://www.nike.com/de/t/jordan-delta-2-herrenschuh-RfcCrb/CV8121-012';

        const { data } = await axios({
            method: "GET",
            url: url,
        })

        const $ = cheerio.load(data);
        const elemSelector = '#PDP > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(1) > div > div.d-lg-ib.mb0-sm.u-full-width.pt5-sm.prl6-sm.pb3-sm.css-3rkuu4.css-1mzzuk6 > div.headline-5.ta-sm-r.mt3-sm.css-1122yjz > div > div';
        const price = parseFloat($(elemSelector).text().replace(',','.').replace(' ',''))

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        })

        let mailOptions = {
            from: process.env.user,
            to: 'youremail@gmail.com',
            subject: 'Price dropped down!',
            html: `The price for your product has dropped to <strong>${price}€</strong>, here's the link: ${url}. `
        }

        if(price <= yourPrice) {
            transporter.sendMail(mailOptions, function (err, data) {
                if(err) {
                    console.log(err);
                } else { 
                    console.log('email sent');
                }
            })
        }

    } catch (error) {
        console.log(error)
    }
}

setInterval(() => {
    getProduct(95);
}, 300000) // Checks the price of the product every 5 mins

app.listen(PORT, console.log(`app running on port ${PORT}`));
