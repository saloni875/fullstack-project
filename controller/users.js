const User = require("../models/user");

module.exports.rendeSingupForm =(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "successfully join wanderlust, WELCOME!");
            res.redirect("/listing");
        })   
    }catch(e){
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm  =(req,res) => {
    res.render("users/login.ejs");
}

module.exports.login =  async (req, res) => {
    req.flash("success", "Again welcome to wonderLust");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res, next) =>{
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "NOW you are logged out!");
        res.redirect("/listing");
    });
}

