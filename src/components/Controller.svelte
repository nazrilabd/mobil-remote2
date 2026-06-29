<script>
    import { publishMessage } from '$lib/mqtt/mqtt';
    import { TOPICS } from '$lib/constants/topics';

    const MAX_ANGLE = 90;
    const DEADZONE  = 8;
    const RAMP_MS   = 60;
    const RAMP_STEP = 10;

    let wheelEl, wheelBody;
    let angle        = $state(0);
    let gasLevel     = $state(0);
    let reverseLevel = $state(0);
    let drag = false, startX = 0, startAngle = 0;
    let rampTimer = null;
    let activeCmd = $state(null);

    const send = (cmd) => {
        if (cmd === activeCmd) return;
        activeCmd = cmd;
        publishMessage(TOPICS.CONTROL, cmd ?? 'stop');
    };

    const resolve = () => {
        const s = Math.abs(angle) > DEADZONE ? (angle > 0 ? 'right' : 'left') : null;
        if (gasLevel === 0 && reverseLevel === 0 && !s) { send(null); return; }
        if (reverseLevel > 0) send(s ? `backward_${s}` : 'backward');
        else if (gasLevel > 0) send(s ? `forward_${s}` : 'forward');
        else send(s);
    };

    const stopRamp = () => { if (rampTimer) { clearInterval(rampTimer); rampTimer = null; } };
    const startRamp = (w) => {
        stopRamp();
        rampTimer = setInterval(() => {
            if (w === 'gas') gasLevel     = Math.min(100, gasLevel     + RAMP_STEP);
            else             reverseLevel = Math.min(100, reverseLevel + RAMP_STEP);
            resolve();
        }, RAMP_MS);
    };

    const onGasDown    = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); startRamp('gas'); };
    const onGasUp      = ()  => { stopRamp(); gasLevel = 0; resolve(); };
    const onRevDown    = (e) => { e.currentTarget.setPointerCapture?.(e.pointerId); startRamp('rev'); };
    const onRevUp      = ()  => { stopRamp(); reverseLevel = 0; resolve(); };

    const onWheelDown  = (e) => { drag = true; startX = e.clientX; startAngle = angle; e.currentTarget.setPointerCapture?.(e.pointerId); };
    const onPointerMove = (e) => {
        if (!drag) return;
        angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, startAngle + (e.clientX - startX) * 1.3));
        resolve();
    };
    const onPointerUp  = () => { if (!drag) return; drag = false; angle = 0; resolve(); };

    const emergencyStop = () => {
        stopRamp(); angle = 0; gasLevel = 0; reverseLevel = 0;
        activeCmd = null; publishMessage(TOPICS.CONTROL, 'stop');
    };

    let needleRad = $derived((angle - 90) * Math.PI / 180);
    let nx = $derived(85 + 73 * Math.cos(needleRad));
    let ny = $derived(85 + 73 * Math.sin(needleRad));

    let dirLabel = $derived(
        !activeCmd ? '— IDLE —' :
        activeCmd === 'forward'         ? 'MAJU'         :
        activeCmd === 'backward'        ? 'MUNDUR'       :
        activeCmd === 'right'           ? '▶ KANAN'      :
        activeCmd === 'left'            ? 'KIRI ◀'       :
        activeCmd === 'forward_right'   ? 'MAJU ▶'       :
        activeCmd === 'forward_left'    ? '◀ MAJU'       :
        activeCmd === 'backward_right'  ? 'MUNDUR ▶'     :
        activeCmd === 'backward_left'   ? '◀ MUNDUR'     : '—'
    );
</script>

<svelte:window
    onpointermove={onPointerMove}
    onpointerup={onPointerUp}
    onpointercancel={onPointerUp}
/>

<!-- SETIR (kiri bawah) -->
<div class="flex flex-col items-center gap-2 select-none font-mono">
    <div
        bind:this={wheelEl}
        class="relative w-44 h-44 rounded-full bg-[#090909] border-2 border-[#1a3535] touch-none"
        style="cursor: {drag ? 'grabbing' : 'grab'};"
        onpointerdown={onWheelDown}
    >
        <!-- bodi setir berputar -->
        <div
            bind:this={wheelBody}
            class="absolute inset-0 rounded-full"
            style="transform: rotate({angle}deg); transition: transform 0.04s;"
        >
            <!-- rim luar -->
            <div class="absolute inset-[5px] rounded-full border-[9px] border-[#1a1a1a]"></div>
            <!-- rim dalam -->
            <div class="absolute inset-[22px] rounded-full border border-[#222]"></div>
            <!-- jari-jari -->
            <div class="absolute top-1/2 left-1/2 w-[46px] h-[6px] bg-[#1a1a1a] rounded origin-[0_0]"
                 style="transform: translate(-100%, -3px) rotate(150deg);"></div>
            <div class="absolute top-1/2 left-1/2 w-[46px] h-[6px] bg-[#1a1a1a] rounded origin-[0_0]"
                 style="transform: translate(0, -3px) rotate(30deg);"></div>
            <div class="absolute top-1/2 left-1/2 w-[42px] h-[6px] bg-[#1a1a1a] rounded origin-[0_0]"
                 style="transform: translate(-50%, 0) rotate(90deg);"></div>
        </div>

        <!-- jarum arah -->
        <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 170 170">
            <circle cx="85" cy="85" r="78" fill="none" stroke="rgba(34,211,238,0.05)" stroke-width="1.5"/>
            <line x1="85" y1="85" x2={nx} y2={ny}
                  stroke="rgba(34,211,238,0.55)" stroke-width="2.5" stroke-linecap="round"/>
        </svg>

        <!-- hub tengah -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-8 h-8 rounded-full bg-[#0e0e0e] border-2 border-[#2a2a2a]
                    flex items-center justify-center z-10">
            <div class="w-[9px] h-[9px] rounded-full transition-colors"
                 style="background: {reverseLevel > 0 ? '#f87171' : '#22d3ee'};"></div>
        </div>
    </div>

    <span class="text-[10px] tracking-[0.18em] text-cyan-400/65">{dirLabel}</span>
    <button
        onclick={emergencyStop}
        class="px-4 py-1 rounded-full bg-red-500/85 hover:bg-red-500 active:scale-95
               text-white text-[10px] font-bold tracking-widest transition-all"
    >STOP</button>
</div>


<!-- PEDAL GAS + MUNDUR (kanan bawah) — taruh di +page.svelte terpisah -->
<!-- Ekspor sebagai props / gunakan slot, atau pisah jadi PedalControl.svelte -->