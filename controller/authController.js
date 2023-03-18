
const { userModel } = require('../Config/dbconfig');
const Redis = require("ioredis");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'secretkey';
const authController = {};
const redis = new Redis({
    host: "127.0.0.1", // Địa chỉ Redis Server
    port: 6379, // Cổng Redis Server
});

if (redis.status === "connecting" || redis.status === "connected") {
    console.log("Redis Client is already connecting/connected");
} else {
    // Kết nối đến Redis Server
    redis.connect((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Redis connected");
        }
    });
}

authController.register = async (req, res) => {
    console.log("api register " + req.body)
    try {
        const { username, email, password, role } = req.body;
        // Kiểm tra email đã được đăng ký trước đó hay chưa
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email đã được đăng ký trước đó' });
        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 12);
        // Tạo tài khoản mới
        const result = await userModel.create({ username, email, password: hashedPassword, role });

        res.status(200).json({ message: 'Đăng ký thành công', result });
    }
    catch (err) {
        res.status(500).json({ message: 'Đăng ký thất bại' });
    }
}
// Đăng nhập

authController.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Tìm kiếm người dùng theo email
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
        }
        // Kiểm tra mật khẩu
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
        }

        // Tạo token
        // Tạo JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        const userRedis = await redis.get(user._id);
        if (userRedis) {
            // Xóa token cũ
            redis.del(user._id);
        }
        // Lưu token vào Redis
        redis.set(user._id, token, 'EX', 60 * 60);

        redis.quit();



        res.status(200).json({ token, userId: user._id, role: user.role });
    }
    catch (err) {
        res.status(500).json({ message: 'Đăng nhập thất bại' });
    }
}
// Xác thực JWT token
authController.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_SECRET);

        req.userData = { userId: decodedToken.userId, role: decodedToken.role };
        // Xác thực token dưới redis
        const userRedis = await redis.get(decodedToken.userId);
        if (userRedis !== token) {
            return res.status(401).json({ message: 'Xác thực thất bại' });
        }

        //check thời gian hết hạn của token trong redis
        const ttl = await redis.ttl(decodedToken.userId);
        if (ttl < 0) {
            return res.status(401).json({ message: 'Xác thực thất bại' });
        }
        else {
            // Gia hạn thời gian hết hạn của token trong redis

            redis.set(decodedToken.userId, token, 'EX', 60 * 60);
        }


        res.status(200).json({ message: 'Xác thực thành công' });
    }
    catch (err) {
        res.status(401).json({ message: 'Xác thực thất bại' });
    }
}


module.exports = authController;


