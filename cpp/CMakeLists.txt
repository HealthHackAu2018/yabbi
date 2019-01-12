if(DEFINED ENV{VCPKG_ROOT} AND NOT DEFINED CMAKE_TOOLCHAIN_FILE)
  set(CMAKE_TOOLCHAIN_FILE $ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake
      CACHE STRING "")
endif()

project(boostwebsockettest)
cmake_minimum_required(VERSION 2.8)

set(Boost_USE_STATIC_LIBS   ON)
set(Boost_USE_MULTITHREADED ON)
find_package(Boost 1.66.0 REQUIRED COMPONENTS system date_time)
find_package(protobuf CONFIG REQUIRED)

set_source_files_properties(${Proto_SRC} ${Proto_HEADERS} PROPERTIES GENERATED TRUE)
protobuf_generate_cpp(Proto_SRC Proto_HEADERS yabbi.proto)
if(${CMAKE_VERBOSE_MAKEFILE})
	message(STATUS "Proto_SRC=${Proto_SRC}")
	message(STATUS "Proto_HEADERS=${Proto_HEADERS}")
endif()

add_subdirectory(libs)

set(GeneratedProtobuf_INCLUDE_DIRS ${CMAKE_CURRENT_BINARY_DIR}
    CACHE INTERNAL "Path to generated protobuf files.")
include_directories(${Boost_INCLUDE_DIRS} ${Protobuf_INCLUDE_DIRS} ${GeneratedProtobuf_INCLUDE_DIRS} ${Concurrency_INCLUDE_DIRS})

add_executable(server server.cpp communication.h ${Proto_SRC} ${Proto_HEADERS})
target_link_libraries(server ${Boost_LIBRARIES} protobuf::libprotoc protobuf::libprotobuf protobuf::libprotobuf-lite Concurrency)

add_executable(client client.cpp communication.h ${Proto_SRC} ${Proto_HEADERS})
target_link_libraries(client ${Boost_LIBRARIES} protobuf::libprotoc protobuf::libprotobuf protobuf::libprotobuf-lite)

add_executable(test_producer test_producer.cpp)
target_link_libraries(test_producer Concurrency)