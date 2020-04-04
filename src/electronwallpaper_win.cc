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

#include "./output.h"
#include <iostream>
#include <napi.h>
#include <sstream>
#include <string>
#include <system_error>
#include <tchar.h>
#include <vector>
#include <windows.h>

namespace electronwallpaper {
  // Message to Progman to spawn a WorkerW
  int WM_SPAWN_WORKER = 0x052C;

  struct WorkerWRef {
  public:
    HWND handle;
  };

  BOOL CALLBACK FindWorkerW(HWND hwnd, LPARAM param) {
    HWND shelldll = FindWindowEx(hwnd, nullptr, "SHELLDLL_DefView", nullptr);

    if (shelldll) {
      auto* workerRef = reinterpret_cast<WorkerWRef*>(param);
      workerRef->handle = FindWindowEx(nullptr, hwnd, "WorkerW", nullptr);
      return FALSE;
    }

    return TRUE;
  }

  bool SetWindowPos(unsigned char* handleBuffer, int x, int y, int width, int height) {
    LONG_PTR handle = *reinterpret_cast<LONG_PTR*>(handleBuffer);
    HWND hwnd = (HWND)(LONG_PTR)handle;
    return MoveWindow(hwnd, x, y, width, height, TRUE);
  }

  void AttachWindow(unsigned char* handleBuffer, Napi::Env env) {
    LONG_PTR handle = *reinterpret_cast<LONG_PTR*>(handleBuffer);
    HWND hwnd = (HWND)(LONG_PTR)handle;
    WorkerWRef workerRef{};

    HWND progman = FindWindow("Progman", nullptr);
    LRESULT result = SendMessageTimeout(progman, WM_SPAWN_WORKER, NULL, NULL, SMTO_NORMAL, 1000, nullptr);

    if (!result) {
      std::string lastError = std::system_category().message(GetLastError());
      electronwallpaper::Output::createError(env, "Unable to spawn new worker: " + lastError).ThrowAsJavaScriptException();
    }

    bool enumWindowsResult = EnumWindows(&FindWorkerW, reinterpret_cast<LPARAM>(&workerRef));
    if (!enumWindowsResult && workerRef.handle == nullptr) {
      std::string lastError = std::system_category().message(GetLastError());
      electronwallpaper::Output::createError(env, "Unable to find WorkerW: " + lastError).ThrowAsJavaScriptException();
    }

    // Update style of the Window we want to attach
    SetWindowLongPtr(hwnd, GWL_EXSTYLE, WS_EX_LAYERED);
    SetParent(hwnd, workerRef.handle);
  };

} // namespace electronwallpaper
