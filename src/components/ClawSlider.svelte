<script>
    import { clawPosition } from '$lib/stores/mqttStore';
    import { publishMessage } from '$lib/mqtt/mqtt';
    import { TOPICS } from '$lib/constants/topics';

    const ARC_LEN = 188.5;

    const handleChange = () => publishMessage(TOPICS.CLAW, $clawPosition);

    let pct      = $derived($clawPosition / 50);
    let deg      = $derived(-90 + pct * 180);
    let offset   = $derived(ARC_LEN * (1 - pct));
    let sliderP  = $derived(Math.round(pct * 100) + '%');
    let stateLabel = $derived(
        $clawPosition < 30  ? 'CLOSE' :
        $clawPosition > 150 ? 'OPEN'  : 'HALF'
    );

    const ticks = Array.from({ length: 10 }, (_, i) => {
        const t = i / 9, d = (-195 + t * 210) * Math.PI / 180;
        const major = i % 3 === 0;
        return { x1: 75 + 60 * Math.cos(d), y1: 75 + 60 * Math.sin(d),
                 x2: 75 + (major ? 50 : 54) * Math.cos(d),
                 y2: 75 + (major ? 50 : 54) * Math.sin(d), major };
    });
</script>

<div class="flex flex-col items-center gap-2">
    <span class="text-[8px] font-mono uppercase tracking-[0.25em] text-slate-500">Claw</span>

    <svg width="150" height="92" viewBox="0 0 150 92">
        <defs>
            <linearGradient id="claw-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#065f46"/>
                <stop offset="50%"  stop-color="#34d399"/>
                <stop offset="100%" stop-color="#065f46"/>
            </linearGradient>
        </defs>

        <!-- track -->
        <path d="M 15 80 A 60 60 0 0 1 135 80"
              fill="none" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/>
        <!-- fill arc -->
        <path d="M 15 80 A 60 60 0 0 1 135 80"
              fill="none" stroke="url(#claw-grad)" stroke-width="8" stroke-linecap="round"
              stroke-dasharray={ARC_LEN} stroke-dashoffset={offset}/>

        <!-- ticks -->
        {#each ticks as t}
            <line x1={t.x1.toFixed(1)} y1={t.y1.toFixed(1)}
                  x2={t.x2.toFixed(1)} y2={t.y2.toFixed(1)}
                  stroke="#34d399" stroke-width={t.major ? 1.5 : 1} opacity="0.4"/>
        {/each}

        <!-- jarum -->
        <line x1="75" y1="75" x2="75" y2="28"
              stroke="#34d399" stroke-width="2.5" stroke-linecap="round"
              transform="rotate({deg}, 75, 75)"
              style="transition: transform 0.15s ease-out;"/>

        <!-- pivot -->
        <circle cx="75" cy="75" r="5" fill="#0f172a" stroke="#34d399" stroke-width="1.5"/>
        <circle cx="75" cy="75" r="2" fill="#34d399"/>

        <!-- derajat -->
        <text x="75" y="66" text-anchor="middle" font-size="16" font-weight="bold"
              fill="#34d399" font-family="monospace">
            {$clawPosition}
        </text>
        <text x="75" y="80" text-anchor="middle" font-size="7"
              fill="rgba(100,116,139,0.6)" font-family="monospace" letter-spacing="2">DEG</text>
        <!-- status OPEN / HALF / CLOSE -->
        <text x="75" y="91" text-anchor="middle" font-size="7"
              fill="rgba(52,211,153,0.55)" font-family="monospace" letter-spacing="1">
            {stateLabel}
        </text>

        <text x="13"  y="88" text-anchor="middle" font-size="7" fill="rgba(100,116,139,0.4)" font-family="monospace">0°</text>
        <text x="137" y="88" text-anchor="middle" font-size="7" fill="rgba(100,116,139,0.4)" font-family="monospace">180°</text>
    </svg>

    <input
        type="range" min="0" max="50"
        bind:value={$clawPosition}
        oninput={handleChange}
        style="--p: {sliderP}; width: 140px;"
        class="claw-slider"
    />
</div>

<style>
    .claw-slider {
        -webkit-appearance: none;
        appearance: none;
        height: 3px;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        background: linear-gradient(to right, #34d399 0%, #34d399 var(--p), #1e293b var(--p));
    }
    .claw-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px; height: 14px;
        border-radius: 50%;
        background: #34d399;
        border: 2px solid #000;
        cursor: pointer;
    }
    .claw-slider::-moz-range-thumb {
        width: 14px; height: 14px;
        border-radius: 50%;
        background: #34d399;
        border: 2px solid #000;
        cursor: pointer;
    }
</style>