import React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';

/**
 * Entry for the liquid-glass preview.
 * - Web: Skia needs its WASM engine (CanvasKit) loaded before any Skia
 *   component renders, so we lazy-load the scene through WithSkiaWeb.
 * - Native: render the Skia scene directly.
 */
export const GlassKitDemo: React.FC = () => {
  if (Platform.OS === 'web') {
    // Require here so the web-only helper isn't pulled into native bundles.
    const { WithSkiaWeb } = require('@shopify/react-native-skia/lib/commonjs/web');
    return (
      <WithSkiaWeb
        getComponent={() => import('../components/glass/GlassSkiaScene')}
        opts={{
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.40.0/bin/full/${file}`,
        }}
        fallback={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EFEEF6',
            }}
          >
            <ActivityIndicator color="#A88CFA" />
          </View>
        }
      />
    );
  }

  const GlassSkiaScene = require('../components/glass/GlassSkiaScene').default;
  return <GlassSkiaScene />;
};
