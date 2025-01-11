const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Doctor = require('../models/Doctors');
const Patient = require('../models/Patients');
const { generateNonce, signatureVerification } = require('../utils/helper');

require('dotenv').config();

const getNonce = async (req, res, next) => {
    const headers = req.headers;

    try{
        const address = headers['x-address'];
        let user = await User.findById(address);
        if(!user){
            return res.status(404).json({
                message: 'user does not exist'
            });
        }

        if(!user.nonce){
            // Generate nonce first
            const nonce = generateNonce();
            user = await User.findByIdAndUpdate(address, { nonce: nonce}, { new: true });
        }

        return res.status(200).json({
            nonce: user.nonce,
            address
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const login = async (req, res, next) => {
    // 1. Fetch signature and address from body
    const body = req.body;
    try{
        const address = body.address;
        const signature = body.signature;

        // 2. fetch nonce from DB
        const user = await User.findById(address);
        if(!user){
            return res.status(404).json({
                message: 'user not found'
            });
        }
        const nonce = user.nonce;

        // 3. verify signature and nonce
        const isVerified = signatureVerification(address, nonce, signature);
        if(!isVerified){
            return res.status(403).json({
                message: 'verification failed'
            });
        }

        // 4. Generate JWT for user
        const token = jwt.sign({address, role}, process.env.SALT);
        let userData;
        if(user.role === 'doctor'){
            userData = await Doctor.findById(address);
        }
        else{
            userData = await Patient.findById(address);
        }

        // 5. Update nonce
        const newNonce = generateNonce();
        await User.findByIdAndUpdate(address, { nonce: newNonce});
        
        return res.status(200).json({
            accessToken: token,
            ...userData
        });
    }
    catch(error){
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

const signup = async (req, res, next) => {
    const body = req.body;

    try{
        const address = body.address;
        const first_name = body.firstName;
        const last_name = body.lastName;
        const role = body.role;
        const gender = body.gender;

        if(!address || !first_name || !last_name || !role || !gender){
            return res.status(400).json({
                message: 'bad request'
            });
        }

        const userData = {
            _id: address,
            role: role,
            nonce: generateNonce()
        }
        const user = new User(userData);
        await user.save();

        const moreData = {
            _id: address,
            first_name,
            last_name,
            gender,
        }

        if(role === 'doctor'){
            if(!body.degree){
                return res.status(400).json({
                    message: 'bad request'
                });
            }

            moreData['degree'] = body.degree;
            const doctor = new Doctor(moreData);
            await doctor.save();
        }
        else{
            if(!body.dob){
                return res.status(400).json({
                    message: 'bad request'
                });
            }

            moreData['dob'] = body.dob;
            const patient = new Patient(moreData);
            await patient.save();
        }

        return res.status(200).json({
            message: 'created',
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = { login, signup, getNonce };