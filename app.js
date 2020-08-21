const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/studentDB",{useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set("useCreateIndex",true);

const studentSchema = new mongoose.Schema({
    Firstname:String,
    Lastname:String,
    RollNo: String,
    Department: String
  });

const Student = new mongoose.model("Student",studentSchema);

app.get("/",function(req,res){
    Student.find(function(err,foundStudents){
    if(err)
    {
      res.send(err)
    }
    else
    {
      res.render("studentList",{listStudent: foundStudents});
    }

    });
});

app.get("/search",function(req,res){
    Student.find(function(err,foundStudents){
        if(err)
        {
          res.send(err)
        }
        else
        {
            res.render("search",{studentlist: foundStudents});
            
        }
    
        });
    
})






app.post("/search",function(req,res){

string = req.body.val.substr(1,req.body.val.length-2);
  Student.findOne({RollNo: string},function(err,foundStudent){
    if(err)
    {
      res.send(err);
    }
    else
    {
      console.log(foundStudent);
      res.render("studentPage",{cell:foundStudent})
    }
})



})




  
app.get("/create",function(req,res){
    res.render("student");
  });



app.post("/create",function(req,res){
    
    const newStudent = new Student({
        Firstname: req.body.firstname,
        Lastname: req.body.lastname,
        RollNo: req.body.rollno,
        Department: req.body.dept
    })

    newStudent.save();
    res.redirect("/");
 
 });

 app.post("/",function(req,res){
    if(req.body.delete!= undefined)
    { 
      Student.deleteOne({RollNo:req.body.delete},function(err){
         if(err)
         {
             console.log(err);
            
         }
         else
         {
             console.log("Succesfully deleted one item");
             res.redirect("/")
         }
      })
    }
    if(req.body.edit!=undefined)
    {  
        Student.findOne({RollNo: req.body.edit},function(err,foundStudent){
            if(err)
            {
              res.send(err);
            }
            else
            {
              res.render("edit",{editStudent: foundStudent});
            }
        })
    }
})

app.post("/edit",function(req,res){
    Student.findOne({RollNo:req.body.rollno},function(err,result){
        if(err)
        {
            console.log(err);
        }
        else
        {
           result.Firstname = req.body.firstname;
           result.Lastname = req.body.lastname;
           result.RollNo = req.body.rollnumber;
           result.Department = req.body.dept;
           result.save();
           console.log("edited");
           res.redirect("/");
        }

    })


})
    








app.listen(3000,function(){
    console.log("Server started on port 3000");
});











