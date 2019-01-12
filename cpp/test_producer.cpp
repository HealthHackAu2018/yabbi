#include <iostream>
#include <string>
#include <thread>
#include "ceinms/concurrency/Queue.h"
#include "ceinms/concurrency/Latch.h"
#include <vector>
#include <sstream>
#include "csv.h"


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
		time_(0.25), interval_(0.005), counter_(0) {
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
			//strains have an extra data point that I want to remove
//			currentStrains.pop_back();
			strains_.push_back(currentStrains);
		}
	}

	void operator()() {

		int run(10);
		while (--run > 0) {
			PointCloud pc;
			pc.time = time_;
			pc.x = x_;
			pc.y = y_;
			pc.z = z_;
			pc.w = strains_[counter_];

			std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(interval_*1000.)));
			strainsQueue.push(pc);
			counter_ = ++counter_ % pc.x.size();
			time_ += interval_;
		}
	};
};


int main() {
	std::string nodesFilename = "C:\\Users\\s2849511\\coding\\unversioned\\boostwebsockettest\\data\\nodes.csv";
	std::string strainsFilename = "C:\\Users\\s2849511\\coding\\unversioned\\boostwebsockettest\\data\\strains.csv";
	PointCloutInputConnector pcReader(nodesFilename, strainsFilename);

	auto consumerf = []() {
		strainsQueue.subscribe();
		for (;;) {
			auto frame(strainsQueue.pop());
			std::cout
				<< "    time: " << frame.time << "\n"
				<< "x.size(): " << frame.x.size() << "\n"
				<< "y.size(): " << frame.y.size() << "\n"
				<< "z.size(): " << frame.z.size() << "\n"
				<< "w.size(): " << frame.w.size() << std::endl;
		}
	};
	std::thread cons(consumerf);
	std::thread prod(std::ref(pcReader));
	prod.join();
	cons.join();
	return 0;
}
