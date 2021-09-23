rm -rf build/
tsc
node-gyp rebuild -C src/native
cp src/native/build/Release/addon.node build/native/addon.node
