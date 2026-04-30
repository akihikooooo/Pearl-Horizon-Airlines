#pragma once

#include <drogon/HttpController.h>

using namespace drogon;

namespace api {
class v1 : public drogon::HttpController<v1> {
   public:
    METHOD_LIST_BEGIN
    // METHOD_ADD(v1::get, "/{2}/{1}", Get); // path is /api/v1/{arg2}/{arg1}
    // METHOD_ADD(v1::your_method_name, "/{1}/{2}/list", Get); // path is /api/v1/{arg1}/{arg2}/list
    // ADD_METHOD_TO(v1::your_method_name, "/absolute/path/{1}/{2}/list", Get); // path is /absolute/path/{arg1}/{arg2}/list
    METHOD_ADD(v1::healthcheck, "/healthcheck", Get);
    METHOD_ADD(v1::search, "/search", Get);
    METHOD_ADD(v1::login, "/user/login", Get);
    METHOD_ADD(v1::signup, "/user/signup", Get);
    METHOD_ADD(v1::book_flight, "/user/book", Get);
    METHOD_ADD(v1::flight_details, "/flight/detail", Get);
    METHOD_ADD(v1::flight_list, "/flight/list", Get);
    METHOD_ADD(v1::user, "/user", Get);
    METHOD_LIST_END

    void healthcheck(const HttpRequestPtr& req,
                     std::function<void(const HttpResponsePtr&)>&& callback);
    void search(const HttpRequestPtr& req,
                std::function<void(const HttpResponsePtr&)>&& callback);
    void login(const HttpRequestPtr& req,
               std::function<void(const HttpResponsePtr&)>&& callback);
    void signup(const HttpRequestPtr& req,
                std::function<void(const HttpResponsePtr&)>&& callback);
    void book_flight(const HttpRequestPtr& req,
                     std::function<void(const HttpResponsePtr&)>&& callback);
    void flight_details(const HttpRequestPtr& req,
                        std::function<void(const HttpResponsePtr&)>&& callback);
    void flight_list(const HttpRequestPtr& req,
                     std::function<void(const HttpResponsePtr&)>&& callback);
    void user(const HttpRequestPtr& req,
              std::function<void(const HttpResponsePtr&)>&& callback);
};
}  // namespace api
