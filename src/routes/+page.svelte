<script>
    import { onMount } from 'svelte';
    import { initMqtt } from '$lib/mqtt/mqtt';
    
    import Navbar from '../components/Navbar.svelte';
    import StatusCard from '../components/StatusCard.svelte';
    import ConnectionCard from '../components/ConnectionCard.svelte';
    import BatteryCard from '../components/BatteryCard.svelte';
    import SpeedSlider from '../components/SpeedSlider.svelte';
    import ClawSlider from '../components/ClawSlider.svelte';
    import Controller from '../components/Controller.svelte';

    onMount(() => {
        // Hanya panggil initMqtt di browser (menghindari error SSR Vercel)
        initMqtt();
    });
</script>

<svelte:head>
    <title>IoT Car Dashboard</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
    <Navbar />

    <main class="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <!-- Row 1: Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatusCard />
            <ConnectionCard />
            <BatteryCard />
        </div>

        <!-- Row 2: Controllers -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            
            <!-- Direction -->
            <div class="flex flex-col gap-2">
                <h2 class="text-slate-400 font-semibold uppercase tracking-wider text-sm mb-2 ml-1">Direction Control</h2>
                <Controller />
            </div>

            <!-- Parameters -->
            <div class="flex flex-col gap-4">
                <h2 class="text-slate-400 font-semibold uppercase tracking-wider text-sm mb-1 ml-1">Parameters</h2>
                <SpeedSlider />
                <ClawSlider />
            </div>

        </div>

    </main>
</div>