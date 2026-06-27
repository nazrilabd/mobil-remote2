
import { writable } from 'svelte/store';

// Infrastruktur
export const mqttConnected = writable(false);
export const mqttStatusText = writable('Disconnected');

// Status ESP32
export const esp32Status = writable('Offline');

// Telemetri & Parameter
export const batteryLevel = writable(0);
export const carSpeed = writable(128);
export const clawPosition = writable(90);