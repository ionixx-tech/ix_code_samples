//validatio schema for user email and password authentication
const userLoginValidationSchema = {
    'email': {
        notEmpty: true,
        optional: false,
            isLength: {
            options: [
                {max: 255}
            ],
            errorMessage: 'Email Id should be less than 255 characters.'
        },
        isEmail:{
            errorMessage: 'Email Id is not valid'
        },
        errorMessage: 'Email should not be empty.'
    },
    'password': {
        notEmpty: true,
        optional: false,
        isLength: {
            options: [
                {min:4,max:15}
            ],
            errorMessage: 'password should be less than 15 characters.'
        },
        errorMessage: 'Password should not be empty.'
    }
}

export default userLoginValidationSchema;