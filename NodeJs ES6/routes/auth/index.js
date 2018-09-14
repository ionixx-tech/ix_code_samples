import express from 'express'
import authController from '../../controller/auth'
import utility from '../../services/utility'
import passport from 'passport'
import moment from 'moment'
import validationService from '../../services/validation'
import authenticationValidatorSchema from '../../validators/authenticationValidator'

var router = express.Router();

var authRouter = {
    login: (req, res, next) => {
        var response = {} ;
        validationService.validateRequestBody(req, authenticationValidatorSchema)
        .then((result) => {
            return authController.login(req.body.email,req.body.password)
        })
        .then((result) => {
            response = result;
            delete response.password;
            return authController.setUserTokenController(result)
        }).then((result)=>{
            response.token = result;
            return res.$end(response);
        })
        .catch((err) => {
            /* refine the error */
            utility.validateErrorMessage(err)
                .then((error) => {
                    return res.$end(error);
                });
        });
    },
    linkedinLogin: (req,res) => {
        if(req.user.status == 'success') {
            return authController.setUserTokenController(req.user)
            .then((result)=>{
                var response = req.user;
                delete response.status
                response.token = result;
                return res.$end(response);
             })
        } else {
            res.$end(req.user);
        }
    },
    facebookLogin: (req,res) => {
        if(req.user.status == 'success') {
            return authController.setUserTokenController(req.user)
            .then((result)=>{
                var response = req.user;
                delete response.status
                response.token = result;
                return res.$end(response);
             })
        } else {
            res.$end(req.user);
        }
    }
}


router.post('/login', authRouter.login);
router.post('/auth/linkedin',passport.authenticate('linkedin-token', {session: false}),authRouter.linkedinLogin);
router.post('/auth/facebook',passport.authenticate('facebook-token',{session: false}),authRouter.facebookLogin);

module.exports = router;


