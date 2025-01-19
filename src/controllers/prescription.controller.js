const Prescription = require('../models/Prescription');

const getAllPrescription = async (req, res, next) => {
    const headers = req.headers;
    const _id = headers['x-address'];
    const role = headers['x-role'];

    let prescriptions = [];
    try{
        if(role === 'doctor'){
            prescriptions = await Prescription.find({'doctor': { $eq: _id }, 'status': { $eq: 'pending'}}).sort({ updatedAt: 'desc'}).exec();
        }
        else{
            prescriptions = await Prescription.find({'patient': { $eq: _id}}).sort({ updatedAt: 'desc'}).exec();
        }
    
        return res.status(200).json({
            prescriptions
        });
    }
    catch(error){
        res.status(500).json({
            message: 'internal server error'
        });
    }
}

const createPrescription = async (req, res, next) => {
    const headers = req.headers;
    const role = headers['x-role'];
    const doctor = headers['x-address'];

    if(role !== 'doctor'){
        return res.status(403).json({
            message: 'patient not authorized to created prescription'
        });
    }

    try{
        const body = req.body;
        const patient = body.patient;
        const status = 'pending';

        const prescription = new Prescription({ doctor, patient, status });
        await prescription.save();
        return res.status(201).json({
            prescriptionId: prescription._id
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message: 'internal server error'
        });
    }
}

/*
    OPTIMIZATION: How would backend know that patient paid the amount on chain and then only calling this API
    We need an ownership check mechanism, a call to chain to check the current owner of this tokenId and then proceed
    with the updation of status
*/
const updatePrescription = async (req, res, next) => {
    const headers = req.headers;
    const role = headers['x-role'];
    const user = headers['x-address'];
    const id = headers['x-prescription-id'];

    try{
        if(!id){
            return res.status(404).json({
                message: 'prescription not found'
            });
        }

        const prescription = await Prescription.findById(id);

        // Only doctor & patient of the prescription should update it
        if(prescription.patient !== user && prescription.doctor !== user){
            return res.status(403).json({
                message: 'Forbidden'
            });
        }

        const body = req.body;
        const cost = body.cost;
        const tokenId = body.tokenId;
        const tokenURI = body.tokenURI;

        let data;
        if(role === 'doctor'){
            data = {cost, tokenId, tokenURI};
        }
        else{
            data = { status: 'paid' }
        }
        await Prescription.findByIdAndUpdate(id, data);
        return res.status(200).json({
            message: 'updated'
        });
    }
    catch(error){
        res.status(500).json({
            message: 'internal server error'
        });
    }
}


module.exports = { createPrescription, updatePrescription, getAllPrescription };
