<script>
    import { onMount } from 'svelte';
    import Peer from 'peerjs';

    let targetPeerId = $state('');
    let statusText = $state('Menunggu input ID...');
    let isConnected = $state(false);
    let videoElement = $state();
    let isCameraOn = $state(true);
    let scanning = $state(false);
    let scanSupported = $state(true);
    let scanLoopId;

    let peer;
    let localStream;

    onMount(async () => {
        peer = new Peer();
        await startCamera();

        if (!('BarcodeDetector' in window)) {
            scanSupported = false;
        }

        // Listener untuk menerima perintah kualitas dari Dashboard
        peer.on('connection', (conn) => {
            conn.on('data', async (data) => {
                if (data === 'SET_HD') {
                    await applyVideoConstraints({ width: 1920, height: 1080 });
                    statusText = 'Kualitas: HD (1080p)';
                } else if (data === 'SET_SD') {
                    await applyVideoConstraints({ width: 640, height: 360 });
                    statusText = 'Kualitas: SD (Preview)';
                }
            });
        });
    });

    async function startCamera() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: { ideal: 640 }, // Default ke SD agar hemat awal
                    height: { ideal: 360 },
                    frameRate: { ideal: 30 },
                    facingMode: "environment" 
                },
                audio: false
            });
            if (videoElement) videoElement.srcObject = localStream;
            statusText = 'Kamera siap, silakan masukkan ID Dashboard.';
        } catch (err) {
            statusText = 'Gagal akses kamera: ' + err.message;
        }
    }

    async function applyVideoConstraints(constraints) {
        if (!localStream) return;
        const videoTrack = localStream.getVideoTracks()[0];
        try {
            await videoTrack.applyConstraints(constraints);
        } catch (err) {
            console.error("Gagal mengubah resolusi:", err);
        }
    }

    function toggleCamera() {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            isCameraOn = videoTrack.enabled;
        }
    }

    function startStream() {
        if (!targetPeerId) return alert('Masukkan ID Dashboard!');

        statusText = 'Menghubungkan...';
        const call = peer.call(targetPeerId, localStream);

        if (call) {
            isConnected = true;
            statusText = 'Berhasil terhubung ke Dashboard!';
            
            // Mengirim sinyal HD pertama kali saat koneksi dibuat
            const conn = peer.connect(targetPeerId);
            conn.on('open', () => conn.send('SET_HD'));
        } else {
            statusText = 'Gagal terhubung.';
        }

        call.on('error', (err) => {
            isConnected = false;
            statusText = 'Error: ' + err.message;
        });
    }

    // Fungsi Scan QR
    function startScan() {
        if (!scanSupported) return;
        if (!videoElement) return;

        scanning = true;
        const detector = new BarcodeDetector({ formats: ['qr_code'] });
        const loop = async () => {
            if (!scanning) return;
            try {
                const codes = await detector.detect(videoElement);
                if (codes.length > 0) {
                    targetPeerId = codes[0].rawValue;
                    statusText = `ID terdeteksi: ${targetPeerId}`;
                    stopScan();
                    return;
                }
            } catch (e) {}
            scanLoopId = requestAnimationFrame(loop);
        };
        loop();
    }

    function stopScan() {
        scanning = false;
        if (scanLoopId) cancelAnimationFrame(scanLoopId);
    }
</script>

<div class="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center gap-6">
    <div class="w-full max-w-sm flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Status</span>
        <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full {isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}"></div>
            <span class="text-sm font-semibold">{isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
        </div>
    </div>

    <div class="w-full max-w-sm aspect-video bg-black rounded-xl overflow-hidden border-2 {isConnected ? 'border-green-500' : scanning ? 'border-cyan-400' : 'border-slate-700'} relative transition-colors">
        <video bind:this={videoElement} autoplay playsinline muted class="w-full h-full object-cover"></video>
        {#if scanning}
            <div class="absolute inset-8 border-2 border-cyan-400/70 rounded-lg pointer-events-none animate-pulse"></div>
        {/if}
    </div>

    <p class="text-center text-xs text-slate-400">{statusText}</p>

    <button onclick={toggleCamera} class="w-full max-w-sm {isCameraOn ? 'bg-red-600' : 'bg-green-600'} font-bold py-3 rounded-lg transition-colors">
        {isCameraOn ? 'Matikan Kamera' : 'Hidupkan Kamera'}
    </button>

    <div class="w-full max-w-sm flex gap-2">
        <input type="text" bind:value={targetPeerId} placeholder="ID Dashboard" class="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-center outline-none focus:border-blue-500" />
        <button onclick={scanning ? stopScan : startScan} class="px-4 rounded-lg {scanning ? 'bg-amber-600' : 'bg-cyan-600'} font-bold text-xs uppercase tracking-wide">
            {scanning ? 'Batal' : 'Scan QR'}
        </button>
    </div>

    <button onclick={startStream} disabled={isConnected} class="w-full max-w-sm {isConnected ? 'bg-slate-600' : 'bg-blue-600'} font-bold py-3 rounded-lg">
        {isConnected ? 'Sedang Streaming' : 'Mulai Transmisi'}
    </button>
</div>