import mqtt from 'mqtt';
import { TOPICS } from '../constants/topics.js';
import { 
    mqttConnected, 
    mqttStatusText, 
    esp32Status, 
    batteryLevel 
} from '../stores/mqttStore.js';
import { 
    PUBLIC_MQTT_BROKER_URL, 
    PUBLIC_MQTT_USERNAME, 
    PUBLIC_MQTT_PASSWORD 
} from '$env/static/public';

let client = null;

export const initMqtt = () => {
    if (client) return; // Mencegah multiple connection

    mqttStatusText.set('Connecting...');

    const options = {
        username: PUBLIC_MQTT_USERNAME,
        password: PUBLIC_MQTT_PASSWORD,
        reconnectPeriod: 3000,
        clean: true,
        protocol: 'wss' // Wajib WSS untuk web browser
    };

    client = mqtt.connect(PUBLIC_MQTT_BROKER_URL, options);

    client.on('connect', () => {
        mqttConnected.set(true);
        mqttStatusText.set('Connected');
        
        // Subscribe ke topic telemetri
        client.subscribe([TOPICS.BATTERY, TOPICS.STATUS]);
    });

    client.on('reconnect', () => {
        mqttStatusText.set('Reconnecting...');
    });

    client.on('offline', () => {
        mqttConnected.set(false);
        mqttStatusText.set('Disconnected');
        esp32Status.set('Offline');
    });

    client.on('error', (err) => {
        console.error('MQTT Connection Error: ', err);
        client.end();
    });

    client.on('message', (topic, message) => {
        const payload = message.toString();
        
        switch (topic) {
            case TOPICS.BATTERY:
                batteryLevel.set(parseInt(payload, 10));
                break;
            case TOPICS.STATUS:
                esp32Status.set(payload);
                break;
        }
    });
};

export const publishMessage = (topic, payload) => {
    if (client && client.connected) {
        client.publish(topic, payload.toString(), { qos: 1 });
    } else {
        console.warn('MQTT offline. Gagal mengirim:', payload);
    }
};