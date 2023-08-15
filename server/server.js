require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const csvParser = require('csv-parser');
const cors = require('cors');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const bcrypt = require("bcrypt");

// Variables
const { connectDB, User, createRecord, createManyRecords, findRecord, updateRecord, deleteRecord } = require('./database');
const { Readable } = require('stream');
const PORT = process.env.PORT || 4000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const storage = multer.memoryStorage();
const upload = multer({ storage });
// ENV VARIABLES
const jwsSecretAccessKey = process.env.JWT_SECRET_KEY;
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const development = process.env.DEVELOPMENT_CONFIG;
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");

// Initilize
if (fs.existsSync(buildPath) && !development) {
    app.use(express.static(buildPath));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

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

// Initializing db and setting watch
connectDB().then((db) => {
    const notificationColl = db.collection('notifications');
    const notiStream = notificationColl.watch();

    const userSocketMap = new Map(); // Map to store user-to-socket associations

    io.on('connection', (socket) => {

        socket.on('newUser', (user) => {
            userSocketMap.set(user._id, socket);
        });

        socket.on('disconnect', () => {
            // Remove the user-to-socket mapping on disconnect
            for (const [userId, existingSocket] of userSocketMap.entries()) {
                if (existingSocket === socket) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });

    });

    notiStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const notification = change.fullDocument;
            const userId = notification.userId; // Assuming you have a userId in your notification
            const socketForUser = userSocketMap.get(userId);

            if (socketForUser) {
                socketForUser.emit('getNotification', notification);
            }
        }
    });

});


// Routes / Views
app.post('/auth/login', async (req, res) => {
    let { username, password } = req.body;
    username = username.toLowerCase();
    try {
        const logUser = await User.auth(username, password);

        if (logUser) {
            // Creating jws token
            const token = jwt.sign({ ...logUser }, jwsSecretAccessKey, { expiresIn: '1h' });

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

app.post('/auth/register', upload.single('profile'), async (req, res) => {
    let { firstname, lastname, username, password, dob, email, phone, address, status, role, creator_role } = req.body;
    let fileDir;
    firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
    lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
    username = username.toLowerCase();
    let message = 'User created, please wait for aproval';

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

        fileDir = `https://${bucketName}.s3.amazonaws.com/${imageName}`;
    } catch (error) {
        fileDir = 'https://registerapp.s3.us-east-2.amazonaws.com/default-profile.png';
    }

    try {

        status = creator_role === 1 ? 'Approved' : status;

        const insertId = await User.create({
            firstname,
            lastname,
            username,
            password,
            dob,
            email,
            phone,
            address,
            status,
            fileDir,
            role
        });

        if (creator_role !== 1) {
            await createRecord('notifications',
                {
                    title: 'User request',
                    subtitle: `${firstname} ${lastname} has request to join.`,
                    to: '/Notifications',
                    icon: 'PersonRounded',
                    role: 1,
                    open: false,
                    reference: insertId,
                    type: 'users',
                    user_id: ''
                }
            );
        } else {
            message = 'User created!'
        }

        res.send({ message: message, status: true });

    } catch (error) {
        res.status(404).send({ message: error.message });
    }

});

app.post('/auth/logout', async (req, res) => {
    res.clearCookie('token');
    res.send({ message: 'We\'ll see you soon!  ' });
});

app.post('/getData', async (req, res) => {
    const { collection, filter } = req.body;
    let response = undefined;

    try {
        response = await findRecord(collection, filter);
    } catch (error) {
        res.status(404).send({ message: error });
    }

    if (response !== undefined) {
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
                        await createRecord('notifications', 
                            { 
                                title: 'New Course', 
                                subtitle: 'There\'s a new course available', 
                                to: '/Courses', 
                                icon: 'ListAlt', 
                                role: 3, 
                                open: false, 
                                reference: response, 
                                type: 'course', 
                                user_id: '' 
                            }
                        );

                        message = 'Course created!';
                    }
                }
                break;
            case 'usercourses':
                values['status'] = 'status' in values ? values.status : 'Pending';

                if (response = await createRecord(collection, values, validation)) {
                    let requestedUser;

                    if (requestedUser = await findRecord('users', { _id: values.user_id })) {

                        requestedUser = requestedUser[0];

                        if (values.status === 'Accepted') {

                            let course = await findRecord('courses', {_id: values.course_id});
                            course = course[0];

                            course['Available'] -= 1

                            await updateRecord('courses', course);

                            await createRecord('notifications', 
                                { 
                                    title: 'Added To Course', 
                                    subtitle: 'You have been added to a new course!', 
                                    to: '/Courses',
                                    icon: 'ListAlt', 
                                    role: 0,
                                    open: false, 
                                    reference: values.course_id, 
                                    type: 'usercourses',
                                    user_id: requestedUser._id
                                }, 
                                validation
                            );
    
                            message = `You have added ${requestedUser.firstname} ${requestedUser.lastname} to this course!`;
                        } else {
                            await createRecord('notifications', 
                                { 
                                    title: 'Joining Course', 
                                    subtitle: `${requestedUser.firstname} ${requestedUser.lastname} has request to join this course.`, 
                                    to: '/Notifications', 
                                    icon: 'ListAlt', 
                                    role: 1, 
                                    open: false, 
                                    reference: response, 
                                    type: 'usercourses', 
                                    user_id: '' 
                                }, 
                                validation
                            );
    
                            message = 'Your request has been sent, you have to wait for approval!';
                        }
                    }
                }
                break;
            default:
                response = await createRecord(collection, values, validation);
                break;
        }
    } catch (error) {
        res.status(404).send({ message: error });
    }

    if (response !== undefined) {
        res.send({ message: message, status: true, recordId: response});
    }
});

app.post('/updateData', upload.single('file'), async (req, res) => {
    let { collection, values } = req.body;
    let response = undefined;
    let message = 'Record updated!';
    const file = req.file;

    values = typeof values === 'string' && JSON.parse(values);

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
                    await updateRecord('courses', { _id: values.course_id, 'Available': newAvailableSpace });

                    await createRecord('notifications', 
                        { 
                            title: `Request ${values.status}`, 
                            subtitle: 'Check course', 
                            to: '/Courses', 
                            icon: values.status === 'Accepted' ? 'DoneOutlineRounded' : 'CancelRounded', 
                            role: 3, 
                            open: false, 
                            reference: values.course_id, 
                            type: 'course', 
                            user_id: values.user_id 
                        }
                    );
                }
                message = `Student ${values.status}`;
                break;
            case 'profile':
                (typeof values === 'string') ? values = JSON.parse(values) : values;
                if (file) {
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

                        values['fileDir'] = `https://${bucketName}.s3.amazonaws.com/${imageName}`;
                    } catch (error) {
                        values['fileDir'] = 'https://registerapp.s3.us-east-2.amazonaws.com/default-profile.png';
                    }
                }

                response = await updateRecord('users', values);

                message = 'User information updated!';

                break;
            case 'password':
                const user = await User.auth(values.username, values.current_password);

                if (user) {
                    values.new_password = await bcrypt.hash(values.new_password, 10);
                    response = await updateRecord('users', { _id: values._id, password: values.new_password });

                    message = 'Password Updated!';
                }
                break;
            case 'contact':
            case 'address':
                response = await updateRecord('users', values);
                break;
            default:
                response = await updateRecord(collection, values);
                break;
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }

    if (response !== undefined) {
        res.send({ message: message, status: true });
    }

});

app.post('/deleteData', async (req, res) => {
    const { collection, filter } = req.body;
    let response = undefined;
    let message = 'Record deleted!';

    try {
        switch (collection) {
            case 'courses':
            case 'students':
            case 'teachers':

                response = await deleteRecord(collection !== 'courses' ? 'users' : 'courses', filter);

                if (response) {

                    filter._id = filter._id.toString();

                    const relation_filter = collection === 'courses' ? {course_id: filter._id} : collection === 'students' ? {user_id: filter._id} : {'Teacher ID' : filter._id};
    
                    const relations = await findRecord(collection === 'teachers' ? 'courses' : 'usercourses', relation_filter);
    
                    if (relations.length > 0) {
                        relations.forEach( async (record) => {
                            if (collection === 'teachers') {
                                record['Teacher ID'] = '';
                                await updateRecord('usercourses', record);
                            } else {
                                await deleteRecord('usercourses', { _id: record._id});
                                console.log(record);
                                // await updateRecord('usercourses', record);
                            }
                        });
                    }
                }
                break;
            case 'usercourses':
                let currentData = await findRecord('usercourses', filter);
                currentData = currentData[0];
                if (currentData) {
                    let currentCourse = await findRecord('courses', {_id: currentData.course_id});
                    currentCourse = currentCourse[0];
                    response = await deleteRecord(collection, filter);
                    if (response) {
                        currentCourse['Available'] += 1;
                        await updateRecord('courses', currentCourse);
                    }
                }
                break;
            default:
                response = await deleteRecord(collection, filter);
                break;
        }
    } catch (error) {
        res.status(404).send({ message: error });
    }

    if (response !== undefined) {
        res.send({ message: message, status: true });
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

server.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
});