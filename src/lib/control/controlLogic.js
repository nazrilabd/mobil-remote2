import { get } from 'svelte/store';
import { driveCommand } from '$lib/stores/controlStore';
import { publishMessage } from '$lib/mqtt/mqtt';
import { TOPICS } from '$lib/constants/topics';

let lastCmd = null;
let unsub = null;

export function startControlLogic() {
    unsub = driveCommand.subscribe((cmd) => {
        if (cmd === lastCmd) return;
        lastCmd = cmd;
        publishMessage(TOPICS.CONTROL, cmd ?? 'stop');
    });
}

export function stopControlLogic() {
    unsub?.();
    publishMessage(TOPICS.CONTROL, 'stop');
    lastCmd = null;
}