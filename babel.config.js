const presets = [
    [
        "@babel/env",
        {
            targets: {
                esmodules: true,
                // edge: "17",
                // firefox: "60",
                // chrome: "67",
                // safari: "11.1",
            },
            // useBuiltIns: "usage",
            // corejs: "3.6.4",
        }
    ], "@babel/preset-typescript"

];

module.exports = { presets };