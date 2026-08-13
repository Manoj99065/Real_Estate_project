const getApiUrl = () => {
    // Check if the app is running in a browser on your PC or inside the Android Emulator
    const hostname = window.location.hostname;

    // If on your PC browser, use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }

    // If inside the Android Emulator, use the special bridge IP to connect back to your PC
    return 'http://10.0.2.2:5000';
};

const API_URL = getApiUrl();
export default API_URL;