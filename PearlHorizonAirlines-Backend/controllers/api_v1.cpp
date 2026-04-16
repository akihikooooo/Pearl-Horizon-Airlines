#include "api_v1.h"

using namespace api;

// Add definition of your processing function here
void v1::healthcheck(const HttpRequestPtr& req,
                     std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}

void v1::search(const HttpRequestPtr& req,
                std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}
void v1::login(const HttpRequestPtr& req,
               std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}
void v1::signup(const HttpRequestPtr& req,
                std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}
void v1::book_flight(const HttpRequestPtr& req,
                     std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}
void v1::flight_details(const HttpRequestPtr& req,
                        std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}
void v1::flight_list(const HttpRequestPtr& req,
                     std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}
void v1::user(const HttpRequestPtr& req,
              std::function<void(const HttpResponsePtr&)>&& callback) {
    Json::Value ret;
    ret["message"] = "Not Implemented";
    auto resp = HttpResponse::newHttpJsonResponse(ret);
    resp->setStatusCode(k501NotImplemented);
    callback(resp);
}