/**
 * User Model
 * @module model/user
 */

import q from 'q'
import errors from '../../../constant/errorconstant'

export default class user {
    
    /**
     * Find user by email
     * @param email {String}
     * @returns {User}
     */
    findByEmail (connection,email) {
        let deferred = q.defer();
        let authenticationSql = 'SELECT * from user where email = ? ';
        connection.queryRow(authenticationSql,[email], (err, row) => {
            if(err){
                deferred.reject(new errors.ServerError("Server Error Occured"));
            }
            else{
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
    
    /**
     * Find user by id
     * @param id {integer}
     * @returns {User}
     */
    findById (connection,id) {
        let deferred = q.defer();
        let authenticationSql = 'SELECT user_id,name,email from user where user_id = ? ';
        connection.queryRow(authenticationSql,[id],(err, row) => {
            if(err){
                deferred.reject(new errors.ServerError("Server Error Occured"));
            }
            else{
                deferred.resolve(row);
            }
        });
        return deferred.promise;
    }
}

