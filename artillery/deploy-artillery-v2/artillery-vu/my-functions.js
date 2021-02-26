var myAfterResponseHandler = function(requestParams, response, context, ee, next){
  const checkExpetion = (process.env.CHECKEXPECT && process.env.CHECKEXPECT.toLowerCase() == 'true') ? true : false;
  if (checkExpetion && requestParams.expect && requestParams.expect.length > 0){
    const expection = requestParams.expect[0]
    if (expection.statusCode){
       if (response.statusCode == expection.statusCode){
        console.log('\x1b[33m%s\x1b[0m%s' ,'ok ', requestParams.url)
       } else {
        console.log('\x1b[31m%s\x1b[0m%s', 'failed! ', requestParams.url)
       }
    }
  }
  return next()
}

module.exports = {
  myAfterResponseHandler: myAfterResponseHandler
}