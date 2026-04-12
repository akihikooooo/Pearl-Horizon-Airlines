#include "router.hpp"
#include "api/handlers.hpp"
#include <boost/json/src.hpp>

using namespace APIRouter;

struct RouterData { 
    std::string path;
    boost::json::value (*handler)(http::request<http::string_body>);
};
std::vector<RouterData> routes;

void APIRouter::setRoutes() {
    // FOR DEVS: PUT YOUR ROUTES HERE
    routes.push_back({"/test", APIHandlers::test});
}

boost::json::value APIRouter::route(http::request<http::string_body> req) {
    boost::json::value data;
    bool foundRoute = false;
    for (RouterData route : routes) {
        if (req.target() == route.path) {
            data = route.handler(req);
            break;
        }
    }
    return data;
}
