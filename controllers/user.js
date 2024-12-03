const User=require("../models/user.js");

module.exports.SignupForm=(req,res)=>{
    res.render("users/Sign-up.ejs")
   }
module.exports.Signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
            const newUser=new User({email,username});
            //passsport syntax
       const registeredUser=await User.register(newUser,password);
       req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust");
       res.redirect("/listings");
       });
 }
catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}}
module.exports.LoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.Login=async(req,res)=>{
    req.flash("success","Welcome back to WanderLust! You are logged in!");
    let redirectUrl=res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
}
module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
}