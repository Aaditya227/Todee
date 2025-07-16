const validator = require("validator");


const validate = (data)=>{

    const mandatoryField = ['firstName','emailId','password'];

    const IsAllowed = mandatoryField.every((k)=> Object.keys(data).includes(k));     // Object.keys = Array ke ander keys ko Js
                                                                                     //               Object ke form me rakh dega.       

    if(!IsAllowed)
        throw new Error("Some Field Missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Weak Password");

    if(!validator.isAlpha(data.firstName))
        throw new Error("FirstName is Missing");

}

module.exports = validate;