import { writable, derived } from 'svelte/store';

export const steerAngle  = writable(0);   // -90 .. 90
export const gasLevel    = writable(0);   // 0 .. 100
export const reverseLevel = writable(0);  // 0 .. 100

const DEADZONE = 8;

// Derived: command final dari gabungan ketiga nilai
export const driveCommand = derived(
    [steerAngle, gasLevel, reverseLevel],
    ([$angle, $gas, $rev]) => {
        const steer = Math.abs($angle) > DEADZONE
            ? ($angle > 0 ? 'right' : 'left')
            : null;

        if ($gas === 0 && $rev === 0 && !steer) return null;
        if ($rev > 0)   return steer ? `backward_${steer}` : 'backward';
        if ($gas > 0)   return steer ? `forward_${steer}`  : 'forward';
        return steer;
    }
);