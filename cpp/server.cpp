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
// Example: WebSocket server, synchronous
//
//------------------------------------------------------------------------------

#include <boost/beast/core.hpp>
#include <boost/beast/websocket.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <cstdlib>
#include <functional>
#include <iostream>
#include <string>
#include <thread>
#include "yabbi.pb.h"
#include "communication.h"
#include "ceinms/concurrency/Queue.h"
#include "ceinms/concurrency/Latch.h"
#include <vector>
#include "csv.h"

using tcp = boost::asio::ip::tcp;               // from <boost/asio/ip/tcp.hpp>
namespace websocket = boost::beast::websocket;  // from <boost/beast/websocket.hpp>

struct PointCloud {
	double time;
	std::vector<double> x, y, z, w;
};

ceinms::Concurrency::Queue<PointCloud> strainsQueue;

template <class Container>
void split(const std::string& str, Container& cont, char delim = ' ')
{
	std::stringstream ss(str);
	std::string token;
	while (std::getline(ss, token, delim)) {
		cont.push_back(std::stod(token));
	}
}

class PointCloutInputConnector {
private:
	std::vector<double> x_, y_, z_;
	std::vector<std::vector<double>> strains_;
	double time_, interval_;
	int counter_;

public:
	PointCloutInputConnector(std::string coordinatesFilename, std::string strainsFilename) :
	time_(0.25), interval_(10), counter_(0) {
		io::CSVReader<3> points(coordinatesFilename);
		double x, y, z;
		while (points.read_row(x, y, z)) {
			x_.push_back(x);
			y_.push_back(y);
			z_.push_back(z);
		}

		io::LineReader inStrains(strainsFilename);
		while (char* line = inStrains.next_line()) {
			std::vector<double> currentStrains;
			split(line, currentStrains, ',');
			strains_.push_back(currentStrains);
		}
	}

	void operator()() {
	
		for (int i(0); i <10000; ++i) {
			PointCloud pc;
			pc.time = time_;
			pc.x = x_;
			pc.y = y_;
			pc.z = z_;
			pc.w = strains_[counter_];

			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(interval_)));
			strainsQueue.push(pc);
			counter_ = ++counter_ % pc.x.size();
			time_ += interval_;
		}
	};
};




//------------------------------------------------------------------------------

void printDataFrameSet(const yabbi::DataFrameSet& dataFrameSet) {

	std::cout << "size: " << dataFrameSet.dataframe_size() << std::endl;
	for (auto &d : dataFrameSet.dataframe()) {
		std::cout << "channelName: " << d.channelname() << "\n";
		std::cout << "       time: " << d.time() << "\n";
		std::cout << "data.size(): " << d.data().size() << "\n";
//		std::cout << "       data: [";
//		for (auto &data : d.data())
//			std::cout << data << " ";
//		std::cout << "]" << std::endl;
	}

}

void getAvailableChannels(std::vector<std::string>& names, std::vector<int>& dims) {

//	names.push_back("Ch1");
	names.push_back("nodes_x");
	names.push_back("nodes_y");
	names.push_back("nodes_z");
	names.push_back("nodes_w");

//	names.push_back("Ch2");
//	names.push_back("Ch3");

//	dims.push_back(1);
	dims.push_back(2048);
	dims.push_back(2048);
	dims.push_back(2048);
	dims.push_back(2048);

	//dims.push_back(2);
	//dims.push_back(3);
}

void fillDataFrame(const std::vector<double>& in, yabbi::DataFrame* out) {
	for (auto& e : in)
		out->add_data(e);
}


yabbi::DataFrameSet getDataFrameSet() {
	auto pc(strainsQueue.pop());
	yabbi::DataFrameSet dataFrameSet;
	yabbi::DataFrame* currentDataFrame = dataFrameSet.add_dataframe();
	fillDataFrame(pc.x, currentDataFrame);
	currentDataFrame->set_channelname("nodes_x");
	currentDataFrame->set_time(pc.time);

	currentDataFrame = dataFrameSet.add_dataframe();
	fillDataFrame(pc.y, currentDataFrame);
	currentDataFrame->set_channelname("nodes_y");
	currentDataFrame->set_time(pc.time);

	currentDataFrame = dataFrameSet.add_dataframe();
	fillDataFrame(pc.z, currentDataFrame);
	currentDataFrame->set_channelname("nodes_z");
	currentDataFrame->set_time(pc.time);

	currentDataFrame = dataFrameSet.add_dataframe();
	fillDataFrame(pc.w, currentDataFrame);
	currentDataFrame->set_channelname("nodes_w");
	currentDataFrame->set_time(pc.time);

	std::this_thread::sleep_for(std::chrono::milliseconds(5));
	return dataFrameSet;
}

yabbi::DataFrame _bak_getDataFrame(float time, int channelNumber) {

	std::cout << time << std::endl;
	yabbi::DataFrame frame;
	frame.set_time(time);
	float frequency = static_cast<float>(channelNumber) +1;
	for (int i(0); i < channelNumber; ++i) {
		float val = std::sin(2 * 3.14*frequency*time*3. + i/3.);
		frame.add_data(val);
	}
	frame.set_channelname("Ch" + std::to_string(channelNumber));
	return frame;
}

yabbi::DataFrameSet _bak_getDataFrameSet() {
	static float Time = 0;
	std::vector<std::string> names;
	std::vector<int> dims;
	getAvailableChannels(names, dims);
	yabbi::DataFrameSet dataFrameSet;
	for (int i(0); i < dims.size(); ++i) {
		auto dataFrame = _bak_getDataFrame(Time, i+1);
		yabbi::DataFrame* currenDataFrame = dataFrameSet.add_dataframe();
		currenDataFrame->mutable_data()->CopyFrom(dataFrame.data());
		currenDataFrame->set_channelname(dataFrame.channelname());
		currenDataFrame->set_time(dataFrame.time());
	}
	Time += 0.01f;
	std::this_thread::sleep_for(std::chrono::milliseconds(10));
	return dataFrameSet;
}

// Echoes back all received WebSocket messages
void
do_session(tcp::socket& socket)
{
	strainsQueue.subscribe();
	try
	{
		// Construct the stream by moving in the socket
		websocket::stream<tcp::socket> ws{ std::move(socket) };

		// Accept the websocket handshake
		ws.accept();
		ws.text(false);
		std::cout << "Handshake accepted" << std::endl;
		// This buffer will hold the incoming message
		for (;;)
		{

			// Read a message
			yabbi::ClientRequest clientRequest;
			receiveMessage(clientRequest, ws);
		
			switch(clientRequest.request()) {
				case yabbi::ClientRequest_Request::ClientRequest_Request_CHANNELS:
				{
					std::cout << "Requesting channels" << std::endl;
					std::vector<std::string> names;
					std::vector<int> dims;
					getAvailableChannels(names, dims);
					yabbi::AvailableChannels availableChannels;
					for (int i(0); i < names.size(); ++i) {
						availableChannels.add_dim(dims[i]);
						availableChannels.add_names(names[i]);
					}
					availableChannels.set_nchannels(names.size());
					sendMessage(availableChannels, ws);
					break;
				}
				case yabbi::ClientRequest_Request::ClientRequest_Request_DATA:
				{	
					std::cout << "Requesting data" << std::endl;
					int n = clientRequest.nframes();
					for (int i(0); i < n; ++i) {
						auto dataFrameSet = getDataFrameSet();
				//		printDataFrameSet(dataFrameSet);
						std::cout << "." << std::flush;
						sendMessage(dataFrameSet, ws);
						
					}
					break;
				}
			}
			std::cout << "Done" << std::endl;
		}
	}
	catch (boost::system::system_error const& se)
	{
		// This indicates that the session was closed
		if (se.code() != websocket::error::closed)
			std::cerr << "Error: " << se.code().message() << std::endl;
	}
	catch (std::exception const& e)
	{
		std::cerr << "Error: " << e.what() << std::endl;
	}
	strainsQueue.unsubscribe();

}

//------------------------------------------------------------------------------

int main(int argc, char* argv[])
{
	try
	{
		// Check command line arguments.
		if (argc != 3)
		{
			std::cerr <<
				"Usage: server <address> <port>\n" <<
				"Example:\n" <<
				"    websocket-server-sync 0.0.0.0 8080\n";
			return EXIT_FAILURE;
		}
		std::string baseDir = "C:\\Users\\s2849511\\coding\\versioning\\yabbiv2\\data\\";
		std::string nodesFilename = baseDir + "nodes.csv";
		std::string strainsFilename = baseDir + "strains.csv";
		PointCloutInputConnector pcReader(nodesFilename, strainsFilename);

		std::thread prod(std::ref(pcReader));

		auto const address = boost::asio::ip::make_address(argv[1]);
		auto const port = static_cast<unsigned short>(std::atoi(argv[2]));

		// The io_context is required for all I/O
		boost::asio::io_context ioc{ 1 };

		// The acceptor receives incoming connections
		tcp::acceptor acceptor{ ioc, {address, port} };
		for (;;)
		{
			// This will receive the new connection
			tcp::socket socket{ ioc };

			// Block until we get a connection
			acceptor.accept(socket);
			std::cout << "Connection accepted" << std::endl;
			// Launch the session, transferring ownership of the socket
			std::thread{ std::bind(
				&do_session,
				std::move(socket)) }.detach();
		}
		prod.join();
	}
	catch (const std::exception& e)
	{
		std::cerr << "Error: " << e.what() << std::endl;
		return EXIT_FAILURE;
	}
}