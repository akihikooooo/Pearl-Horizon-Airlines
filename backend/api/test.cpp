#include "handlers.hpp"

boost::json::value APIHandlers::test(http::request<http::string_body> req) {
    return {{"status", "success"}, {"message", "this is a test"}};
}


