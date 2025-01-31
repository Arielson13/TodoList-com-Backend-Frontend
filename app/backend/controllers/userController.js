import userSchema from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await userSchema.findOne({ username });
        if(user) return res.status(400).json({ message: "O usuário ja existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new userSchema({ username, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: "Usuário registrado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userSchema.findOne({ username });
        if(!user) return res.status(400).json({ message: "Credenciais inválidas!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Credenciais inválidas!" });

        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.json({ token })
    } catch (error) {
        res.status(500).json({ message: "Erro no servidor" })
    }
}