/*
 * Copyright 2018 Robin Andersson <me@robinwassen.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <iostream>
#include <sstream>
#include <string>
#include <napi.h>
#include "./electronwallpaper.h"
#include "./output.h"


void AttachWindowExport(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    electronwallpaper::Output::createError(env, "attachWindow expects one argument").ThrowAsJavaScriptException();
  } else if (!info[0].IsObject()) {
    electronwallpaper::Output::createError(env, "attachWindow expects first argument to be a window handle buffer").ThrowAsJavaScriptException();
  }

  unsigned char* windowHandleBuffer = info[0].As<Napi::Uint8Array>().Data();

  electronwallpaper::AttachWindow(windowHandleBuffer, env);
}

Napi::Boolean MoveWindow(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 4) {
    electronwallpaper::Output::createError(env, "attachWindow expects 5 arguments").ThrowAsJavaScriptException();
  } else if (!info[0].IsObject()) {
    electronwallpaper::Output::createError(env, "attachWindow expects first argument to be a window handle buffer").ThrowAsJavaScriptException();
  }
  unsigned char* windowHandleBuffer = info[0].As<Napi::Uint8Array>().Data();
  long x = info[1].As<Napi::Number>().Int32Value();
  long y = info[2].As<Napi::Number>().Int32Value();
  long width = info[3].As<Napi::Number>().Int32Value();
  long height = info[4].As<Napi::Number>().Int32Value();

  return Napi::Boolean::New(env, electronwallpaper::SetWindowPos(windowHandleBuffer, x, y, width, height));
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "attachWindow"), Napi::Function::New(env, AttachWindowExport));
  exports.Set(Napi::String::New(env, "moveWindow"), Napi::Function::New(env, MoveWindow));
  return exports;
}

NODE_API_MODULE(module_name, Init)
