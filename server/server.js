require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const csvParser = require('csv-parser');
const cors = require('cors');
const {S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require('sharp');

// Variables
// const { connectDB, Role, User, Notification, Menu, Course, UserCourse } = require('./database');
const { connectDB, User, createRecord, createManyRecords, findRecord, updateRecord, deleteRecord } = require('./database');
const { Readable } = require('stream');
const PORT = process.env.PORT || 4000;
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });
// ENV VARIABLES
const jwsSecretAccessKey = process.env.JWT_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Initilize
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// SSE connections holder
const notifications = new Set();

// Inbnitializing db and setting watch
connectDB().then((db) => {
    const notificationColl = db.collection('notifications');
    const notiStream = notificationColl.watch();

    notiStream.on('change', (change) => {
        const notification = change.fullDocument;
        const payload = JSON.stringify(notification);
    
        // Send the update to all connected SSE clients
        notifications.forEach((res) => {
            res.write(`data: ${payload}\n\n`);
        });
    });
});

// Initialize S3
const s3 = new S3Client({
    credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey
    },
    region: bucketRegion
});

// Functions
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Routes / Views
app.post('/auth/login', async(req, res) => {
    let { username, password } = req.body;
    username = username.toLowerCase();
    try {
        const logUser = await User.auth(username, password);

        if (logUser) {
            // Creating jws token
            const token = jwt.sign({ ...logUser }, jwsSecretAccessKey, { expiresIn: '1h'});
            res.cookie('token', token, {
                httpOnly: true,
              });
            // Sending request
            res.status(200).send({
                message: `Welcome ${logUser.firstname} ${logUser.lastname}`,
                user: logUser
              });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }

});

app.post('/auth/register', upload.single('profile'), async(req, res) => {
    let { firstname, lastname, username, password, dob, email, phone, address, status, role } = req.body;
    let fileDir;
    firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
    username = username.toLowerCase();

    try {
        const { buffer, mimetype } = req.file;

        const imageName = randomImageName();
        
        const fileBuffer = await sharp(buffer).resize(500).toBuffer();

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: fileBuffer,
            ContentType: mimetype
        }

        const uploadCommand = new PutObjectCommand(params);

        await s3.send(uploadCommand);

        const getObjectParams = {
            Bucket: bucketName,
            Key: imageName
        }

        const command = new GetObjectCommand(getObjectParams);

        fileDir = await getSignedUrl(s3, command);
    } catch (error) {
        fileDir = 'https://registerapp.s3.us-east-2.amazonaws.com/default-profile.png';
    }

    try {
        const insertId = await User.create({firstname, lastname, username, password, dob, email, phone, address, status, fileDir, role});
        await createRecord('notifications', { title: 'User request', subtitle: `${firstname} ${lastname} has request to join.`, to: '/Notifications', icon: 'PersonRounded', role: 1, open: false, status: 'Pending', reference: insertId, type: 'users', user_id: ''});
        res.send({ message: 'User created, please wait for aproval', status: true });
    } catch (error) {
        res.status(404).send({ message: error.message });
    }

});

app.post('/auth/logout', async (req, res) => {
    res.clearCookie('token');
    res.send({message: 'We\'ll see you soon!  '});
});

app.post('/getData', async (req, res) => {
    const { collection, filter} = req.body;
    let response = undefined;

    try {
        response = await findRecord(collection, filter);
    } catch (error) {
        res.status(404).send({ message: error});
    }

    if (response !== undefined) {
        // res.json(response);
        // res.send({data: response, status: true});
        res.send(response);
    }
});

app.post('/createData', upload.single('file'), async (req, res) => {
    const { collection, values, validation = {} } = req.body;
    const file = req.file;
    let response = undefined;
    let message = 'Record created!';

    try {
        switch (collection) {
            case 'courses':
                if (file) {
                    const fileStream = new Readable();
                    fileStream.push(file.buffer);
                    fileStream.push(null);
                    const results = await new Promise((resolve) => {
                        const data = [];
                        fileStream
                          .pipe(csvParser({ skipLines: 1 }))
                          .on('data', (row) => {
                            const insert = {};
                            let headers = Object.keys(row).filter((k) => k !== '');
                            headers.forEach((header) => {
                                switch (header) {
                                    case 'Capacity':
                                    case 'Credit Hours':
                                        insert[header] = parseInt(row[header]);
                                        break;
                                        break;
                                    default:
                                        insert[header] = row[header];
                                        break;
                                }
                            });

                            // Assigning available space
                            insert['Available'] = parseInt(insert['Capacity']);
                            // Assigning teacher to course
                            insert['Teacher ID'] = '0';
              
                            data.push(insert);
                          })
                          .on('end', () => {
                            resolve(data);
                          });
                      });
                      response = await createManyRecords(collection, results);
    
                } else {
                    response = await createRecord(collection, values, validation);
                    
                    if (response) {
                        await createRecord('notifications', { title: 'New Course', subtitle: 'There\'s a new course available', to: '/Courses', icon: 'ListAlt', role: 3, open: false, status: 'Pending', reference: response, type: 'course', user_id: ''});

                        message = 'Course created!';
                    }
                }
                break;
            case 'usercourses':
                values['status'] = 'Pending';

                if (response = await createRecord(collection, values, validation)) {
                    let requestedUser;

                    if (requestedUser = await findRecord('users', { _id: values.user_id})) {

                        requestedUser = requestedUser[0];
    
                        await createRecord('notifications', { title: 'Joining Course', subtitle: `${requestedUser.firstname} ${requestedUser.lastname} has request to join this course.`, to: '/Notifications', icon: 'ListAlt', role: 1, open: false, status: 'Pending', reference: response, type: 'usercourses', user_id: ''}, validation);
    
                        message = 'Your request has been sent, you have to wait for approval!';
                    }
                }
                break;
            default:
                response = await createRecord(collection, values, validation);
                break;
        }   
    } catch (error) {
        res.status(404).send({ message: error});
    }

    if (response !== undefined) {
        res.send({ message: message, status: true});
    }
});

app.post('/updateData', async (req, res) => {
    const { collection, values } = req.body;
    let response = undefined;
    let message = 'Record updated!';

    try {
        switch (collection) {
            case 'users':
                response = await updateRecord(collection, values);
                message = `User ${values.status}!`;
                break;
            case 'usercourses':
                const newAvailableSpace = values.course_space;
                delete values.course_space;
                response = await updateRecord(collection, values);
                if (response) {
                    await updateRecord('courses', {_id: values.course_id, 'Available': newAvailableSpace});

                    await createRecord('notifications', { title: `Request ${values.status}`, subtitle: 'Check course', to: '/Courses', icon: values.status === 'Accepted' ? 'DoneOutlineRounded' : 'CancelRounded', role: 3, open: false, status: 'Pending', reference: values.course_id, type: 'course', user_id: values.user_id});
                }
                message = `Student ${values.status}`;
                break;
            default:
                response = await updateRecord(collection, values);
                break;
        }   
    } catch (error) {
        res.status(404).send({ message: error });
    }

    if (response !== undefined) {
        res.send({ message: message, status: true});
    }

});

app.post('/deleteData', async (req, res) => {
    const { collection, filter } = req.body;
    let response = undefined;
    let message = 'Record deleted!';

    try {
        response = await deleteRecord(collection, filter);
    } catch (error) {
        res.status(404).send({ message: error });
    }

    if (response !== undefined) {
        res.send({ message: message, status: true});
    }

});

app.get('/protected', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
  
    jwt.verify(token, jwsSecretAccessKey, (error, decode) => {
      if (error) {
        return res.status(401).send({ message: 'Invalid token!' });
      }
  
      res.send({ status: true, user: decode });
    });
  
});

app.get('/notification', (req, res) => {

    try {
        // Set notifications headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    } catch (error) {
        console.log(error);
    }

    notifications.add(res);

    // Remove the connection when the client disconnects
    req.on('close', () => {
        notifications.delete(res);
      });
});

app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
});