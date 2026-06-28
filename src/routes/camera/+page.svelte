<script>
    import { onMount } from 'svelte';
    import Peer from 'peerjs';

    let targetPeerId = $state('');
    let statusText = $state('Menunggu input ID...');
    let isConnected = $state(false); // Status koneksi
    let videoElement = $state();
    let isCameraOn = $state(true);
    
    let peer;
    let localStream;

    onMount(async () => {
        peer = new Peer();
        await startCamera();
    });

    async function startCamera() {
        try {
            localStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }, 
                audio: false
            });
            if (videoElement) videoElement.srcObject = localStream;
            statusText = 'Kamera siap, silakan masukkan ID Dashboard.';
        } catch (err) {
            statusText = 'Gagal akses kamera: ' + err.message;
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
        
        // Memantau apakah panggilan berhasil
        if (call) {
            isConnected = true;
            statusText = 'Berhasil terhubung ke Dashboard!';
        } else {
            statusText = 'Gagal terhubung.';
        }

        call.on('error', (err) => {
            isConnected = false;
            statusText = 'Error: ' + err.message;
        });
    }
</script>

<div class="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center gap-6">
    
    <!-- Status Bar -->
    <div class="w-full max-w-sm flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700">
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Status</span>
        <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full {isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}"></div>
            <span class="text-sm font-semibold">{isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
        </div>
    </div>

    <div class="w-full max-w-sm aspect-video bg-black rounded-xl overflow-hidden border-2 {isConnected ? 'border-green-500' : 'border-slate-700'} relative transition-colors">
        <video bind:this={videoElement} autoplay playsinline muted class="w-full h-full object-cover"></video>
    </div>

    <p class="text-center text-xs text-slate-400">{statusText}</p>

    <div class="w-full max-w-sm flex gap-2">
        <button 
            onclick={toggleCamera}
            class="flex-1 {isCameraOn ? 'bg-red-600' : 'bg-green-600'} font-bold py-3 rounded-lg transition-colors"
        >
            {isCameraOn ? 'Matikan Kamera' : 'Hidupkan Kamera'}
        </button>
    </div>

    <input 
        type="text" 
        bind:value={targetPeerId} 
        placeholder="Masukkan Peer ID Dashboard" 
        class="w-full max-w-sm bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-center outline-none focus:border-blue-500" 
    />
    
    <button 
        onclick={startStream} 
        disabled={isConnected}
        class="w-full max-w-sm {isConnected ? 'bg-slate-600' : 'bg-blue-600'} font-bold py-3 rounded-lg transition-colors"
    >
        {isConnected ? 'Sedang Streaming' : 'Mulai Transmisi'}
    </button>
</div>