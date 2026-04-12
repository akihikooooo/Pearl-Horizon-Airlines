#include "router.hpp"
#include "api/handlers.hpp"
#include <boost/json/src.hpp>

// NOTE: this assumes ONLY json is returned
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

http::response<http::string_body> APIRouter::route(http::request<http::string_body> req) {
    boost::json::value data;
    bool foundRoute = false;
    for (RouterData route : routes) { // TODO: what to do when user accesses a path w/o a route?
        if (req.target() == route.path) {
            data = route.handler(req);
        }
    }
    std::string body = boost::json::serialize(data);

    // TODO: factory response

    http::response<http::string_body> res{http::status::ok, req.version()};
    res.set(http::field::server, "Pearl Horizon Airlines");
    res.set(http::field::content_type, "application/json");
    res.body() = body;
    res.content_length(body.size());
    res.keep_alive(req.keep_alive());
    return res;
}


