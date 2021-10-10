#include "nativeGraph.h"

#include <napi.h>

#include <cstdlib>
#include <fstream>
#include <iostream>
#include <map>
#include <queue>

using Object3D = std::map<std::string, std::map<std::string, int>>;
using Object2D = std::map<std::string, std::string>;

void importObject(Napi::Object& obj, Object3D* targetMap) {
  Napi::Array parentKeys = obj.GetPropertyNames();
  for (size_t i = 0; i < parentKeys.Length(); i++) {
    std::string parentKey = parentKeys.Get(i).As<Napi::String>().Utf8Value();
    Napi::Array childKeys =
        obj.Get(parentKey).As<Napi::Object>().GetPropertyNames();
    for (size_t j = 0; j < childKeys.Length(); j++) {
      std::string childKey = childKeys.Get(j).As<Napi::String>().Utf8Value();
      int cost = obj.Get(parentKey)
                     .As<Napi::Object>()
                     .Get(childKey)
                     .As<Napi::Number>()
                     .Int32Value();
      (*targetMap)[parentKey][childKey] = cost;
    }
  }
}

void importObject(Napi::Object& obj, Object2D* targetMap) {
  Napi::Array keys = obj.GetPropertyNames();
  for (size_t i = 0; i < keys.Length(); i++) {
    std::string key = keys.Get(i).As<Napi::String>().Utf8Value();
    std::string val = obj.Get(key).As<Napi::String>().Utf8Value();
    (*targetMap)[key] = val;
  }
}

NativeGraph::NativeGraph(const Napi::CallbackInfo& info) : ObjectWrap(info) {
  Napi::Env env = info.Env();

  if (info.Length() != 3) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[0].IsString()) {
    Napi::TypeError::New(env, "Can't import graph")
        .ThrowAsJavaScriptException();
    return;
  }

  std::string graphPath = info[0].As<Napi::String>().Utf8Value();
  std::ifstream graph(graphPath);

  std::string from, to;
  int cost;

  while (graph >> from >> to >> cost) {
    this->_graph[from][to] = cost;
  }

  std::string timetableStationMapPath = info[1].As<Napi::String>().Utf8Value();
  std::ifstream timetableStationMap(timetableStationMapPath);

  std::string a, b;

  while (timetableStationMap >> a >> b) {
    this->_timetableStationMap[a] = b;
  }

  std::string heuristicMapPath = info[2].As<Napi::String>().Utf8Value();
  std::ifstream heuristicMap(heuristicMapPath);

  std::string c, d;
  int e;

  while (heuristicMap >> c >> d >> e) {
    this->_heuristicMap[c][d] = e;
  }
}

class Node {
  std::string name;
  int cost;
  int heuristic;

 public:
  Node(std::string _name, int _cost, int _heuristic) {
    name = _name;
    cost = _cost;
    heuristic = _heuristic;
  }
  std::string getName() const { return name; }
  int getCost() const { return cost; }
  int getHeuristic() const { return heuristic; }
};

class NodeComparator {
 public:
  int operator()(const Node& n1, const Node& n2) {
    return n1.getCost() + n1.getHeuristic() > n2.getCost() + n2.getHeuristic();
  }
};

int getTimeScore(std::string time) {
  int hour = std::stoi(time.substr(0, 2));
  int min = std::stoi(time.substr(3, 5));
  return hour * 60 + min + (hour < 4 ? 24 * 60 : 0);
}

Napi::Value NativeGraph::findPath(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() != 3) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
  }

  std::string from = info[0].As<Napi::String>().Utf8Value();
  std::string to = info[1].As<Napi::String>().Utf8Value();
  Napi::Object useOperator = info[2].As<Napi::Object>();

  std::string fromKey = from.substr(6);
  std::string toKey = to.starts_with("END@") ? to.substr(4) : to.substr(6);

  bool USE_HEURISTIC = false;
  if (this->_heuristicMap.contains(fromKey) &&
      this->_heuristicMap[fromKey].contains(toKey)) {
    USE_HEURISTIC = true;
  }

  std::map<std::string, std::string> parentMap;
  std::map<std::string, int> costMap;
  std::priority_queue<Node, std::vector<Node>, NodeComparator> pq;

  parentMap[from] = "<END>";
  costMap[from] = 0;
  pq.push(Node(from, 0, 0));

  bool found = false;
  int counter = 0;
  while (!pq.empty()) {
    counter++;
    // std::cout << counter << std::endl;

    // break if routing question is too hard.
    if (counter > 1000000) {
      found = false;
      break;
    }

    Node item = pq.top();
    pq.pop();

    if (item.getName() == to) {
      found = true;
      break;
    }

    for (auto neighbor : this->_graph[item.getName()]) {
      std::string neighborKey = neighbor.first;
      int alt = item.getCost() + neighbor.second;

      if (!costMap.contains(neighborKey) || alt < costMap[neighborKey]) {
        costMap[neighborKey] = alt;
        parentMap[neighborKey] = item.getName();

        int heuristic = 0;
        if (USE_HEURISTIC) {
          std::string heuristicKey;

          if (neighborKey.starts_with("END@")) {
            heuristicKey = neighborKey.substr(4);
          } else if (neighborKey.find("odpt.TrainTimetable") !=
                     std::string::npos) {
            heuristicKey = this->_timetableStationMap[neighborKey];
          } else {
            heuristicKey = neighborKey.substr(6);
          }

          if (this->_heuristicMap.contains(heuristicKey) &&
              this->_heuristicMap[heuristicKey].contains(toKey)) {
            heuristic = this->_heuristicMap[heuristicKey][toKey] / 800;
            if (item.getName().starts_with("START@")) {
              int fromTimeScore = getTimeScore(neighborKey.substr(0, 5));
              int targetTimeScore = getTimeScore(to.substr(0, 5)) - heuristic;
              heuristic += std::abs(fromTimeScore - targetTimeScore);
            }
          }
        }

        if (neighborKey.starts_with("START@") ||
            neighborKey.starts_with("END@")) {
          pq.push(Node(neighborKey, alt, heuristic));
        } else {
          size_t sep = neighborKey.find(":", neighborKey.find("@") + 1);
          std::string currOperator = neighborKey.substr(
              sep + 1, neighborKey.find(".", sep + 1) - sep - 1);

          if (useOperator.Get(currOperator).ToBoolean()) {
            pq.push(Node(neighborKey, alt, heuristic));
          }
        }
      }
    }
  }

  if (found) {
    int totalCost = costMap[to];
    std::vector<std::string> tempPath;
    tempPath.push_back(to);
    std::string key = to;
    while (parentMap[key] != "<END>") {
      tempPath.push_back(parentMap[key]);
      key = parentMap[key];
    }
    // std::cout << "Found: " << tempPath.size() << " " << totalCost << std::endl;

    Napi::Array path = Napi::Array::New(env, tempPath.size());
    Napi::Array ref = Napi::Array::New(env, tempPath.size());

    for (unsigned long i = 0; i < tempPath.size(); i++) {
      std::string node = tempPath[tempPath.size() - 1 - i];

      std::string refKey;
      if (node.starts_with("END@")) {
        refKey = node.substr(4);
      } else if (node.find("odpt.TrainTimetable") != std::string::npos) {
        refKey = this->_timetableStationMap[node];
      } else {
        refKey = node.substr(6);
      }

      path.Set(i, Napi::String::New(env, node));
      ref.Set(i, Napi::String::New(env, refKey));
    }

    Napi::Object result = Napi::Object::New(env);
    result.Set("path", path);
    result.Set("ref", ref);
    result.Set("cost", Napi::Number::New(env, totalCost));
    return result;
  } else {
    Napi::Object result = Napi::Object::New(env);
    result.Set("path", Napi::Array::New(env));
    result.Set("ref", Napi::Array::New(env));
    result.Set("cost", Napi::Number::New(env, -1));
    return result;
  }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = Napi::ObjectWrap<NativeGraph>::DefineClass(
      env, "NativeGraph",
      {
          Napi::ObjectWrap<NativeGraph>::InstanceMethod("findPath",
                                                        &NativeGraph::findPath),
      });

  exports.Set("NativeGraph", func);
  return exports;
}

NODE_API_MODULE(addon, Init)
