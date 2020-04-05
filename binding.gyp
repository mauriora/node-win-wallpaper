{
  "targets": [
    {
      "target_name": "node-win-wallpaper",
      "sources": [
        "src/bindings.cc",
        "src/output.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
      ],
      'configurations': {
        'Release': {
            'msvs_settings': {
              'VCCLCompilerTool': {
                'ExceptionHandling': 1
              }
            }
        }
      },
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_CPP_EXCEPTIONS"],
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
