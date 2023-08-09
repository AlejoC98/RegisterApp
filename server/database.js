const bcrypt = require("bcrypt");
const { MongoClient, ObjectId, Collection } = require('mongodb');

const uri = process.env.DATABASE_URI;
let db;

const client = new MongoClient(uri, {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
});

// ********** DATABASE CONNECTION **********

const connectDB = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db('RegisterApp'); // Store the database connection for reuse
        return db;
    } catch (error) {
        await client.close();
    }
}

// ********** FUNCTIONS **********
const validateRecord = async (collection, filter) => {
    const checkedRecord = await collection.findOne(filter);

    return checkedRecord ? true : false;
}


// ********** GETTING DB COLLECTIONS **********
const getCollection = (name) => db.collection(name);

// ********** SETTING COLLECTION FUCNTIONS **********

const createRecord = async (collection, data, validation = {}) => {
    const collectiondb = getCollection(collection);
    const status = await validateRecord(collectiondb, validation);

    if (!status || Object.keys(validation).length === 0) {
        data['created'] = new Date();
        const newRecord = await collectiondb.insertOne(data);
        return newRecord.insertedId;
    } else {
        throw new Error('Record already exist!');
    }

}

const createManyRecords = async (collection, data) => {
    const collectiondb = await getCollection(collection);

    const insertData = data.map(item => ({
        ...item,
        created: new Date()
    }));

    const newRecords = await collectiondb.insertMany(insertData);
    return newRecords.insertedIds;
}

const findRecord = async (collection, filter = {}) => {
    const collectiondb = getCollection(collection);

    if (Object.keys(filter).includes('_id')) {
        filter._id = new ObjectId(filter._id);
    }

    const found = await collectiondb.find(filter).sort({ created: -1 }).toArray();
    return found;
}

const updateRecord = async (collection, data) => {
    const collectiondb = await getCollection(collection);
    const collID = new ObjectId(data._id);
    delete data._id;
    const updateRecord = await collectiondb.updateOne({ _id: collID}, { $set: data});
    return updateRecord.modifiedCount;
}

const deleteRecord = async (collection, filter) => {
    const collectiondb = getCollection(collection);
    const removedRecord = await collectiondb.deleteOne(filter);
    return removedRecord.deletedCount;
}

const User = {
    create: async (data) => {
        const users = await getCollection('users');
        const checkUseremail = await users.findOne({ 'email': data.email });
        const checkUsername = await users.findOne({ 'username': data.username });

        if (checkUseremail) {
            throw new Error('Email already exists');
        } else if (checkUsername) {
            throw new Error('Username already exists');
        }
        data.password = await bcrypt.hash(data.password, 10);
        data['created'] = new Date();
        const newUser = await users.insertOne(data);
        return newUser.insertedId;
    },
    auth: async (username, password) => {
        const users = getCollection('users');

        const user = await users.findOne({ username });
        if (!user) {
            throw Error('Invalid credentials');
        }
        
        if (user.status === 'Pending') {
            throw Error('Account hasn\'t been approved!');
        } else if (user.status === 'Denied') {
            throw Error('Account has been Denied! Please contact support.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw Error('Invalid credentials');
        }

        return user;

    }
}

// const Role = {
//     create: async (data) => {
//         const roles = await getCollection('roles');
//         const status = validateRecord(roles, {'name': data.name});

//         if (!status) {
//             const newRole = await roles.insertOne(data);
//             return newRole.insertedId;
//         }
//     },
//     findBy: async(filter = {}) => {
//         const roles = await getCollection('roles');
//         const role = await roles.find(filter).toArray();
//         return role;
//     }
// }

// const Menu = {
//     create: async (data) => {
//         const menus = await getCollection('menus');
//         const status = await validateRecord(menus, {'name': data.name});

//         if (!status) {
//             const newMenu = await menus.insertOne(data);
//             return newMenu.insertedId;
//         }
//     },
//     findBy: async(filter = {}) => {
//         const menus = await getCollection('menus');
//         const menu = await menus.find(filter).toArray();
//         return menu;
//     }
// }

// const Course = {
//     create: async (data) => {
//         const courses = await getCollection('courses');
//         const status = await validateRecord(courses, {'name': data.name});

//         if (!status) {
//             const newCourse = await courses.insertOne(data);
//             return newCourse.insertedId;
//         }
//     },
//     createMany: async (data) => {
//         const courses = await getCollection('courses');
//         const newCourses = await courses.insertMany(data);
//         return newCourses.insertedIds;
//     },
//     findBy: async(filter = {}) => {
//         const courses = await getCollection('courses');
//         const course = await courses.find(filter).toArray();
//         return course;
//     }
// }

// const Notification = {
//     create: async (data) => {
//         const notifications = await getCollection('notifications');
//         const status = await validateRecord(notifications, {'reference': data.reference});

//         if (!status) {
//             const newNotification = await notifications.insertOne(data);
//             return newNotification.insertedId;
//         }
//     },
//     findBy: async (filter = {}) => {
//         const notifications = await getCollection('notifications');

//         if (Object.keys(filter).includes('_id')) {
//             filter._id = new ObjectId(filter._id);
//         }

//         const notification = await notifications.find(filter).toArray();
//         return notification;
//     },
//     update: async (data) => {
//         const notifications = await getCollection('notifications');
//         const notiID = new ObjectId(data._id);
//         delete data._id;
//         const updateNoti = await notifications.updateOne({ _id: notiID}, { $set: data});
//         return updateNoti ? true : false;
//     }
// }

// const UserCourse = {
//     create: async (data) => {
//         const usercourses = getCollection('usercourses');
//         const usercourse = await usercourses.insertOne(data);
//         return usercourse.insertedId;
//     },
//     findBy: async (filter = {}) => {
//         const usercourses = getCollection('usercourses');
//         const usercourse = await usercourses.find(filter).toArray();
//         return usercourse;
//     },
//     deleteBy: async (filter) => {
//         const usercourses = getCollection('usercourses');
//         const removedRecord = usercourses.deleteMany(filter);
//         return removedRecord.deletedCount;
//     }
// }

module.exports = {
    connectDB,
    User,
    createRecord,
    createManyRecords,
    findRecord,
    updateRecord,
    deleteRecord
}