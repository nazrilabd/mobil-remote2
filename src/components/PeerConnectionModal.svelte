<script>
    import { myPeerId } from '$lib/stores/peerStore'; // Import store
    
    // Props untuk fungsi pendukung
    let { copyPeerId, copied, qrUrl } = $props();
    
    let showIdPanel = $state(false);
</script>

<!-- TOMBOL -->
<button 
    onclick={() => (showIdPanel = true)} 
    class="px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-lg border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase hover:border-cyan-400 transition-colors"
>
    Info ID
</button>

<!-- MODAL -->
{#if showIdPanel}
    <div 
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        role="dialog"
        onclick={() => (showIdPanel = false)}
    >
        <div 
            class="relative w-[300px] bg-slate-900 border border-cyan-500/25 rounded-xl p-6 flex flex-col items-center gap-4"
            onclick={(e) => e.stopPropagation()}
        >
            <button 
                onclick={() => (showIdPanel = false)} 
                class="absolute top-2 right-2 text-slate-500 hover:text-white"
            >✕</button>

            <!-- Menggunakan $myPeerId untuk mengakses nilai dari store -->
            {#if $myPeerId}
                <img src={qrUrl($myPeerId)} alt="QR" class="w-24 h-24 rounded-md border border-cyan-500/20" />
                <p class="text-[10px] text-cyan-300 font-mono break-all text-center">{$myPeerId}</p>
                
                <button 
                    onclick={copyPeerId} 
                    class="w-full text-[10px] font-mono uppercase py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
                >
                    {copied ? 'Tersalin ✓' : 'Salin ID'}
                </button>
            {:else}
                <p class="text-xs text-slate-500">Menghubungkan...</p>
            {/if}
        </div>
    </div>
{/if}