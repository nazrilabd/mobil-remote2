<script>
    import { clawPosition } from '$lib/stores/mqttStore';
    import { publishMessage } from '$lib/mqtt/mqtt';
    import { TOPICS } from '$lib/constants/topics';

    const handleClawChange = () => {
        publishMessage(TOPICS.CLAW, $clawPosition);
    };
</script>

<div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-lg shadow-emerald-900/10">
    <div class="flex justify-between items-center mb-4">
        <h3 class="text-slate-300 font-semibold text-emerald-400">Claw Servo</h3>
        <span class="bg-slate-900 text-emerald-400 font-mono px-3 py-1 rounded-lg border border-slate-700">
            {$clawPosition}°
        </span>
    </div>
    <div class="flex items-center gap-4">
        <span class="text-slate-500 text-sm font-medium">0°</span>
        <input type="range" min="0" max="180" bind:value={$clawPosition} oninput={handleClawChange} class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
        <span class="text-slate-500 text-sm font-medium">180°</span>
    </div>
</div>