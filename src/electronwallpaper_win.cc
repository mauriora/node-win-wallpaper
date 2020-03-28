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

#include "./electronwallpaper.h"
#include "./output.h"
#include <napi.h>
#include <sstream>
#include <system_error>
#include <tchar.h>
#include <windows.h>

namespace electronwallpaper {
  // Message to Progman to spawn a WorkerW
  int WM_SPAWN_WORKER = 0x052C;

  struct WokerWRef {
  public:
    HWND handle;
  };

  BOOL CALLBACK FindWorkerW(HWND hwnd, LPARAM param) {
    HWND shelldll = FindWindowEx(hwnd, NULL, _T("SHELLDLL_DefView"), NULL);

    if (shelldll) {
      WokerWRef* workerRef = reinterpret_cast<WokerWRef*>(param);
      workerRef->handle = FindWindowEx(NULL, hwnd, _T("WorkerW"), NULL);
      return FALSE;
    }

    return TRUE;
  }

  void AttachWindow(unsigned char* handleBuffer, Napi::Env env) {
    LONG_PTR handle = *reinterpret_cast<LONG_PTR*>(handleBuffer);
    HWND hwnd = (HWND)(LONG_PTR)handle;
    WokerWRef workerRef;

    HWND progman = FindWindow(_T("Progman"), NULL);
    LRESULT result = SendMessageTimeout(progman, WM_SPAWN_WORKER, NULL, NULL, SMTO_NORMAL, 1000, NULL);

    if (!result) {
      std::string lastError = std::system_category().message(GetLastError());
      electronwallpaper::Output::createError(env, "Unable to spawn new worker: " + lastError).ThrowAsJavaScriptException();
    }

    bool enumWindowsResult = EnumWindows(&FindWorkerW, reinterpret_cast<LPARAM>(&workerRef));
    if (!enumWindowsResult && workerRef.handle == NULL) {
      std::string lastError = std::system_category().message(GetLastError());
      electronwallpaper::Output::createError(env, "Unable to find WorkerW: " + lastError).ThrowAsJavaScriptException();
    }

    // Update style of the Window we want to attach
    SetWindowLongPtr(hwnd, GWL_EXSTYLE, WS_EX_LAYERED);
    SetParent(hwnd, workerRef.handle);
  }

} // namespace electronwallpaper
