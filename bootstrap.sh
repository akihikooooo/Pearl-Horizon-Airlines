#!/bin/bash
curl https://archives.boost.io/release/1.89.0/source/boost_1_89_0.zip --output boost.zip
tar -xf boost.zip
cd boost_1_89_0
bootstrap.bat gcc
b2 toolset=gcc --without-mpi
b2 install toolset=gcc --without-mpi