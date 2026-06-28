<script>
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Peer from 'peerjs';

    let myPeerId = $state(null);
    let streams = $state({}); // Menyimpan objek stream: { peerId: stream }
    let activePeerId = $state(null); // ID kamera yang sedang full screen
    let peer;

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
                
                // Secara default: jika belum ada yang full screen, jadikan yang pertama terhubung full screen
                if (!activePeerId) activePeerId = call.peer;
            });
            
            call.on('close', () => {
                delete streams[call.peer];
                if (activePeerId === call.peer) {
                    activePeerId = Object.keys(streams)[0] || null;
                }
            });
        });

        return () => { if (peer) peer.destroy(); };
    });

    // FUNGSI TUKAR: Mengganti kamera full screen dengan yang diklik
    function swapCamera(id) {
        activePeerId = id;
    }
</script>

<div class="fixed inset-0 w-full h-full bg-black">
    
    <!-- LAYAR UTAMA (FULL SCREEN) -->
    {#if activePeerId && streams[activePeerId]}
        <video 
            srcObject={streams[activePeerId]} 
            autoplay playsinline muted
            class="w-full h-full object-cover"
        ></video>
    {:else}
        <div class="absolute inset-0 top-[-110px] flex flex-col items-center justify-center text-white/50">
            <p>Menunggu Koneksi Kamera...</p>
            <p class="mt-4 font-mono">Peer ID: {myPeerId || '...'}</p>
        </div>
    {/if}

    <!-- PREVIEW GRID (HANYA MENAMPILKAN YANG TIDAK SEDANG FULL SCREEN) -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {#each Object.keys(streams) as id}
            {#if id !== activePeerId}
                <button 
                    onclick={() => swapCamera(id)}
                    class="w-32 h-20 bg-slate-900 rounded-lg overflow-hidden border-2 border-white/20 hover:border-blue-500 transition-all shadow-lg"
                >
                    <video 
                        srcObject={streams[id]} 
                        autoplay muted playsinline 
                        class="w-full h-full object-cover"
                    ></video>
                </button>
            {/if}
        {/each}
    </div>
</div>