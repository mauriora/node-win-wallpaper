
#include <iostream>
#include <napi.h>

namespace electronwallpaper {
  class Output {
  public:
    static Napi::Error createError(Napi::Env env,const std::string& mesg, bool log = true) {
      if (log) {
        std::cerr << "[ERROR] (node-win-wallpaper) " << mesg << std::endl;
      }
      return Napi::Error::New(env, mesg);
    };

  public:
    static void debug(const std::string& mesg) {
      std::cout << "[DEBUG] (node-win-wallpaper) " << mesg << std::endl;
    };
  };

} // namespace electronwallpaper
