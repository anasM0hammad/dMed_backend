const User = require('../models/Users');
const Patient = require('../models/Patients');

const getPatient = async (req, res, next) => {
    const headers = req.headers;
    const role = headers['x-role'];

    try{
        if(role !== 'doctor'){
            return res.status(403).json({
                message: 'not allowed'
            });
        }
    
        const patientId = headers['x-patient-id'];
        if(!patientId){
            return res.status(400).json({
                message: 'patient id is missing'
            });
        }
    
        const user = await User.findById(patientId);
        if(!user){
            return res.status(404).json({
                message: 'patient not found'
            });
        }
    
        const patient = await Patient.findById(patientId);
        const data = {
            name: `${patient.first_name} ${patient.last_name}`,
            gender: patient.gender,
            dob: patient.dob
        }
        res.status(200).json(data);
    }
    catch(error){
        return res.status(500).json({
            message: 'server error'
        });
    }
}

module.exports = { getPatient };