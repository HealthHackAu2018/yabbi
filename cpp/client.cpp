//
// Copyright (c) 2016-2017 Vinnie Falco (vinnie dot falco at gmail dot com)
//
// Distributed under the Boost Software License, Version 1.0. (See accompanying
// file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)
//
// Official repository: https://github.com/boostorg/beast
//

//------------------------------------------------------------------------------
//
// Example: WebSocket client, synchronous
//
//------------------------------------------------------------------------------

//[example_websocket_client

#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/connect.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <cstdlib>
#include <iostream>
#include <string>
#include "yabbi.pb.h"
#include "communication.h"


using tcp = boost::asio::ip::tcp;               // from <boost/asio/ip/tcp.hpp>
namespace websocket = boost::beast::websocket;  // from <boost/beast/websocket.hpp>




void printDataFrameSet(const yabbi::DataFrameSet& dataFrameSet) {

	std::cout << "size: " << dataFrameSet.dataframe_size() << std::endl;
	for (auto &d : dataFrameSet.dataframe()) {
		std::cout << "channelName: " << d.channelname() << "\n";
		std::cout << "       time: " << d.time() << "\n";
		std::cout << "       data: [";
		for (auto &data : d.data())
			std::cout << data << " ";
		std::cout << "]"<< std::endl;
	}

}




// Sends a WebSocket message and prints the response
int main(int argc, char** argv)
{
	try
	{
		// Check command line arguments.
		if (argc != 3)
		{
			std::cerr <<
				"Usage: websocket-client-sync <host> <port>\n" <<
				"Example:\n" <<
				"    websocket-client-sync echo.websocket.org 80\n";
			return EXIT_FAILURE;
		}
		auto const host = argv[1];
		auto const port = argv[2];

		// The io_context is required for all I/O
		boost::asio::io_context ioc;

		// These objects perform our I/O
		tcp::resolver resolver{ ioc };
		websocket::stream<tcp::socket> ws{ ioc };

		// Look up the domain name
		auto const results = resolver.resolve(host, port);

		// Make the connection on the IP address we get from a lookup
		boost::asio::connect(ws.next_layer(), results.begin(), results.end());

		// Perform the websocket handshake
		ws.handshake(host, "/");
		ws.text(false);
		yabbi::ClientRequest request;
		request.set_request(yabbi::ClientRequest_Request::ClientRequest_Request_CHANNELS);
		sendMessage(request, ws);
		
		yabbi::AvailableChannels availableChannels;
		receiveMessage(availableChannels, ws);
		for (int i(0); i < availableChannels.nchannels(); ++i) {
			std::cout << "Channel: " << i << "\n"
				<< "-- name: " << availableChannels.names()[i] << "\n"
				<< "--  dim: " << availableChannels.dim()[i] << std::endl ;
		}

		request.set_request(yabbi::ClientRequest_Request::ClientRequest_Request_DATA);
		request.set_nframes(10);
		sendMessage(request, ws);
		//now read 100 freames
		for (int i(0); i < 10; ++i) {
			yabbi::DataFrameSet dataFrameSet;
			receiveMessage(dataFrameSet, ws);
			printDataFrameSet(dataFrameSet);
		}


		// Close the WebSocket connection
		ws.close(websocket::close_code::normal);

		// If we get here then the connection is closed gracefully

	}
	catch (std::exception const& e)
	{
		std::cerr << "Error: " << e.what() << std::endl;
		return EXIT_FAILURE;
	}
	return EXIT_SUCCESS;
}

//]