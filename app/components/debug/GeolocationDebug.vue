<template>
  <div
    v-if="debugStore.visible"
    class="fixed top-0 left-0 right-0 z-[9999] bg-black/95 text-white p-4 max-h-[50vh] overflow-y-auto text-xs font-mono"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/20">
      <h3 class="font-bold text-sm">🔍 Debug Géolocalisation</h3>
      <button
        @click="debugStore.toggleVisibility()"
        class="px-2 py-1 bg-red-500 rounded text-xs"
      >
        Fermer
      </button>
    </div>

    <!-- Context Info -->
    <div class="mb-3 p-2 bg-blue-900/50 rounded">
      <div class="font-bold mb-1">📋 Contexte</div>
      <div>Protocol: <span class="text-green-400">{{ protocol }}</span></div>
      <div>Host: <span class="text-green-400">{{ host }}</span></div>
      <div>HTTPS: <span :class="isHTTPS ? 'text-green-400' : 'text-red-400'">{{ isHTTPS ? '✅' : '❌' }}</span></div>
      <div>Navigator.geolocation: <span :class="hasGeolocation ? 'text-green-400' : 'text-red-400'">{{ hasGeolocation ? '✅' : '❌' }}</span></div>
      <div>User Agent: <span class="text-gray-400 text-[10px]">{{ userAgent }}</span></div>
    </div>

    <!-- Logs -->
    <div class="space-y-1">
      <div class="font-bold mb-2">📝 Logs ({{ debugStore.logs.length }})</div>
      <div
        v-for="(log, index) in debugStore.logs"
        :key="index"
        :class="[
          'p-2 rounded',
          log.type === 'error' ? 'bg-red-900/50 text-red-200' :
          log.type === 'warning' ? 'bg-yellow-900/50 text-yellow-200' :
          log.type === 'success' ? 'bg-green-900/50 text-green-200' :
          'bg-gray-800/50'
        ]"
      >
        <div class="flex items-start gap-2">
          <span class="shrink-0">
            {{ log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : log.type === 'success' ? '✅' : 'ℹ️' }}
          </span>
          <div class="flex-1">
            <div class="font-bold">{{ log.timestamp }}</div>
            <div class="mt-1">{{ log.message }}</div>
            <div v-if="log.data" class="mt-1 text-gray-400 text-[10px]">
              {{ JSON.stringify(log.data, null, 2) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="mt-3 flex gap-2">
      <button
        @click="copyLogs"
        :class="[
          'flex-1 py-2 rounded text-xs font-bold transition-colors',
          copied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-500'
        ]"
      >
        {{ copied ? '✅ Copié !' : '📋 Copier les logs' }}
      </button>
      <button
        @click="debugStore.clearLogs()"
        class="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs"
      >
        Effacer les logs
      </button>
    </div>
  </div>

  <!-- Toggle button (always visible) -->
  <button
    v-if="!debugStore.visible"
    @click="debugStore.toggleVisibility()"
    class="fixed top-4 right-4 z-[9998] bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg font-bold"
  >
    🔍
  </button>
</template>

<script setup lang="ts">
const debugStore = useGeolocationDebugStore();
const copied = ref(false);

const protocol = computed(() => process.client ? window.location.protocol : '');
const host = computed(() => process.client ? window.location.host : '');
const isHTTPS = computed(() => protocol.value === 'https:' || host.value.includes('localhost'));
const hasGeolocation = computed(() => process.client && 'geolocation' in navigator);
const userAgent = computed(() => process.client ? navigator.userAgent : '');

const copyLogs = async () => {
  if (!process.client) return;

  try {
    // Formater les logs pour copie
    const timestamp = new Date().toLocaleString('fr-FR');
    let text = `=== 🔍 Debug Géolocalisation ===\n`;
    text += `Date: ${timestamp}\n\n`;

    text += `=== CONTEXTE ===\n`;
    text += `Protocol: ${protocol.value}\n`;
    text += `Host: ${host.value}\n`;
    text += `HTTPS: ${isHTTPS.value ? '✅ Oui' : '❌ Non'}\n`;
    text += `Navigator.geolocation: ${hasGeolocation.value ? '✅ Disponible' : '❌ Non disponible'}\n`;
    text += `User Agent: ${userAgent.value}\n\n`;

    text += `=== LOGS (${debugStore.logs.length} entrées) ===\n\n`;

    // Inverser les logs pour avoir le plus ancien en premier
    const logsReversed = [...debugStore.logs].reverse();

    logsReversed.forEach((log) => {
      const icon = log.type === 'error' ? '❌' :
                   log.type === 'warning' ? '⚠️' :
                   log.type === 'success' ? '✅' : 'ℹ️';

      text += `[${log.timestamp}] ${icon} ${log.message}\n`;

      if (log.data) {
        text += `Data: ${JSON.stringify(log.data, null, 2)}\n`;
      }

      text += `\n`;
    });

    // Copier dans le presse-papiers
    await navigator.clipboard.writeText(text);

    // Feedback visuel
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Erreur lors de la copie des logs:', error);
  }
};
</script>
