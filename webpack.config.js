module.exports = { 
    "module": {
        "rules": [
          {
            "test": "/\.tsx|ts|js|jsx?$/",
            "use": [
              {
                "loader": "ts-loader",
                "options": {
                  "transpileOnly": true
                }
              }
            ]
          }
        ]
      },
};