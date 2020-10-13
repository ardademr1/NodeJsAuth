let loginRouter=require("./loginRouter");
let registerRouter=require("./registerRouter");
let homeRouter=require("./homeRouter");


module.exports = function(app){
    app.use('/users',registerRouter);
    app.use('/users', loginRouter);
    app.use('/', homeRouter);
}