#include <iostream>
#include <drogon/drogon.h>
// #include <drogon/utils/logger.h>

int main() {
    //Set HTTP listener address and port
    drogon::app().addListener("192.168.1.5", 8080).setLogPath("./logs").setLogLevel(trantor::Logger::kInfo);
    std::cout << "Running Backend" << std::endl;
    //Load config file
    //drogon::app().loadConfigFile("../config.json");
    //drogon::app().loadConfigFile("../config.yaml");
    //Run HTTP framework,the method will block in the internal event loop
    drogon::app().run();
    return 0;
}