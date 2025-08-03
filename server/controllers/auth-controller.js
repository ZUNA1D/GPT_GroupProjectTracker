import User from "../models/user.js";
import Verification from "../models/verification.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";
dotenv.config();

  
const registerUser = async (req, res) => {
    try{
        const { name, email, password } = req.body;


        const decision = await aj.protect(req, { email }); 
        console.log("Arcjet decision", decision.isDenied());

        if (decision.isDenied()) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid Email Address" }));
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        };    

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // todo send verification email

        const verificationToken = jwt.sign(
            { userId: newUser._id, purpose: 'email-verification' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        await Verification.create({
            userId: newUser._id,
            token: verificationToken,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
        });

        // sennd mail
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailBody = `
            <h1>Welcome to Our Service, ${name}!</h1>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
        `;
        const emailSubject = 'Email Verification';

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
            return res.status(500).json({ message: 'Failed to send verification email' });
        }


        res.status(201).json({
            message: 'User registered successfully. Verification email sent',
        });


    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'Invalid User or Password' });
        }

        if (!user.isEmailVerified) {
            const existingVerification = await Verification.findOne({ userId: user._id });

            if (existingVerification && existingVerification.expiresAt > new Date()) {
                return res.status(400).json({ message: 'Email not verified. Please check your email for verification link.' });
            }else {
                await Verification.findOneAndDelete(existingVerification._id);

                const verificationToken = jwt.sign(
                    { userId: user._id, purpose: 'email-verification' },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );
                await Verification.create({
                    userId: user._id,
                    token: verificationToken,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
                });

                // sennd mail
                const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
                const emailBody = `
                    <h1>Welcome back, ${user.name}!</h1>
                    <p> Please verify your email by clicking the link below:</p>
                    <a href="${verificationLink}">Verify Email</a>
                `;
                const emailSubject = 'Email Verification';

                const isEmailSent = await sendEmail(email, emailSubject, emailBody);

                if (!isEmailSent) {
                    return res.status(500).json({ message: 'Failed to send verification email' });
                }
            
            
                res.status(201).json({
                    message: 'Verification email sent',
                });


                };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid User or Password' });
        }

        const token = jwt.sign(
            { userId: user._id, purpose: 'login' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        user.lastLogin = new Date();
        await user.save();

        const userData = user.toObject();
        delete userData.password; // Remove password from user data
        res.status(200).json({
            message: 'Login successful',
            token,
            user : userData,
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const verifyEmail = async (req, res) => {
    try{
        const { token } = req.body;
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {userId, purpose} = payload;

        if (purpose !== 'email-verification') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const verification = await Verification.findOne({ userId, token });

        if(!verification) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isTokenExpired = verification.expiresAt < new Date();

        if (isTokenExpired) {
            return res.status(401).json({ message: 'Verification token has expired' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }
        user.isEmailVerified = true;
        await user.save();

        await Verification.findByIdAndDelete(verification._id);

        res.status(200).json({ message: 'Email verified successfully' });

        
    } catch (error) {
        console.error('Error in verification:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isEmailVerified) {
            return res.status(400).json({ message: 'Email not verified. Please verify your email first.' });
        }

        const existingVerification = await Verification.findOne({ userId: user._id });

        if (existingVerification && existingVerification.expiresAt > new Date()) {
            return res.status(400).json({ message: 'Password reset request already exists. Please check your email.' });
        }

        if (existingVerification && existingVerification.expiresAt <= new Date()) {
            await Verification.findByIdAndDelete(existingVerification._id);
        }

        const resetPasswordToken = jwt.sign(
            { userId: user._id, purpose: 'reset-password' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await Verification.create({
            userId: user._id,
            token: resetPasswordToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });

        const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
        const emailBody = `
            <h1>Password Reset Request</h1>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Please click the link below to reset your password:</p>
            <a href="${resetPasswordLink}">Reset Password</a>
        `;
        const emailSubject = 'Password Reset Request';
        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
            return res.status(500).json({ message: 'Failed to send password reset email' });
        }
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error in password reset request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
//     try {
//         const { token, newPassword, confirmPassword } = req.body;
//         const payload = jwt.verify(token, process.env.JWT_SECRET); 

//         if (!payload) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const { userId, purpose } = payload;
//         if (purpose !== 'reset-password') { // error may show
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const verification = await Verification.findOne({ userId, token });
//         if (!verification) {    
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         const isTokenExpired = verification.expiresAt < new Date();
//         if (isTokenExpired) {
//             return res.status(401).json({ message: 'Reset token has expired' });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         if (newPassword !== confirmPassword) {
//             return res.status(400).json({ message: 'Passwords do not match' });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);
//         user.password = hashedPassword; 
//         user.save();
//         await verification.findByIdAndDelete(verification._id);
//         res.status(200).json({ message: 'Password reset successfully' });


//     } catch (error) {
//         console.error('Error in resetting password:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = payload;

    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {registerUser, loginUser, verifyEmail, resetPasswordRequest, verifyResetPasswordTokenAndResetPassword};