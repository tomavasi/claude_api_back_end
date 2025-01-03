import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import dbUserService from "../services/dbUserService";
import { jwtVerifier } from "../middleware/jwtVerifier";
import emailChecker from "../utils/emailchecker";

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { password, email, username } = req.body;
        if (!password || !email || !username) {
            res.status(400).json({
                success: false,
                msg: "Not all fields have been entered."
            });
        }
        if (!emailChecker(email)) { // check if email is valid regex
            res.status(400).json({
                success: false,
                msg: "Invalid email."
            });
        }
        const possibleUser = await dbUserService.getUserByEmail(email);
        if (!possibleUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            dbUserService.createUser(hashedPassword, email, username);
            res.status(201).send("User created");
        } else {
            res.status(409).json({ msg: "An account with this email already exists." });
        }

    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message });
    }
})

router.get('/me', jwtVerifier, async (req, res) => {
    try {
        const user = await dbUserService.getUserByEmail(req.body.email);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({
            username: user.username,
            email: user.email
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message });
    }
})


router.get('/all', jwtVerifier, async (req, res,) => {
    try {
        const users = await dbUserService.getAllUsers();
        if (!users?.length) {
            res.status(400).json({ msg: "Users not found" })
        }
        res.status(200).json(users);
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message });
    }
})

export { router as userRouter };  
