import express from 'express';
import bcrypt from "bcrypt";
import dbUserService from '../services/dbUserService';
import tokenGenerator from '../tokens/tokenGenerator';
import emailChecker from '../utils/emailchecker';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ msg: "Not all fields have been entered." });
            return;
        }
        if (!emailChecker(email)) {
            res.status(400).json({ msg: "Invalid email." }); // check if email is valid regex
            return;
        }
        const user = await dbUserService.getUserByEmail(email);
        if (!user) {
            res.status(401).json({ msg: "No account with this email has been registered." });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ msg: "Invalid credentials." });
            return;
        }
        const accessToken = tokenGenerator.generateAccessToken(email);
        const refreshToken = tokenGenerator.generateRefreshToken(email);

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7 });
        res.status(200).json({
            accessToken,
            username: user.username,
            email: user.email,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message });
    }
})

router.get('/refresh', async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.refreshToken) {
            res.status(401).json({ msg: "Unauthorised." })
        } else {
            const refreshToken = cookies.refreshToken;
            const { err, decoded } = tokenGenerator.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            if (err) {
                res.status(403).json({ msg: "Forbidden." })
            } else {
                const user = await dbUserService.getUserByEmail(decoded.payload);
                if (!user) {
                    res.status(404).json({ msg: "User not found." })
                } else {
                    const accessToken = tokenGenerator.generateAccessToken(user.email);
                    res.status(200).json({ accessToken })
                }
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message });
    }
})

router.delete('/logout', async (req, res) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.status(204).json({ msg: "Logged out." });
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message });
    }
})

export { router as authRouter };