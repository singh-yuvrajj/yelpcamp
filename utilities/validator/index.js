const errorClass = require('../error/errorClass')

module.exports = function(Schema){
    return (req,res,next)=>{

        const { error } =  Schema.validate(req.body);
        if(error){
            const { message } = error.details[0];
            throw new errorClass(400,message);
        }
        else next();
    }
}