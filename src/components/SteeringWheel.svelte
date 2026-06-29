<script>
    import { steerAngle } from '$lib/stores/controlStore';

    const MAX_ANGLE = 90;

    // ukuran steering
    const SIZE = 130;
    const CENTER = SIZE / 2;
    const RADIUS = 56;

    let drag = false;
    let startX = 0;
    let startAngle = 0;

    const onDown = (e) => {
        drag = true;
        startX = e.clientX;
        startAngle = $steerAngle;
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e) => {
        if (!drag) return;

        steerAngle.set(
            Math.max(
                -MAX_ANGLE,
                Math.min(MAX_ANGLE, startAngle + (e.clientX - startX) * 1.3)
            )
        );
    };

    const onUp = () => {
        if (!drag) return;

        drag = false;
        steerAngle.set(0);
    };

    let needleRad = $derived(($steerAngle - 90) * Math.PI / 180);

    let nx = $derived(CENTER + RADIUS * Math.cos(needleRad));
    let ny = $derived(CENTER + RADIUS * Math.sin(needleRad));
</script>

<svelte:window
    onpointermove={onMove}
    onpointerup={onUp}
    onpointercancel={onUp}
/>

<div
    class="relative w-[130px] h-[130px] rounded-full bg-[#090909] border-2 border-[#1a3535] touch-none overflow-hidden"
    style="cursor:{drag ? 'grabbing' : 'grab'}"
    onpointerdown={onDown}
>

    <!-- Steering Wheel -->
    <div
        class="absolute inset-0 rounded-full"
        style="
            transform-origin:center center;
            transform:rotate({$steerAngle}deg);
            transition:transform .05s linear;
        "
    >

        <!-- Outer Ring -->
        <div
            class="absolute inset-[4px] rounded-full border-[8px] border-[#181818]">
        </div>

        <!-- Inner Ring -->
        <div
            class="absolute inset-[18px] rounded-full border border-[#252525]">
        </div>

       <!-- Spoke Kiri -->
<div
    class="absolute top-1/2 left-1/2
           w-[42px] h-[5px]
           bg-[#181818]
           rounded"
    style="
        transform:
        translate(-100%,-50%);
    ">
</div>

<!-- Spoke Kanan -->
<div
    class="absolute top-1/2 left-1/2
           w-[42px] h-[5px]
           bg-[#181818]
           rounded"
    style="
        transform:
        translate(0,-50%);
    ">
</div>

        <!-- Bottom Spoke -->
        <div
            class="absolute top-1/2 left-1/2
                   w-[36px] h-[5px]
                   bg-[#181818]
                   rounded
                   origin-center"
            style="
                transform:
                translate(-50%,22px)
                rotate(90deg);
            ">
        </div>

    </div>

    <!-- Needle -->
    <svg
        class="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
    >

        <line
            x1={CENTER}
            y1={CENTER}
            x2={nx}
            y2={ny}
            stroke="rgba(34,211,238,.7)"
            stroke-width="2"
            stroke-linecap="round"
        />

    </svg>

    <!-- HUB -->
    <div class="absolute inset-0 flex items-center justify-center z-20">

        <div
            class="w-[28px] h-[28px]
                   rounded-full
                   bg-[#0b0b0b]
                   border-2 border-[#2b2b2b]
                   shadow-lg
                   flex items-center justify-center">

            <div
                class="w-3 h-3
                       rounded-full
                       bg-cyan-300
                       shadow-[0_0_8px_rgba(34,211,238,.8)]">
            </div>

        </div>

    </div>

    <!-- L -->
    <span
        class="absolute left-2 top-1/2
               -translate-y-1/2
               text-[8px]
               font-mono
               text-cyan-500/40">
        L
    </span>

    <!-- R -->
    <span
        class="absolute right-2 top-1/2
               -translate-y-1/2
               text-[8px]
               font-mono
               text-cyan-500/40">
        R
    </span>

</div>