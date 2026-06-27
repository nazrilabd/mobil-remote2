<script>
    import { mqttConnected, mqttStatusText } from '$lib/stores/mqttStore';
</script>

<div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-blue-900/10 flex flex-col items-center justify-center text-center h-full">
    <h3 class="text-slate-400 text-sm font-semibold mb-2">MQTT Broker</h3>
    {#if $mqttConnected}
        <div class="text-blue-400 font-bold text-xl flex flex-col items-center gap-2">
            {$mqttStatusText}
        </div>
    {:else}
        <div class="text-slate-500 font-bold text-lg flex flex-col items-center gap-2">
            {$mqttStatusText}
        </div>
    {/if}
</div>