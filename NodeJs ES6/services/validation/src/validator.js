import q from 'q'
import utility from '../../utility'
import apiResponseConstant from '../../../constant/apiresponseconstant'

export default class validationService {

    //validation sevice
    validateRequestBody (req, validationSchema, filterOptions = {}) {
        let deferred = q.defer();
        if (!utility.isEmpty(filterOptions)) {
            filterOptions = utility.fillEmptyFilterOptions(filterOptions)
            req.query['offset']=filterOptions.offset
            req.query['limit']=filterOptions.limit
            req.query['sortorder']=filterOptions.sortorder
            req.query['sortkey']=filterOptions.sortkey
            req.query['searchkey']=filterOptions.searchkey
        }
        req.check(validationSchema)
        req.getValidationResult()
        .then((res) => {
            if (res.isEmpty()) {
                deferred.resolve(req);
            } else {
                res = res.mapped();
                var response = {};
                response.code = apiResponseConstant.VALIDATION_ERROR;
                response.errorMessage = "Fields "+Object.keys(res).join(', ')+" are invalid";
                deferred.reject(response);
            }
        })
        .catch((err) => {
            deferred.reject(err);
        })
        return deferred.promise;
    }
}
