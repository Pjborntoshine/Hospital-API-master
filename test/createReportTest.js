//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Report = require('../models/report');
const Status = require('../models/status');
const jwt = require('jsonwebtoken'); 
const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../index');
const should = chai.should();
const baseUrl = 'http://localhost:8000';
let token = '';
chai.use(chaiHttp);

//Our parent block
describe('Patients', () => {
  try{
    beforeEach(async() => { 
      //Before each test we empty the database
      await Patient.remove({});
      await Doctor.remove({});
      await Report.remove({});
      // register a doctor and  to used for testing
      let doctor = {
        username: "test_doctor",
        password: "12345",
        name: "Dr. Test Doctor",
        department: "Test Department"
      }
      doctor= await Doctor.create(doctor);
      token = await jwt.sign( doctor.toObject(), 'random_string',{
        expiresIn: '2 days'
       });
    });
  }
  catch(err){
    console.log(err);
  }
  
    describe('/patients/:id/all_reports ', () => {    
        //Test 1
        try{
        it('it should not create a report if pateint id in url is not registered', async() => {
            let id  =  crypto.randomBytes(12).toString('hex');                
            let res =  await chai.request(baseUrl)
            .post(`/api/v1/patients/${id}/create_report`)
            .send({status: 0})
            .set({ "Authorization": `Bearer ${token}` });      
            res.should.have.status(500);
            res.body.should.have.property('message').includes("Error in finding patient");
          });

        }
        catch(err){
        console.log(err);
        }
        //Test 2
        try{
        it('it should not create a report if status code is missing', async() => {

            let patient =  new Patient({
                phone: "91021891121",
                name: "J.R.R. Tolkien",
                age: "40",
                sex: "female"
            });
            patient = await patient.save();    
            let res =  await chai.request(baseUrl)
            .post(`/api/v1/patients/${patient._id}/create_report`)
            .send({})
            .set({ "Authorization": `Bearer ${token}` });
            res.should.have.status(500);      
            res.body.should.have.property('message').includes("Invalid status code selected"); 
        });

        }
        catch(err){
        console.log(err);
        }
        //Test 3
        try{
            it('it should not create a report if status code is invalid', async() => {
    
                let patient =  new Patient({
                    phone: "91021891121",
                    name: "J.R.R. Tolkien",
                    age: "40",
                    sex: "female"
                });
                patient = await patient.save();    
                let status = 3+Math.floor((Math.random()*10));
                let res =  await chai.request(baseUrl)
                .post(`/api/v1/patients/${patient._id}/create_report`)
                .send({status: 5})
                .set({ "Authorization": `Bearer ${token}` });
                res.should.have.status(500);   
                res.body.should.have.property('message').includes("Invalid status code selected"); 
            });
    
            }
            catch(err){
            console.log(err);
            }

        //Test 4
        try{
            it('it should create a report successfully if status is valid and patient id is registered ', async() => {
    
                let patient =  new Patient({
                    phone: "91021891121",
                    name: "J.R.R. Tolkien",
                    age: "40",
                    sex: "female"
                });
                patient = await patient.save(); 
                let status = Math.floor(Math.random() * 4);
                let res =  await chai.request(baseUrl)
                .post(`/api/v1/patients/${patient._id}/create_report`)
                .send({status: status})
                .set({ "Authorization": `Bearer ${token}` });      
                res.should.have.status(200);
                res.body.should.have.property('status');
                res.body.should.have.property('doctor');
                res.body.should.have.property('patient');
                res.body.should.have.property('Date');
            });
    
            }
            catch(err){
            console.log(err);
            }
    });
    

});
  