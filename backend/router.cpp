#include "router.hpp"

#include <boost/json/src.hpp>
#include "api/handlers.hpp"

using namespace APIRouter;
using namespace 
struct RouterData {
    std::string path;
    boost::json::value (*handler)(http::request<http::string_body>, params_view);
};

std::vector<RouterData> routes;

void APIRouter::setRoutes() {
    // FOR DEVS: PUT YOUR ROUTES HERE
    routes.push_back({"/test", APIHandlers::test});
}

boost::json::value APIRouter::route(http::request<http::string_body> req) {
    boost::json::value data;
    boost::url url = boost::url(std::string(req.target()));
    for (RouterData route : routes) {
        if (url.path() == route.path) {
            data = route.handler(req, url.params());
            break;
        }
    }
    return data;
}
