<script>
    import { esp32Status } from '$lib/stores/mqttStore';
</script>

<div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-blue-900/10 flex flex-col items-center justify-center text-center h-full">
    <h3 class="text-slate-400 text-sm font-semibold mb-2">ESP32 Status</h3>
    
    <div class="flex flex-col items-center gap-2 mt-1">
        <div class="relative flex h-10 w-10 items-center justify-center">
            {#if $esp32Status === 'Online'}
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            {:else}
                <span class="relative inline-flex rounded-full h-4 w-4 bg-slate-600"></span>
            {/if}
        </div>
        <span class={`font-bold text-xl ${$esp32Status === 'Online' ? 'text-slate-100' : 'text-slate-500'}`}>
            {$esp32Status}
        </span>
    </div>
</div>