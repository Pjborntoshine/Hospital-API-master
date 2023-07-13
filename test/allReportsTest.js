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


// generates random number of  reports (max: 5), after each after a timeout passed
async function createReportwithTimeout(doctor,patient,timeout){
    //generates random number between 1 to 5
    let numReports =  Math.floor(Math.random() * 5)+1;
    for(let i=0;i<numReports;i++){
        //creates a report with random status after a random timeout
        await function runAfterTimout(){
            return new Promise( function(resolve, reject) {             
                setTimeout( resolve, timeout);
            }).then(
                    async function(){
                        let status = Math.floor(Math.random() * 4);
                        status = await Status.findOne({code: status});
                        let report = await Report.create({
                            status: status  ,
                            doctor: doctor,
                            patient: patient,
                            Date: new Date().toDateString(),
                            Time: new Date().toTimeString()
                        });
                    }
                );
        }(doctor,patient,timeout);
        
    }   
     
}


// generates random number of  reports (max: 5)
async function createReport(doctor, patient){
    //generates random number between 1 to 5
    let numReports =  Math.floor(Math.random() * 5)+1;    
    for(let i=0;i<numReports;i++){
        let status = Math.floor(Math.random() * 4);
        status = await Status.findOne({code: status});
        await Report.create({
            status: status  ,
            doctor: doctor,
            patient: patient,
            Date: new Date().toDateString(),
            Time: new Date().toTimeString()
        });
    }
}

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
  
    describe('/patients/:id/all_reports', (doctor) => {    
        //Test 1
        try{
        it('it should not return any reports if pateint id in url is not registered', async() => {
            let id  =  crypto.randomBytes(12).toString('hex');                    
            let res =  await chai.request(baseUrl)
            .get(`/api/v1/patients/${id}/all_reports`)            
            .set({ "Authorization": `Bearer ${token}` });      
            res.should.have.status(500);
            res.body.should.have.property('message').includes("Error in finding the patient");
        });

        }
        catch(err){
        console.log(err);
        }
        //Test 2
        try{
        it('it should return all the reports correspoding to the patient id in url', async() => {
            //register a patient 
            let patient =  new Patient({
                phone: "1234567890",
                name: "Test Patient 1",
                age: "36",
                sex: "male"
            });
            patient = await patient.save();             
            //create a random number of reports for pateint  (max 10)
            await createReport(doctor,patient);
            let numreportsfromDb = await (await Report.find({patient: patient})).length;            
            let res =  await chai.request(baseUrl)
             .get(`/api/v1/patients/${patient._id}/all_reports`)            
             .set({ "Authorization": `Bearer ${token}` });
            res.should.have.status(200);
            res.body.should.have.property('reports');
            res.body.reports.length.should.be.eql(numreportsfromDb);
            
        });

        }
        catch(err){
        console.log(err);
        }
        //Test 3
        try{
            it('it should have only return reports correspoding to the patient id in url', async() => {
                //register patient1 
                let patient1 =  new Patient({
                    phone: "1234567890",
                    name: "Test Patient 1",
                    age: "36",
                    sex: "male"
                });
                patient1 = await patient1.save();             
                //create a random number of reports for pateint 1 (max 10)
                await createReport(doctor,patient1);


                //register patient2
                let patient2 =  new Patient({
                    phone: "21218219901",
                    name: "Test Patient 2",
                    age: "50",
                    sex: "female"
                });
                patient2 = await patient2.save();             
                //create a random number of reports for pateint 1 (max 10)
                await createReport(doctor,patient2);
                         
                let res =  await chai.request(baseUrl)
                .get(`/api/v1/patients/${patient1._id}/all_reports`)            
                .set({ "Authorization": `Bearer ${token}` });
                res.should.have.status(200);
                res.body.should.have.property('reports');
                //check that patient id for all the reports in res is equal to patient1's id                
                for(report of res.body.reports){                   
                    let patient = await Patient.findOne({phone: report.patient.phone});
                    patient._id.should.be.eql(patient1._id);                    
                }
                
            });
    
            }
            catch(err){
            console.log(err);
            }

        //Test 4
        try{
            it('it should return reports in order oldest to newest', async() => {
    
               //register a patient 
            let patient =  new Patient({
                 phone: "1234567890",
                 name: "Test Patient 1",
                 age: "36",
                sex: "male"
            });
            patient = await patient.save();            
            
            //generates a random timeout between 1 to 1.5 sec
            let timeout = Math.random() * (500)+1000;
            // creates random number of reports(max:5) after timeout seconds
            await createReportwithTimeout(doctor,patient, timeout);
            let res =  await chai.request(baseUrl)
            .get(`/api/v1/patients/${patient._id}/all_reports`)            
            .set({ "Authorization": `Bearer ${token}` });
            res.should.have.status(200);
            res.body.should.have.property('reports');
            let prevDate = new Date(-8640000000000000);           
            for(report of res.body.reports){                
                let reportDate= new Date(report.createdAt);
                reportDate.should.be.gt(prevDate);
                prevDate = reportDate;
            }
        });
    
        }
        catch(err){
        console.log(err);
        }
    });
    

});
  