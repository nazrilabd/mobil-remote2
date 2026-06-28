<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Peer from 'peerjs';

    let myPeerId = $state(null);
    let streams = $state({});     
    let activePeerId = $state(null);
    let peer;

    // ---- panel ID (show/hide) ----
    let showIdPanel = $state(false);
    let copied = $state(false);

    onMount(() => {
        if (browser) myPeerId = localStorage.getItem('dashboardPeerId');
        peer = new Peer(myPeerId || undefined);

        peer.on('open', (id) => {
            myPeerId = id;
            if (browser) localStorage.setItem('dashboardPeerId', id);
        });

        peer.on('call', (call) => {
            call.answer();
            call.on('stream', (remoteStream) => {
                streams[call.peer] = remoteStream;
                
                // Default: Kamera pertama langsung HD
                if (!activePeerId) {
                    activePeerId = call.peer;
                    sendQualityCommand(call.peer, 'SET_HD');
                } else {
                    // Kamera baru masuk langsung jadi SD agar hemat
                    sendQualityCommand(call.peer, 'SET_SD');
                }
            });

            call.on('close', () => {
                delete streams[call.peer];
                if (activePeerId === call.peer) {
                    activePeerId = Object.keys(streams)[0] || null;
                    if (activePeerId) sendQualityCommand(activePeerId, 'SET_HD');
                }
            });
        });

        return () => { if (peer) peer.destroy(); };
    });

    // FUNGSI PENGIRIM PERINTAH HD/SD
    function sendQualityCommand(peerId, command) {
        const conn = peer.connect(peerId);
        conn.on('open', () => {
            conn.send(command);
        });
    }

    function swapCamera(id) {
        // 1. Kamera lama jadi SD
        if (activePeerId) sendQualityCommand(activePeerId, 'SET_SD');
        
        // 2. Kamera baru jadi HD
        activePeerId = id;
        sendQualityCommand(activePeerId, 'SET_HD');
    }

    function copyPeerId() {
        if (!myPeerId || !browser) return;
        navigator.clipboard.writeText(myPeerId).then(() => {
            copied = true;
            setTimeout(() => (copied = false), 1500);
        });
    }

    function qrUrl(data, size = 180) {
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&qzone=1&color=22-211-238&bgcolor=0-0-0&data=${encodeURIComponent(data)}`;
    }
</script>

<div class="fixed inset-0 w-full h-full bg-black">
    <!-- LAYAR UTAMA -->
    {#if activePeerId && streams[activePeerId]}
        <video srcObject={streams[activePeerId]} autoplay playsinline muted class="w-full h-full object-cover"></video>
    {:else}
        <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 font-mono">
            <div class="w-2 h-2 rounded-full bg-cyan-500 animate-ping mb-4"></div>
            <p class="text-xs uppercase tracking-[0.3em] text-cyan-500/70">Menunggu Sinyal Kamera</p>
        </div>
    {/if}

    <!-- PREVIEW GRID -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {#each Object.keys(streams) as id, i}
            {#if id !== activePeerId}
                <button onclick={() => swapCamera(id)} class="relative w-28 h-[70px] bg-slate-900 rounded-md overflow-hidden border border-cyan-500/30 hover:border-cyan-400 transition-all group">
                    <video srcObject={streams[id]} autoplay muted playsinline class="w-full h-full object-cover opacity-85 group-hover:opacity-100"></video>
                    <span class="absolute top-1 left-1.5 text-[8px] font-mono uppercase text-cyan-300 bg-black/50 px-1 rounded-sm">CAM {i + 1}</span>
                </button>
            {/if}
        {/each}
    </div>

    <!-- ... (Sisanya kode panel ID dan Modal Anda tetap sama) ... -->
    <div class="absolute top-20 right-4 z-40">
        <button onclick={() => (showIdPanel = !showIdPanel)} class="px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-lg border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase hover:border-cyan-400 transition-colors">
            {showIdPanel ? 'Sembunyikan ID' : 'Tampilkan ID'}
        </button>
    </div>

  {#if showIdPanel}
        <!-- Overlay -->
        <div 
            class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center w-full h-full"
            role="dialog"
            aria-modal="true"
            onclick={() => (showIdPanel = false)}
            onkeydown={(e) => { if (e.key === 'Escape') showIdPanel = false; }}
            tabindex="0"
        >
            <!-- Konten Modal -->
            <div 
                class="w-56 bg-slate-900/95 border border-cyan-500/25 rounded-xl p-4 flex flex-col items-center gap-3 relative" 
                role="presentation"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
            >
                <!-- TOMBOL CLOSE KEMBALI -->
                <button 
                    type="button"
                    onclick={() => (showIdPanel = false)}
                    class="absolute top-2 right-2 text-slate-500 hover:text-white text-xs p-1"
                    aria-label="Tutup"
                >
                    ✕
                </button>

                <img src={qrUrl(myPeerId)} alt="QR" class="w-32 h-32 rounded-md border border-cyan-500/20" />
                <p class="text-[11px] text-cyan-300 font-mono break-all text-center">{myPeerId}</p>
                
                <button 
                    type="button"
                    onclick={copyPeerId} 
                    class="w-full text-[10px] font-mono uppercase py-1.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
                >
                    {copied ? 'Tersalin ✓' : 'Salin ID'}
                </button>
            </div>
        </div>
    {/if}
</div>