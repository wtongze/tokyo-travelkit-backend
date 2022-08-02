#pragma once

#include <napi.h>
#include <unordered_map>

using Object3D = std::unordered_map<std::string, std::unordered_map<std::string, int>>;
using Object2D = std::unordered_map<std::string, std::string>;

class NativeGraph : public Napi::ObjectWrap<NativeGraph> {
 public:
  NativeGraph(const Napi::CallbackInfo&);
  Napi::Value findPath(const Napi::CallbackInfo&);

 private:
  Object3D _graph;
  Object2D _timetableStationMap;
  Object3D _heuristicMap;
};
