<script>
    import { onMount, onDestroy } from 'svelte';
    import { initMqtt } from '$lib/mqtt/mqtt';
    import { mqttStatusText, batteryLevel, esp32Status } from '../lib/stores/mqttStore';
    import { startControlLogic, stopControlLogic } from '$lib/control/controlLogic';
    import { steerAngle, gasLevel, reverseLevel, driveCommand } from '$lib/stores/controlStore';
    import { publishMessage } from '$lib/mqtt/mqtt';
    import { TOPICS } from '$lib/constants/topics';

    import SteeringWheel from '../components/SteeringWheel.svelte';
    import PedalControl  from '../components/PedalControl.svelte';
    import SpeedSlider   from '../components/SpeedSlider.svelte';
    import ClawSlider    from '../components/ClawSlider.svelte';
    import CameraView    from '../components/CameraView.svelte';

    let timer;

    onMount(() => {
        initMqtt();
        startControlLogic();
        timer = setInterval(() => {}, 1000);
    });

    onDestroy(() => {
        clearInterval(timer);
        stopControlLogic();
    });

    const emergencyStop = () => {
        steerAngle.set(0);
        gasLevel.set(0);
        reverseLevel.set(0);
        publishMessage(TOPICS.CONTROL, 'stop');
    };

    const LABELS = {
        forward: 'MAJU', backward: 'MUNDUR',
        right: '▶ KANAN', left: 'KIRI ◀',
        forward_right: 'MAJU ▶', forward_left: '◀ MAJU',
        backward_right: 'MUNDUR ▶', backward_left: '◀ MUNDUR',
    };

    let isConnected = $derived($mqttStatusText?.toLowerCase().includes('connect'));
</script>

<main class="fixed inset-0 w-screen h-screen overflow-hidden bg-black select-none">

    <!-- PORTRAIT WARNING -->
    <div class="landscape-warning fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center gap-4 text-slate-300">
        <div class="text-5xl animate-[spin_2.5s_linear_infinite]">📱</div>
        <p class="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">Putar Perangkat</p>
        <p class="text-slate-500 text-xs">Mode landscape diperlukan untuk kontrol penuh</p>
    </div>

    <!-- KAMERA -->
    <div class="absolute inset-0 z-0">
        <CameraView />
    </div>

    <!-- HUD -->
    <div class="relative z-10 w-full h-full p-3 md:p-4 flex flex-col justify-between pointer-events-none font-mono">

        <!-- TOP HUD -->
        <header class="flex justify-between items-start pointer-events-auto">
            <div class="flex gap-2">
                <div class="flex items-center gap-1.5 bg-black/55 backdrop-blur-lg px-3 py-1.5 rounded-md border border-white/10 text-[10px] uppercase tracking-widest">
                    <span class="w-1.5 h-1.5 rounded-full {isConnected ? 'bg-emerald-400' : 'bg-red-500 animate-pulse'}"></span>
                    <span class="text-slate-500">MQTT</span>
                    <span class="{isConnected ? 'text-emerald-400' : 'text-red-400'}">{$mqttStatusText}</span>
                </div>
                <div class="flex items-center gap-1.5 bg-black/55 backdrop-blur-lg px-3 py-1.5 rounded-md border border-white/10 text-[10px] uppercase tracking-widest">
                    <span class="text-slate-500">ROBOT</span>
                    <span class="text-cyan-300">{$esp32Status}</span>
                </div>
            </div>
            <div class="flex items-center gap-2 bg-black/55 backdrop-blur-lg px-3 py-1.5 rounded-md border border-white/10 text-[10px] uppercase tracking-widest">
                <span class="text-slate-500">PWR</span>
                <div class="relative w-7 h-3 border border-slate-500 rounded-[2px]">
                    <div class="absolute inset-0.5 rounded-[1px] transition-all
                                {$batteryLevel > 50 ? 'bg-emerald-400' : $batteryLevel > 20 ? 'bg-amber-400' : 'bg-red-500'}"
                         style="width: {Math.max($batteryLevel, 4)}%"></div>
                    <div class="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-slate-500 rounded-r-[1px]"></div>
                </div>
                <span class="{$batteryLevel > 20 ? 'text-amber-300' : 'text-red-400 animate-pulse'}">{$batteryLevel}%</span>
            </div>
        </header>

        <!-- BOTTOM HUD -->
        <div class="flex justify-between items-end pb-1 gap-2">

            <!-- KIRI BAWAH: setir -->
            <div class="flex flex-col items-center gap-1.5 pointer-events-auto">
                <SteeringWheel />
                <span class="text-[8px] text-cyan-400/60 tracking-[0.18em]">
                    {$driveCommand ? (LABELS[$driveCommand] ?? $driveCommand) : '— IDLE —'}
                </span>
                <button
                    onclick={emergencyStop}
                    class="px-4 py-1 rounded-full bg-red-500/85 hover:bg-red-500 active:scale-95
                           text-white text-[9px] font-bold tracking-widest transition-all"
                >STOP</button>
            </div>

            <!-- TENGAH: speed + claw gauge berdampingan -->
            <div class="flex gap-2 items-end pointer-events-auto">
                <!-- Speed -->
                <div class="flex flex-col items-center gap-1
                            bg-black/50 backdrop-blur-xl rounded-xl border border-cyan-500/15
                            px-3 pt-3 pb-2">
                    <SpeedSlider />
                </div>
                <!-- Claw -->
                <div class="flex flex-col items-center gap-1
                            bg-black/50 backdrop-blur-xl rounded-xl border border-emerald-500/15
                            px-3 pt-3 pb-2">
                    <ClawSlider />
                </div>
            </div>

            <!-- KANAN BAWAH: pedal gas + mundur -->
            <div class="pointer-events-auto">
                <PedalControl />
            </div>

        </div>
    </div>
</main>

<style>
    main {
        padding: env(safe-area-inset-top) env(safe-area-inset-right)
                 env(safe-area-inset-bottom) env(safe-area-inset-left);
    }
    .landscape-warning { display: none; }
    @media (orientation: portrait) and (max-width: 768px) {
        .landscape-warning { display: flex; }
    }
</style>