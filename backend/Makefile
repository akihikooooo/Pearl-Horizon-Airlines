build:
	mkdir -p ./build

backend: build
	g++ *.cpp api/*.cpp -o ./build/backend -I/ucrt64/include -L/ucrt64/lib -lws2_32 -lmswsock -pthread -B./build