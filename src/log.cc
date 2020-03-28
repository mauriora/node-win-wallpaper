
#include <iostream>
#include <napi.h>

namespace electronwallpaper {
  Napi::Error createError(Napi::Env env, std::string mesg, bool log = true) {
    if (log) {
      std::cerr << "[ERROR] (electron-wallpaper) " << mesg << std::endl;
    }
    return Napi::Error::New(env, mesg);
  }

} // namespace electronwallpaper
