/// <reference types="react-scripts" />
interface Window {
    __ENV__: {
        NODE_ENV: string;
    };
    gtag: Function;
    dataLayer: Array;
}
