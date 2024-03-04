import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
	appId: 'io.ionic.starter',
	appName: 'gav-resorts-app',
    webDir: 'www',
    bundledWebRuntime: false,
    loggingBehavior: "none",
    android: {
        buildOptions: {
            keystorePath: "./test-key.keystore",
        },
        webContentsDebuggingEnabled: false,
        useLegacyBridge: false,
        loggingBehavior: "none"
    },
    ios: {
        scheme: 'App',
        webContentsDebuggingEnabled: false,
        loggingBehavior: "none"
    },
    plugins: {
        SplashScreen: {
            androidScaleType: 'CENTER_CROP',
            launchShowDuration: 500,
            launchAutoHide: true,
            backgroundColor: '#000',
            splashFullScreen: false,
            splashImmersive: false,
        },
        Keyboard: {
            resize: KeyboardResize.Body,
            style: KeyboardStyle.Dark,
            resizeOnFullScreen: true,
        }
    },
    server: {
        allowNavigation: [
            "*", "ionic://*", "http://localhost:8100"
        ]
    }
};

export default config;
