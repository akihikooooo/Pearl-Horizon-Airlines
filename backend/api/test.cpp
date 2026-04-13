#include "handlers.hpp"

boost::json::value APIHandlers::test(http::request<http::string_body> req, params_view params) {

    boost::json::value response = {{"status", "success"}, {"message", "this is a test"}};
    for (auto param : params) {
        response.as_object().emplace(param.key, param.key);
    }
    return response;
}


