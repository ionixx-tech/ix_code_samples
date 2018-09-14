
/** app base directory */
import q from 'q'
import dbConnection from '../../mysql'
import passport from 'passport'
import local_passport from 'passport-local'
import linkedin_passport from 'passport-linkedin-token-oauth2'
import TokenGenerator from 'uuid-token-generator'
import utility from '../../utility'
import User from '../../../model/user'
import apiResponseConstant from '../../../constant/apiresponseconstant'
import commonConstant from '../../../constant/commonconstant'
import AuthToken from '../../../model/authtoken'
import FacebookTokenStrategy from 'passport-facebook-token'
import logger from '../../log'

const LinkedInStrategy = linkedin_passport.Strategy;
const LocalStrategy = local_passport.Strategy;
const tokenGenerator = new TokenGenerator(256, TokenGenerator.BASE62);

//Passport facebook strategy
passport.use(new FacebookTokenStrategy({
        clientID: 'YOUR_CLIENT_ID_HERE', //Replace
        clientSecret: 'YOUR_CLIENT_SECRET_HERE', //Replace
        profileFields: ['email','gender','displayName','name','short_name']
    },
    function (accessToken, refreshToken, profile, done) {
        dbConnection.getConnection(true,(err,connection) => {
            if(err) {
                logger.error(err);
                done(err);
            } else {
                AuthToken.checkUserExists(connection,profile)
                .then((res)=>{
                    res.status = "success" ;
                    connection.commit();
                    connection.release();
                    done(null,res);
                }) 
                .catch((err)=>{
                    connection.rollback();
                    connection.release();
                    done(null,err);
                })
            }
        })
}));

//Passport linkedin strategy
passport.use(new LinkedInStrategy({
    clientID: 'YOUR_CLIENT_ID_HERE', //Replace
    clientSecret: 'YOUR_CLIENT_SECRET_HERE', //Replace
    session:false
},
function (token, tokenSecret, profile, done) {
    dbConnection.getConnection(true,(err,connection) => {
        if(err) {
            logger.error(err);
            done(err);
        } else {
            profile._json.email = profile._json.emailAddress ;
            AuthToken.checkUserExists(connection,profile)
            .then((res)=>{
                res.status = "success" ;
                connection.commit();
                connection.release();
                done(null,res);
            }) 
            .catch((err)=>{
                connection.rollback();
                connection.release();
                done(null,err);
            })
        }
    })
}
));


export default class authService {

    /**
     * To generate access token for user
     * @param userId {Integer}
     * @param type {String}
     * @returns {token}
     */
    generateAccessToken(userId,type,payload) {
        let deferred = q.defer();
        type = (!type)? 'PASSWORD' : type;
        dbConnection.getConnection(true, (err, connection) => {
            if (err) {
                return done(null, false, {message: apiResponseConstant.UNKNOWN_ERROR_OCCURRED});
            } else {
                var token;
                var countA = 1;
                utility.promiseWhile(() => {
                    return countA != 0;
                }, function () {
                    token = tokenGenerator.generate();
                    var deferred = q.defer();
                    AuthToken.checkTokenExist(connection, token).then((count) => {
                        countA = count;
                        deferred.resolve();
                    })
                    return deferred.promise;
                }).then(() => {
                    const expiry_time = utility.add_minute_current_datetime(commonConstant.TOKEN_EXTEND_TIME);
                    return AuthToken.insert(connection,userId,token,type,expiry_time);
                }).then(() => {
                    connection.commit();
                    connection.release();
                    return deferred.resolve(token);
                }).catch((e) => {
                    connection.rollback();
                    connection.release();
                    deferred.reject(utility.buildResponse(apiResponseConstant.UNKNOWN_ERROR_OCCURRED));
                })
            }
        });
        return deferred.promise;
    }
}
