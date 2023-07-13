const Doctor = require('../../../models/doctor');
const jwt = require('jsonwebtoken'); 



// Register a new Doctor
module.exports.register = async function(req,res){
    
    try{
        
        //check if username already exist
        let doctor =  await Doctor.findOne({username: req.body.username});
        if(doctor){
            return res.json(500,{
                message: "User already exist, Please proceed to login",        
            });
        }
        else{
            await Doctor.create(req.body);
            return res.json(200,{
                message: "New Doctor registered",        
            });
        }
        
    }
    catch(err){
        console.log(err);
        return res.json(500,{
            message: "Hello from the doctor/register ",        
        })
    }
    
}
//login a new doctor, sends jwt back to browser on successfull login 
module.exports.createSession = async function(req, res){
    try{
        let doctor = await Doctor.findOne({username: req.body.username},{});
        if(!doctor || doctor.password!= req.body.password){
            return res.json(422,{
                message: "Invalid username or password"
            });
        }
        return res.json(200,{
            message: 'Sign in successful, here is your token. Please keep it safe!',
            data:{
                token: jwt.sign( doctor.toObject(), 'random_string',{
                    expiresIn: '2 days'
                })
            }
        })
    }catch(err){
        console.log('********', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
    

}