//
// Copyright (c) 2016-2019 Vinnie Falco (vinnie dot falco at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//
// Official repository: https://github.com/boostorg/beast
//

#include <algorithm>
#include <boost/asio/dispatch.hpp>
#include <boost/asio/strand.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>
#include <boost/config.hpp>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <vector>

#include "router.hpp"
namespace beast = boost::beast;
namespace http = beast::http;
namespace net = boost::asio;
using tcp = boost::asio::ip::tcp;

std::string SERVER = "pearl-horizon-airlines-backend";

http::response<http::string_body> createResponse(boost::json::value response, http::status status, http::request<http::string_body> req) {
    std::string response_serialized = boost::json::serialize(response);
    http::response<http::string_body> res{status, req.version()};
    res.set(http::field::server, SERVER);
    res.set(http::field::content_type, "application/json");
    res.body() = response_serialized;
    res.content_length(response_serialized.size());
    res.keep_alive(req.keep_alive());
    res.prepare_payload();
    return res;
}
// Return a response for the given request.
// The concrete type of the response message (which depends on the request), is type-erased in message_generator.
template <class Body, class Allocator>
http::message_generator handle_request(
    beast::string_view doc_root,
    http::request<Body, http::basic_fields<Allocator>>&& req) {
    // Make sure we can handle the method
    if (req.method() != http::verb::get)  // warn: no post request support for now
        return createResponse({{"error", "Unknown HTTP Method"}}, http::status::bad_request, req);
    if (req.target().empty() || req.target()[0] != '/' || req.target().find("..") != beast::string_view::npos)
        return createResponse({{"error", "Illegal Request Target"}}, http::status::bad_request, req);

    boost::json::value apiReturn = APIRouter::route(req);

    if (apiReturn.is_null()) return createResponse({{"error", "No API Endpoint Found."}}, http::status::not_found, req);
    return createResponse(apiReturn, http::status::ok, req);
}

//------------------------------------------------------------------------------

// Report a failure
void fail(beast::error_code ec, char const* what) {
    std::cerr << what << ": " << ec.message() << "\n";
}

// Handles an HTTP server connection
class session : public std::enable_shared_from_this<session> {
    beast::tcp_stream stream_;
    beast::flat_buffer buffer_;
    std::shared_ptr<std::string const> doc_root_;
    http::request<http::string_body> req_;

   public:
    // Take ownership of the stream
    session(tcp::socket&& socket,
            std::shared_ptr<std::string const> const& doc_root)
        : stream_(std::move(socket)), doc_root_(doc_root) {}

    // Start the asynchronous operation
    void run() {
        // We need to be executing within a strand to perform async operations
        // on the I/O objects in this session. Although not strictly necessary
        // for single-threaded contexts, this example code is written to be
        // thread-safe by default.
        net::dispatch(
            stream_.get_executor(),
            beast::bind_front_handler(&session::do_read, shared_from_this()));
    }

    void do_read() {
        // Make the request empty before reading,
        // otherwise the operation behavior is undefined.
        req_ = {};
        std::cout << "Request Received" << std::endl;
        // Set the timeout.
        stream_.expires_after(std::chrono::seconds(30));  // bug: this shit is printing a timeout error, whether the request succeeded or not

        // Read a request
        http::async_read(
            stream_, buffer_, req_,
            beast::bind_front_handler(&session::on_read, shared_from_this()));
    }

    void on_read(beast::error_code ec, std::size_t bytes_transferred) {
        boost::ignore_unused(bytes_transferred);

        // This means they closed the connection
        if (ec == http::error::end_of_stream) return do_close();

        if (ec) return fail(ec, "read");

        // Send the response
        send_response(handle_request(*doc_root_, std::move(req_)));
    }

    void send_response(http::message_generator&& msg) {
        bool keep_alive = msg.keep_alive();

        // Write the response
        beast::async_write(
            stream_, std::move(msg),
            beast::bind_front_handler(&session::on_write, shared_from_this(),
                                      keep_alive));
    }

    void on_write(bool keep_alive, beast::error_code ec,
                  std::size_t bytes_transferred) {
        boost::ignore_unused(bytes_transferred);

        if (ec) return fail(ec, "write");

        if (!keep_alive) {
            // This means we should close the connection, usually because
            // the response indicated the "Connection: close" semantic.
            return do_close();
        }

        // Read another request
        do_read();
    }

    void do_close() {
        // Send a TCP shutdown
        beast::error_code ec;
        stream_.socket().shutdown(tcp::socket::shutdown_send, ec);

        // At this point the connection is closed gracefully
    }
};

//------------------------------------------------------------------------------

// Accepts incoming connections and launches the sessions
class listener : public std::enable_shared_from_this<listener> {
    net::io_context& ioc_;
    tcp::acceptor acceptor_;
    std::shared_ptr<std::string const> doc_root_;

   public:
    listener(net::io_context& ioc, tcp::endpoint endpoint, std::shared_ptr<std::string const> const& doc_root) : ioc_(ioc), acceptor_(net::make_strand(ioc)), doc_root_(doc_root) {
        beast::error_code ec;

        // Open the acceptor
        acceptor_.open(endpoint.protocol(), ec);
        if (ec) {
            fail(ec, "open");
            return;
        }

        // Allow address reuse
        acceptor_.set_option(net::socket_base::reuse_address(true), ec);
        if (ec) {
            fail(ec, "set_option");
            return;
        }

        // Bind to the server address
        acceptor_.bind(endpoint, ec);
        if (ec) {
            fail(ec, "bind");
            return;
        }

        // Start listening for connections
        acceptor_.listen(net::socket_base::max_listen_connections, ec);
        if (ec) {
            fail(ec, "listen");
            return;
        }
    }

    // Start accepting incoming connections
    void run() { do_accept(); }

   private:
    void do_accept() {
        // The new connection gets its own strand
        acceptor_.async_accept(net::make_strand(ioc_),
                               beast::bind_front_handler(&listener::on_accept,
                                                         shared_from_this()));
    }

    void on_accept(beast::error_code ec, tcp::socket socket) {
        if (ec) {
            fail(ec, "accept");
            return;  // To avoid infinite loop
        } else {
            // Create the session and run it
            std::make_shared<session>(std::move(socket), doc_root_)->run();
        }

        // Accept another connection
        do_accept();
    }
};

//------------------------------------------------------------------------------

int main(int argc, char* argv[]) {
    std::string DEFAULT_IP = "127.0.0.1";
    int DEFAULT_PORT = 8080;
    std::string ROOT_PATH = ".";  // bug: this shit is reliant on the cwd, maybe make it so that it's fixed kung nasan nakalagay yung binary
    int THREAD_COUNT = 1;

    auto const address = net::ip::make_address(DEFAULT_IP);
    auto const port = static_cast<unsigned short>(DEFAULT_PORT);
    auto const doc_root = std::make_shared<std::string>(ROOT_PATH);
    auto const threads = std::max<int>(1, THREAD_COUNT);

    // The io_context is required for all I/O
    net::io_context ioc{threads};

    // Create and launch a listening port
    std::make_shared<listener>(ioc, tcp::endpoint{address, port}, doc_root)->run();
    
    // setup Router 
    APIRouter::setRoutes();
    std::cout << "Pearl Horizon Airlines - Backend" << std::endl
              << "Running on " << DEFAULT_IP << ":" << DEFAULT_PORT << std::endl;

    // Run the I/O service on the requested number of threads
    std::vector<std::thread> v;
    v.reserve(threads - 1);
    for (auto i = threads - 1; i > 0; --i)
        v.emplace_back([&ioc] { ioc.run(); });
    ioc.run();

    return EXIT_SUCCESS;
}