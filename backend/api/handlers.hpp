#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/json.hpp>

namespace beast = boost::beast;
namespace http = beast::http;

namespace APIHandlers {
boost::json::value test(http::request<http::string_body> req);
}