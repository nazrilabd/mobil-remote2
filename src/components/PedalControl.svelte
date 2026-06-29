<script>
    import { gasLevel, reverseLevel } from '$lib/stores/controlStore';
    import { carSpeed } from '$lib/stores/mqttStore';

    let gasPercent = $derived(($carSpeed / 255) * 100);
    const RAMP_MS   = 60;
    const RAMP_STEP = 10;

    let timer = null;
    let gasActive = $state(false);
    let revActive = $state(false);

    const stopRamp = () => { if (timer) { clearInterval(timer); timer = null; } };

    const startRamp = (store, setActive) => {
        stopRamp();
        timer = setInterval(() => {
            store.update(v => Math.min(100, v + RAMP_STEP));
        }, RAMP_MS);
    };

    const onGasDown = (e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        gasActive = true;
        startRamp(gasLevel);
    };
    const onGasUp = () => {
        gasActive = false;
        stopRamp();
        gasLevel.set(0);
    };

    const onRevDown = (e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        revActive = true;
        startRamp(reverseLevel);
    };
    const onRevUp = () => {
        revActive = false;
        stopRamp();
        reverseLevel.set(0);
    };
</script>

<div class="flex gap-3 items-end select-none font-mono">
 <!-- MUNDUR -->
    <div class="flex flex-col items-center gap-1">
        <div class="w-[6px] h-10 bg-black/50 rounded border border-white/[0.06] overflow-hidden flex flex-col justify-end">
            <div class="w-full rounded bg-red-400 transition-all"
                 style="height: {$reverseLevel}%;"></div>
        </div>
        <button
            class="w-14 h-14 rounded-[9px] border-2 flex flex-col items-center justify-center gap-0.5
                   touch-none text-[8px] tracking-[0.1em] font-bold transition-colors
                   {revActive
                     ? 'bg-[#2a0808] border-red-300 text-red-200'
                     : 'bg-[#160305] border-red-500/30 text-red-400'}"
            onpointerdown={onRevDown}
            onpointerup={onRevUp}
            onpointercancel={onRevUp}
        >
        <svg width="18" height="18" viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2.5"
     stroke-linecap="round"
     stroke-linejoin="round">

    <polyline points="12 5 12 19"/>
    <polyline points="6 13 12 19 18 13"/>

</svg>
            MUNDUR
        </button>
        <span class="text-[8px] text-slate-500 tracking-[0.15em]">MUNDUR</span>
    </div>

    <!-- GAS -->
    <div class="flex flex-col items-center gap-1">
        <!-- bar level -->
        <div class="w-[6px] h-10 bg-black/50 rounded border border-white/[0.06] overflow-hidden flex flex-col justify-end">
            <div class="w-full rounded bg-cyan-400 transition-all"
                 style="height: {$gasLevel}%;"></div>
        </div>
        <button
            class="w-14 h-20 rounded-[9px] border-2 flex flex-col items-center justify-center gap-0.5
                   touch-none text-[8px] tracking-[0.1em] font-bold transition-colors
                   {gasActive
                     ? 'bg-[#083030] border-cyan-300 text-cyan-200'
                     : 'bg-[#031516] border-cyan-500/30 text-cyan-400'}"
            onpointerdown={onGasDown}
            onpointerup={onGasUp}
            onpointercancel={onGasUp}
        >
        <svg width="18" height="18" viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2.5"
     stroke-linecap="round"
     stroke-linejoin="round">

    <polyline points="12 19 12 5"/>
    <polyline points="6 11 12 5 18 11"/>

</svg>
            GAS
        </button>
        <span class="text-[8px] text-slate-500 tracking-[0.15em]">MAJU</span>
    </div>

   

</div>