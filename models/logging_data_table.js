var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB');
// var content_schema = {
//   "appIconImage": {
//     "type": "String"
//   },
//   "contentId": {
//     "type": "Number"
//   },
//   "cpName": {
//     "type": "String"
//   },
//   "deeplink": {
//     "type": "String"
//   },
//   "description": {
//     "type": "String"
//   },
//   "domain": {
//     "type": "String"
//   },
//   "goal": {
//     "type": "String"
//   },
//   "greetingMsg": {
//     "type": "String"
//   },
//   "inApp": {
//     "type": "Boolean"
//   },
//   "mActionButtons": {
//     "type": "Array"
//   },
//   "mDetailInfo": {
//     "type": "Array"
//   },
//   "mainImage": {
//     "type": "String"
//   },
//   "title": {
//     "type": "String"
//   },
//   "uiType": {
//     "type": "Number"
//   }
// }
// var content_data_schema = {
//   "content_data": {
//     "type": [
//       "content_schema"
//     ]
//   }
// }
// var level = {
//   "level1": {
//     "type": "String"
//   },
//   "level2": {
//     "type": "String"
//   }
// }
// var endNode = {
//   "mDomain": {
//       "type": "String"
//     },
//     "mType": {
//       "type": "String"
//     }
// }
var userSchema  = {}
// var userSchema  = {
//   content_data: {
//     type: [content_data_schema]
//   },
//   country_code: {
//     type: String
//   },
//   data_from_service: {
//     startTime: {
//       type: Date
//     },
//     startTimeInMillis: {
//       type: Number
//     },
//     UserContext: {
//       behavior: {
//         type: [
//           level
//         ]
//       },
//       occasion: {
//         type: Array
//       },
//       place: {
//         type: Array
//       }
//     },
//     Scenario: {
//       type: String
//     },
//     EndNode: {
//       type: [
//         endNode
//       ]
//     },
//     RequestedDomain: {
//       type: [
//         String
//       ]
//     },
//     ReasoningEnginePersonalizedInterests: {
//       type: Array
//     },
//     PersonalizedInterest: {
//       suggestion: {
//         type: [
//           Mixed
//         ]
//       }
//     },
//     SuggestionResponse: {
//       mSuggestions: {
//         type: [
//           Mixed
//         ]
//       }
//     },
//     result: {
//       type: String
//     },
//     endTime: {
//       type: Date
//     },
//     endTimeInMillis: {
//       type: Number
//     }
//   },
//   device_id: {
//     type: String
//   },
//   hint_data: {
//     type: [
//       hint_data
//     ]
//   },
//   logging_id: {
//     type: Number
//   },
//   time_of_request: {
//     type: Number
//   }
// };
//

module.exports = mongoose.model('logging_data_table',userSchema);
