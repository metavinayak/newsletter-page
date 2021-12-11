const express = require('express')
const https = require('https')
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('assets'))

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/signup.html')
})
app.post('/failure', function (req, res) {
    res.redirect('/')
})

app.post('/', function (req, res) {
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;

    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }
        ]
    };
    let json_data = JSON.stringify(data);
    const url = 'https://us20.api.mailchimp.com/3.0/lists/'+process.env.list_uid+'?skip_merge_validation=true&skip_duplicate_check=true'
    options = {
        method: 'post',
        auth: process.env.apikey
    }
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        }
        else {
            res.sendFile(__dirname + '/failure.html')
        }

        response.on(data, function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(json_data);
    request.end();

    console.log(fname, lname, email)
})

app.listen(process.env.PORT || 3000, () => console.log('Console testing...'))