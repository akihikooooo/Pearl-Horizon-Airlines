build:
	mkdir -p ./build

backend: build
	g++ -I "A:\Cache\boost\boost_1_89_0" main.cpp router.cpp api/test.cpp -o ./build/backend -std=c++17 -lws2_32 -lmswsock -pthread -B./build