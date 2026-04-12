#ifndef APIROUTER_HPP
#define APIROUTER_HPP
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/json.hpp>

namespace beast = boost::beast;
namespace http = beast::http;

namespace APIRouter {
    void setRoutes();
    boost::json::value route(http::request<http::string_body> req);
}

#endif