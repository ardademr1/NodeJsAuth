
module.exports.index = function(req,res){
    res.render("login");
}
module.exports.login_post = (req,res)=>{
    const {email, password}=req.body;
    console.log(email,password);
    res.render("login");
}