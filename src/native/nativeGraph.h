#pragma once

#include <napi.h>
#include <map>

using Object3D = std::map<std::string, std::map<std::string, int>>;
using Object2D = std::map<std::string, std::string>;

class NativeGraph : public Napi::ObjectWrap<NativeGraph> {
 public:
  NativeGraph(const Napi::CallbackInfo&);
  Napi::Value dijkstra(const Napi::CallbackInfo&);

 private:
  Object3D _graph;
  Object2D _timetableStationMap;
  Object3D _heuristicMap;
};
