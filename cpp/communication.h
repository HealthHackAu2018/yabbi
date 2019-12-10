#ifndef yabbi_communication_h
#define yabbi_communication_h
#include <boost/beast/core.hpp>
#include <string>
#include <bitset>

template<typename U>
void sendMessageStr(const std::string& msg, U& ws);

template<typename T, typename U>
void sendMessage(const T& protoData, U& ws);

template <typename T, typename U>
void receiveMessage(T& protoData, U& ws);

template<typename T, typename U>
void sendMessage(const T& protoData, U& ws) {
	std::string msg;
//	protoData.SerializeToString(&msg);
	std::stringstream sstream;
	protoData.SerializeToOstream(&sstream);
	sendMessageStr(sstream.str(), ws);
//	std::cout << "Sent: " << msg << std::endl;

}
	
template<typename U>
void sendMessageStr(const std::string& msg, U& ws) {
	ws.write(boost::asio::buffer(std::string(msg)));
}

template <typename T, typename U>
void receiveMessage(T& protoData, U& ws) {
	boost::beast::multi_buffer buffer;
	ws.read(buffer);
	std::string stream = boost::beast::buffers_to_string(buffer.data());
	protoData.ParseFromString(stream);
	//std::cout << "Received: " << std::hex << (int)stream.c_str() << std::endl;
}

#endif
