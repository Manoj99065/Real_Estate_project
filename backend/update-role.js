import 'dotenv/config';
import { connectDB } from './config/db.js';
import User from './models/user.model.js';

const updateRole = async() => {
    await connectDB();
    const result = await User.updateOne({ email: 'manoj99065@gmail.com' }, { $set: { role: 'admin' } });
    console.log('✅ Updated:', result);
    process.exit();
};

updateRole();