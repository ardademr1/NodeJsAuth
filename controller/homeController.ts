module.exports.index = function(req,res){
    res.render("index.ejs");
}
module.exports.dashboard = function(req,res){
    res.render("dashboard.ejs",{ user: "arda" });
}