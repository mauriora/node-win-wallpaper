{
  "targets": [
    {
      "target_name": "electron-wallpaper",
      "sources": [
        "src/bindings.cc",
        "src/log.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      "conditions": [
        [
          "OS==\"win\"",
          {
            "sources": ["src/electronwallpaper_win.cc"]
          }
        ],
        [
          "OS!=\"win\"",
          {
            "sources": ["src/electronwallpaper_noop.cc"]
          }
        ]
      ]
    }
  ]
}
