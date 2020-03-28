
#include <iostream>
#include <napi.h>

namespace electronwallpaper {
  Napi::Error createError(Napi::Env env, std::string mesg, bool log = true);
  void logDebug(std::string mesg);
} // namespace electronwallpaper
