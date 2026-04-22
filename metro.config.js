const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const metroResolver = require('metro-resolver');

const defaultMetroResolve = metroResolver.default.resolve;

const config = {
  resolver: {
    resolveRequest(context, moduleName, platform) {
      const origin = context.originModulePath ?? '';
      const fromOutsideGestureHandler = !origin.includes(
        `${path.sep}react-native-gesture-handler${path.sep}`,
      );

      if (moduleName === 'react-native-gesture-handler' && fromOutsideGestureHandler) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(
            __dirname,
            'node_modules/react-native-gesture-handler/lib/module/index.js',
          ),
        };
      }

      return defaultMetroResolve(
        { ...context, resolveRequest: defaultMetroResolve },
        moduleName,
        platform,
      );
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
