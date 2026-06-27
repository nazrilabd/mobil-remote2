<script>
    import { publishMessage } from '$lib/mqtt/mqtt';
    import { TOPICS } from '$lib/constants/topics';

    const sendCommand = (direction) => {
        publishMessage(TOPICS.CONTROL, direction);
    };
</script>

<div class="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 shadow-lg shadow-blue-900/10 flex justify-center items-center h-full">
    <div class="grid grid-cols-3 gap-3">
        <div></div>
        <button onclick={() => sendCommand('forward')} class="w-16 h-16 bg-slate-700 hover:bg-blue-600 text-white rounded-xl shadow transition-colors active:scale-95 flex items-center justify-center text-2xl font-bold">↑</button>
        <div></div>
        
        <button onclick={() => sendCommand('left')} class="w-16 h-16 bg-slate-700 hover:bg-blue-600 text-white rounded-xl shadow transition-colors active:scale-95 flex items-center justify-center text-2xl font-bold">←</button>
        <button onclick={() => sendCommand('stop')} class="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 transition-colors active:scale-95 flex items-center justify-center text-sm font-bold tracking-wider">STOP</button>
        <button onclick={() => sendCommand('right')} class="w-16 h-16 bg-slate-700 hover:bg-blue-600 text-white rounded-xl shadow transition-colors active:scale-95 flex items-center justify-center text-2xl font-bold">→</button>
        
        <div></div>
        <button onclick={() => sendCommand('backward')} class="w-16 h-16 bg-slate-700 hover:bg-blue-600 text-white rounded-xl shadow transition-colors active:scale-95 flex items-center justify-center text-2xl font-bold">↓</button>
        <div></div>
    </div>
</div>