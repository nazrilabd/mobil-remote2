<script>
    import { carSpeed } from '$lib/stores/mqttStore';
    import { publishMessage } from '$lib/mqtt/mqtt';
    import { TOPICS } from '$lib/constants/topics';

    const ARC_LEN = 188.5;

    const handleChange = () => publishMessage(TOPICS.SPEED, $carSpeed);

    let pct     = $derived($carSpeed / 255);
    let deg     = $derived(-90 + pct * 180);
    let offset  = $derived(ARC_LEN * (1 - pct));
    let color   = $derived($carSpeed > 200 ? '#ef4444' : $carSpeed > 120 ? '#f59e0b' : '#22d3ee');
    let sliderP = $derived(Math.round(pct * 100) + '%');

    // tick marks
    const ticks = Array.from({ length: 11 }, (_, i) => {
        const t = i / 10, d = (-195 + t * 210) * Math.PI / 180;
        const major = i % 2 === 0;
        return { x1: 75 + 60 * Math.cos(d), y1: 75 + 60 * Math.sin(d),
                 x2: 75 + (major ? 50 : 54) * Math.cos(d),
                 y2: 75 + (major ? 50 : 54) * Math.sin(d), major };
    });
</script>

<div class="flex flex-col items-center gap-2">
    <span class="text-[8px] font-mono uppercase tracking-[0.25em] text-slate-500">Speed</span>

    <svg width="150" height="90" viewBox="0 0 150 90">
        <defs>
            <linearGradient id="spd-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stop-color="#0891b2"/>
                <stop offset="60%"  stop-color="#22d3ee"/>
                <stop offset="100%" stop-color="#ef4444"/>
            </linearGradient>
        </defs>

        <!-- track -->
        <path d="M 15 80 A 60 60 0 0 1 135 80"
              fill="none" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/>
        <!-- fill arc -->
        <path d="M 15 80 A 60 60 0 0 1 135 80"
              fill="none" stroke="url(#spd-grad)" stroke-width="8" stroke-linecap="round"
              stroke-dasharray={ARC_LEN} stroke-dashoffset={offset}/>

        <!-- tick marks -->
        {#each ticks as t}
            <line x1={t.x1.toFixed(1)} y1={t.y1.toFixed(1)}
                  x2={t.x2.toFixed(1)} y2={t.y2.toFixed(1)}
                  stroke="#22d3ee" stroke-width={t.major ? 1.5 : 1} opacity="0.4"/>
        {/each}

        <!-- jarum -->
        <line x1="75" y1="75" x2="75" y2="28"
              stroke={color} stroke-width="2.5" stroke-linecap="round"
              transform="rotate({deg}, 75, 75)"
              style="transition: transform 0.15s ease-out;"/>

        <!-- pivot -->
        <circle cx="75" cy="75" r="5" fill="#0f172a" stroke={color} stroke-width="1.5"/>
        <circle cx="75" cy="75" r="2" fill={color}/>

        <!-- nilai -->
        <text x="75" y="68" text-anchor="middle" font-size="18" font-weight="bold"
              fill={color} font-family="monospace"
              style="transition: fill 0.2s;">
            {$carSpeed}
        </text>
        <text x="75" y="88" text-anchor="middle" font-size="7"
              fill="rgba(100,116,139,0.6)" font-family="monospace" letter-spacing="2">KM/H</text>

        <!-- batas label -->
        <text x="13"  y="88" text-anchor="middle" font-size="7" fill="rgba(100,116,139,0.4)" font-family="monospace">0</text>
        <text x="137" y="88" text-anchor="middle" font-size="7" fill="rgba(100,116,139,0.4)" font-family="monospace">255</text>
    </svg>

    <!-- slider -->
   <!-- <input
        type="range" min="0" max="255"
        bind:value={$carSpeed}
        oninput={handleChange}
        style="--p: {sliderP}; width: 140px;"
        class="spd-slider"
    /> -->
</div>
<!--
<style>
    .spd-slider {
        -webkit-appearance: none;
        appearance: none;
        height: 3px;
        border-radius: 2px;
        outline: none;
        cursor: pointer;
        background: linear-gradient(to right, #22d3ee 0%, #22d3ee var(--p), #1e293b var(--p));
    }
    .spd-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px; height: 14px;
        border-radius: 50%;
        background: #22d3ee;
        border: 2px solid #000;
        cursor: pointer;
    }
    .spd-slider::-moz-range-thumb {
        width: 14px; height: 14px;
        border-radius: 50%;
        background: #22d3ee;
        border: 2px solid #000;
        cursor: pointer;
    }
</style>

-->