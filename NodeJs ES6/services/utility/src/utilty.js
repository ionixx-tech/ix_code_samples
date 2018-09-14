import moment_tz from 'moment-timezone'
import q from 'q'
import moment from 'moment'
import fs from 'fs'
import errorConstant from '../../../constant/errorconstant'
import commonConstant from '../../../constant/commonconstant'

export default class utilities {

    /**
     * To build response object
     * @param api_response_code {String}
     * @returns {User}
     */
    buildResponse(api_response_code,optional_msg='',setOptionalMsgOnly =false) {
        let message;
        if(!setOptionalMsgOnly){
            message= errorConstant.errorMessage[api_response_code];
        }else{
            message= optional_msg;
        }
    
        var response = {
            code: api_response_code,
            status: commonConstant.RESPONSE_TYPE_FAILURE,
            message: message
        };
        return response;
    }
    
    /**
     * To build validation error message
     * @param err {Object}
     * @returns {formattederr}
     */
    validateErrorMessage(err) {
        var deferred = q.defer();
    
        if(err.flag === 1){
            var userExceptionArray = {
                fieldSet: []
            };
            var i=1;
            Object.keys(err).forEach(function(key){
                if(key != 'flag'){
                    (userExceptionArray.fieldSet).push(err[key]);
                }
                if(i === Object.keys(err).length){
                    deferred.resolve(userExceptionArray);
                }
                i++;
            });
        }
        else{
            deferred.resolve(err);
        }
        return deferred.promise;
    }
    
    buildUpdateParam(keys,data){
        var updateParm = {};
        if(!isEmpty(data)){
            for (var i = 0, len = keys.length; i < len; i++) {
                if(!isEmpty(data[keys[i]])){
                    updateParm[keys[i]] = data[keys[i]];
                }
            }
        }
        return updateParm;
    }
    
    /**
     * Function to format date
     * @param date {Object}
     * @param date_format {String}
     * @returns {dateObject}
     */
    format_date(date, date_format) {
        return moment_tz(date, ['DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MMM-YY']).format(date_format);
    }
    
     /**
     * Function to format date
     * @param date {Object}
     * @param date_format {String}
     * @returns {dateObject}
     */
    format_datetime(date, date_format) {
        return moment_tz(date, ['DD-MM-YYYY HH:mm:ss', 'MM-DD-YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss']).format(date_format);
    }
    
     /**
     * Function to get current date
     * @returns {dateObject}
     */
    current_date() {
        return moment_tz(new Date()).format('YYYY-MM-DD');
    }
    
     /**
     * Function to get current date with time
     * @returns {dateObject}
     */
    current_datetime() {
        return moment_tz(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }

     /**
     * Function to get current datetime in particular format
     * @param changeFormat
     * @returns {dateObject}
     */
    current_datetime_format(changeFormat) {
        var format = 'YYYY-MM-DD HH:mm:ss';
        if(changeFormat){
            format = changeFormat
        }
        return moment_tz(new Date()).format(format);
    }
    
     /**
     * Function to find difference between two arrays
     * @param array1
     * @param array2
     * @returns {diff array}
     */
    array_diff(a1, a2) {
        var a = [], diff = [];
    
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
    
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            }
        }
    
        for (var k in a) {
            diff.push(k);
        }
    
        return diff;
    }
    
     /**
     * Function to check if object is empty
     * @param object
     * @returns {Boolean}
     */
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
    
     /**
     * Function to fill empty filter options
     * @param filterOptions {Object}
     * @returns {filterOptions}
     */
   fillEmptyFilterOptions(filterOptions) {
        if (filterOptions.offset == null || typeof filterOptions.offset == 'undefined' || !filterOptions.offset) {
            filterOptions.offset = 0
        } else {
            filterOptions.offset = parseInt(filterOptions.offset)
        }
        if (filterOptions.limit == null || typeof filterOptions.limit == 'undefined' || !filterOptions.limit || filterOptions.limit > commonConstants.API_CUSTOM_PARAM_MAX_PAGE_SIZE) {
            filterOptions.limit = commonConstants.API_CUSTOM_PARAM_MAX_PAGE_SIZE
        } else {
            filterOptions.limit = parseInt(filterOptions.limit)
        }
        if (filterOptions.sortkey == null || typeof filterOptions.sortkey == 'undefined' || !filterOptions.sortkey) {
            filterOptions.sortkey = 'name'
        }
        if (filterOptions.sortorder == null || typeof filterOptions.sortorder == 'undefined' || !filterOptions.sortorder) {
            filterOptions.sortorder = 'ASC'
        }
        if (filterOptions.searchkey == null || typeof filterOptions.searchkey == 'undefined' || !filterOptions.searchkey) {
            filterOptions.searchkey = ""
        }
        return filterOptions
    }
    
     /**
     * Function to check if strings are equal
     * @param string1 {String}
     * @param string2 {String}
     * @param ignorecase {Boolean}
     * @param useLocale {Boolean}
     * @returns {Boolean}
     */
    isEqual(string1, string2, ignoreCase, useLocale) {
        if (ignoreCase) {
            if (useLocale) {
                string1 = string1.toLocaleLowerCase();
                string2 = string2.toLocaleLowerCase();
            }
            else {
                string1 = string1.toLowerCase();
                string2 = string2.toLowerCase();
            }
        }
    
        return string1 === string2;
    }
    
    /**
     * Function to hash a password
     * @param password {String}
     * @returns {hashedpassword}
     */
    hashPassword(password) {
        return crypto.createHash('md5').update(password).digest("hex")
    }
    
     /**
     * Function to get current time_stamp
     * @returns {timestamp}
     */
    current_timestamp() {
        return Math.round(new Date().getTime()/1000);
    }
    
     /**
     * Function to add minutes to current time
     * @param minurte {Integer}
     * @returns {dateObject}
     */
    add_minute_current_datetime(minute) {
        var currentDate = new Date();
        var updatedDate = new Date(currentDate.getTime() + (minute * 60 * 1000));
        return moment_tz(updatedDate).format('YYYY-MM-DD HH:mm:ss');
    }
    
     /**
     * Function to format user session object
     * @param user {Object}
     * @returns {sessionObject}
     */
    getUserSessionObject(user) {
        return {
            user_id:parseInt(user.user_id),
            name:user.name,
            email:user.email
        }
    }
    
    /**
     * loads all the modules in a directory into an array
     * @param dir {String} path to directory to read
     * @returns {Array}
     */
    loadDirectoryModules(dir) {
        var modules = [];
        if(fs.existsSync(dir)) {
            var stats = fs.statSync(dir);
    
            if(stats.isFile()){
                modules.push(require(dir));
            }else{
                fs.readdirSync(dir).forEach(function (module) {
                    modules.push(require(dir + '/' + module));
                });
            }
    
        }
        console.log(modules);
        return modules;
    }
    
    // `condition` is a function that returns a boolean
    // `body` is a function that returns a promise
    // returns a promise for the completion of the loop
    promiseWhile(condition, body) {
        var done = q.defer();
    
        function loop() {
            // When the result of calling `condition` is no longer true, we are
            // done.
            if (!condition()) return done.resolve();
            // Use `when`, in case `body` does not return a promise.
            // When it completes loop again otherwise, if it fails, reject the
            // done promise
            q.when(body(), loop, done.reject);
        }
    
        // Start running the loop in the next tick so that this function is
        // completely async. It would be unexpected if `body` was called
        // synchronously the first time.
        q.nextTick(loop);
    
        // The promise
        return done.promise;
    }
}


