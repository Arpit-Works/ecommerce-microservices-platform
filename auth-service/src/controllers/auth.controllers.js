import userSchema from "../models/user.models.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



export const signup = async(req, res) =>{

    try{
        const {name, email, password, role}  = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);

        const user  = await userSchema.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        res.status(201).json({message: "User created successfully", user});
    }
    catch(error){
        res.status(500).json({message: "Error signing up", error: error.message});
    }
}

export const login = async(req, res) =>{
    try {
        const {email, password} = req.body;

        const user = await userSchema.findOne({email});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid){
            return res.status(401).json({message: "Invalid password"});
        }

        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({message: "Login successful", token});
    }
    catch(error){
        res.status(500).json({message: "Error logging in", error: error.message});
    }
}
