export const environment = {
    apiUrl: 'http://127.0.0.1:8000',
    production: false,
    pwa: {
        enabled: true,
        serviceWorkerUrl: 'ngsw-worker.js',
        registrationStrategy: 'registerWhenStable:30000'
    },
    features: {
        faceCapture: true,
        paymentProcessing: true,
        transactionHistory: true,
        userSettings: true,
        pwaInstallPrompt: true
    },
    version: '1.0.0',
    buildDate: new Date().toISOString(),
    supportEmail: 'support@avpay.com'   
};
