<script>
    import { mqttConnected, mqttStatusText } from '$lib/stores/mqttStore';
</script>

<nav class="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <span class="text-white font-bold text-xs">IoT</span>
                </div>
                <h1 class="text-xl font-bold text-slate-100">Car Remote</h1>
            </div>
            
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700">
                <div class={`w-2.5 h-2.5 rounded-full ${$mqttConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                <span class="text-sm font-medium text-slate-300 hidden sm:block">{$mqttStatusText}</span>
            </div>
        </div>
    </div>
</nav>