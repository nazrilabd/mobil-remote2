<script>
    import { batteryLevel } from '$lib/stores/mqttStore';
</script>

<div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-lg shadow-blue-900/10 flex flex-col items-center justify-center text-center h-full">
    <h3 class="text-slate-400 text-sm font-semibold mb-2">Battery Level</h3>
    
    <div class="flex items-center gap-4 mt-2">
        <div class="w-12 h-6 border-2 border-slate-500 rounded p-0.5 relative">
            <div class="absolute -right-1.5 top-1.5 w-1 h-2 bg-slate-500 rounded-r-sm"></div>
            <div class={`h-full rounded-sm transition-all duration-300 ${$batteryLevel > 20 ? 'bg-blue-500' : 'bg-red-500'}`} style="width: {$batteryLevel}%;"></div>
        </div>
        <span class="text-2xl font-bold text-slate-100">{$batteryLevel}%</span>
    </div>
</div>