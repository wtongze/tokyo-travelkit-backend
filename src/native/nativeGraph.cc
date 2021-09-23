#include "nativeGraph.h"

#include <napi.h>

#include <iostream>
#include <map>

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

Napi::Value NativeGraph::Greet(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::Number val = Napi::Number::New(
      env,
      this->_graph
          ["10:28@odpt.TrainTimetable:JR-East.ChuoSobuLocal.916B.Weekday"]
          ["10:31@odpt.TrainTimetable:JR-East.ChuoSobuLocal.916B.Weekday"]);

  return val;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  Napi::Function func = Napi::ObjectWrap<NativeGraph>::DefineClass(
      env, "NativeGraph",
      {
          Napi::ObjectWrap<NativeGraph>::InstanceMethod("test",
                                                        &NativeGraph::Greet),
      });

  exports.Set("NativeGraph", func);
  return exports;
}

NODE_API_MODULE(addon, Init)
