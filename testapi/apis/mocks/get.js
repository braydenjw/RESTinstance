function(request, state, logger, callback) {

  const proxy = require(`${process.cwd()}/apis/mocks/proxy.js`);

  proxy.fetch_response(request, state, logger, response => {
    if (response.statusCode != 200 && response.statusCode != 201) {
      response = {
        statusCode: 404,
        body: { "error": "Not found" }
      }
    }
    else {
      var body = JSON.parse(response.body);
      if (Array.isArray(body)) {
        Object.keys(state.responses).forEach(key => {
          if (key.startsWith(request.path)) {
            var saved_response = state.responses[key];
            var saved_response_body = JSON.parse(saved_response.body)
            if (saved_response.statusCode == 200) {
              var item =  body.find(item => item.id === saved_response_body.id);
              var index = body.indexOf(item);
              body[index] = saved_response_body;
            }
            else if (saved_response.statusCode == 201) {
              body.push(saved_response_body);
            }
            else if (saved_response.statusCode == 204) {
              var item =  body.find(item => item.id === saved_response_body.id);
              var index = body.indexOf(item);
              if (index != -1) {
                body.splice(index, 1);
              }
            }
          }
        });
      }
      response = {
        statusCode: 200,
        body: body
      }
    }
    callback(response);
  });

}