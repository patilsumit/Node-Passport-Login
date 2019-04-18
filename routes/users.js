const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');

//USer MOdel
const User=require('../models/User');
//Login Page
router.get('/login',(req,res) =>{
    res.render("login")
});

//Register Page
router.get('/register',(req,res) =>{
    res.render("register")
})

router.post('/register',(req,res) =>{
    // console.log(req.body);
    // res.send('Hello');

    const {name ,email,password,password2}=req.body;
    let errors=[];

    //Check Required Fillds
    if(!name || !email || !password || !password2){
       errors.push({msg:'Fill All The Fields'});
    }

    //Check Password Matched
    if(password !== password2){
       errors.push({msg:'Password Do Not Match'});
    }

    //Check Password Length
    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 Characters'});
    }

    if(errors.length > 0){
        res.render('register' ,{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        User.findOne({ email : email})
        .then(user => {
           if(user){
               //User Exits
               errors.push({msg :'Email is Already Registerd'});
               res.render('register' ,{
                errors,
                name,
                email,
                password,
                password2
            });
           }
           else{
               const newUser=new User({
                   name,
                   email,
                   password
               });
            //    console.log(newUser);
            //    res.send('Hello');

            //Hash Password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(user => {
                      req.flash(
                        'success_msg',
                        'You are now registered and can log in'
                      );
                      res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                });
              });
           }
        });
    }
})


// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });

module.exports=router;


