#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/json.hpp>
#include <boost/url.hpp>
#include <boost/url/params_view.hpp>
namespace beast = boost::beast;
namespace http = beast::http;
using namespace boost::urls;
namespace APIHandlers {
boost::json::value test(http::request<http::string_body> req, params_view params);
}