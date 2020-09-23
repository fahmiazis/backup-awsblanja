// const jwt = require('jsonwebtoken')
// const responseStandard = require('../helpers/response')

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers

//   if (authorization && authorization.startsWith('Bearer ')) {
//     const token = authorization.slice(7, authorization.length)
//     try{
//         if(jwt.verify(token, 'KODERAHASIA')){
//             next()
//         }else{
//             return responseStandard(res, 'Unauthorized', {}, 401, false)
//         }
//         catch(err){
//             return responseStandard(res, err.message, {}, 500, false)
//         }
//     }else{
//         return responseStandard(res, 'Forbidden', {}, 403, false)
//     }
//  }
// }
