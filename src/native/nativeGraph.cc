#include "nativeGraph.h"

#include <napi.h>

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

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[0].IsObject()) {
    Napi::TypeError::New(env, "Can't import graph")
        .ThrowAsJavaScriptException();
    return;
  }

  Napi::Object graph = info[0].As<Napi::Object>();
  importObject(graph, &this->_graph);
}

Napi::Value NativeGraph::test(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Number val = Napi::Number::New(
      env,
      this->_graph
          ["10:28@odpt.TrainTimetable:JR-East.ChuoSobuLocal.916B.Weekday"]
          ["10:31@odpt.TrainTimetable:JR-East.ChuoSobuLocal.916B.Weekday"]);
  return val;
}

class Node {
  std::string name;
  int cost;

 public:
  Node(std::string _name, int _cost) {
    name = _name;
    cost = _cost;
  }
  std::string getName() const { return name; }
  int getCost() const { return cost; }
};

class NodeComparator {
 public:
  int operator()(const Node& n1, const Node& n2) {
    return n1.getCost() > n2.getCost();
  }
};

Napi::Value NativeGraph::dijkstra(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() != 2) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
  }

  std::string from = info[0].As<Napi::String>().Utf8Value();
  std::string to = info[1].As<Napi::String>().Utf8Value();

  std::map<std::string, std::string> parentMap;
  std::map<std::string, int> costMap;
  std::priority_queue<Node, std::vector<Node>, NodeComparator> pq;

  parentMap[from] = "<END>";
  costMap[from] = 0;
  pq.push(Node(from, 0));

  bool found = false;
  while (!pq.empty()) {
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
        pq.push(Node(neighborKey, alt));
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
    tempPath.push_back(from);
    std::cout << "Found:" << tempPath.size() << " " << totalCost << std::endl;

    Napi::Array path = Napi::Array::New(env, tempPath.size());

    for (unsigned long i = 0; i < tempPath.size(); i++) {
      path.Set(i, Napi::String::New(env, tempPath[tempPath.size() - 1 - i]));
    }
    return path;
  } else {
    return Napi::Array::New(env);
  }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = Napi::ObjectWrap<NativeGraph>::DefineClass(
      env, "NativeGraph",
      {
          Napi::ObjectWrap<NativeGraph>::InstanceMethod("test",
                                                        &NativeGraph::test),
          Napi::ObjectWrap<NativeGraph>::InstanceMethod("dijkstra",
                                                        &NativeGraph::dijkstra),
      });

  exports.Set("NativeGraph", func);
  return exports;
}

NODE_API_MODULE(addon, Init)
