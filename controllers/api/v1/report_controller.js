const Patient = require('../../../models/patient');
const Report = require('../../../models/report');
const Doctor = require('../../../models/doctor');
const Status = require('../../../models/status');



//fetch all reports for a given status code 

module.exports.reportByFiler = async function(req,res){
    try{
        //fetch all reports of req.param.status
        let status = await Status.findOne({code: req.params.status});
        if(!status){
            return res.json(500,{
                message: "Invalid status code, please try again"        
            });
        }
        let reports  =await Report
        .find({status: status},{_id:0,updatedAt:0,__v:0,createdAt:0})
        .sort('createdAt')
        .populate('status',{_id:0})
        .populate('doctor',{_id:0,username:0,password: 0,updatedAt:0,createdAt:0,__v:0})
        .populate('patient',{_id:0,updatedAt:0,createdAt:0,__v:0});
        return res.json(200,{reports: reports});
    }
    catch(err){
        console.log(err);
        return res.json(500,{
            message: "Error in fetching the reports!",        
        })
    }
}