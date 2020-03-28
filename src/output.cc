
#include <iostream>
#include <napi.h>


namespace electronwallpaper {
  class Output {
  public:
    static Napi::Error CreateError(Napi::Env env, std::string mesg, bool log = true) {
      if (log) {
        std::cerr << "[ERROR] (electron-wallpaper) " << mesg << std::endl;
      }
      return Napi::Error::New(env, mesg);
    };

  public:
    static void Debug(std::string mesg) {
      std::cout << "[DEBUG] (electron-wallpaper) " << mesg << std::endl;
    };
  };

} // namespace electronwallpaper
