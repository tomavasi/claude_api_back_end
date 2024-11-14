import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import dbUserService from "../services/dbUserService";
import { jwtVerifier } from "../middleware/jwtVerifier";

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) {
            res.status(400).json({
                success: false,
                msg: "Not all fields have been entered."
            });
        }
        const possibleUser = await dbUserService.getUserByEmail(email);
        if (!possibleUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            dbUserService.createUser(hashedPassword, email);
            res.status(201).send("User created");
        } else {
            res.status(409).json({ msg: "An account with this email already exists." });
        }

    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message });
    }
})

router.get('/all', jwtVerifier, async (req, res,) => {
    try {
        const users = await dbUserService.getAllUsers();
        if (!users?.length) {
            res.status(400).json({ message: "Users not found" })
        }
        res.status(200).json(users);
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message });
    }
})

export { router as userRouter };  
