* Install vcpkg
```
> git clone https://github.com/Microsoft/vcpkg.git
> cd vcpkg

PS> .\bootstrap-vcpkg.bat
```
Create the environment variable `VCPKG_ROOT` equal to the vcpkg root directory containing the file `.vcpkg-root`

* Install boost 1.66 or greater
```
PS> .\vcpkg install boost
```

* Install google protobuf
```
PS> .\vcpkg install protobuf
```

* Run Cmake

* Build the project

* Compile the js library
```
.\protoc.exe --proto_path=C:\Users\s2
849511\coding\unversioned\boostwebsockettest --js_out=library=yabbi_lib,binary:c:\Users\s2849511\coding\unversioned\boos
twebsockettest\client C:\Users\s2849511\coding\unversioned\boostwebsockettest\yabbi.proto
```

or 

```
.\protoc.exe --proto_path=C:\Users\s2
849511\coding\unversioned\boostwebsockettest --js_out=import_style=commonjs,binary:c:\Users\s2849511\coding\unversioned\
boostwebsockettest\client C:\Users\s2849511\coding\unversioned\boostwebsockettest\yabbi.proto
```

Using pbf

```
pbf ../yabbi.proto --browser > yabbi.js
```
