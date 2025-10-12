<template>
  <div ref="mermaidDiv" class="mermaid-container" v-html="svgContent"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  }
})

const mermaidDiv = ref(null)
const svgContent = ref('')

const renderMermaid = async () => {
  try {
    // Import dynamique de Mermaid
    const mermaid = await import('mermaid')
    
    // Configuration de Mermaid
    mermaid.default.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#3eaf7c',
        primaryTextColor: '#2c3e50',
        primaryBorderColor: '#3eaf7c',
        lineColor: '#3eaf7c',
        secondaryColor: '#f0f0f0',
        tertiaryColor: '#fff'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      },
      sequence: {
        useMaxWidth: true
      }
    })

    // Nettoyer le code
    let cleanCode = props.code.trim()
    if (cleanCode.startsWith('mermaid')) {
      cleanCode = cleanCode.replace(/^mermaid\s*/, '').trim()
    }

    // Générer un ID unique
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Rendu du diagramme
    const { svg } = await mermaid.default.render(id, cleanCode)
    svgContent.value = svg
    
  } catch (error) {
    console.error('Erreur Mermaid:', error)
    svgContent.value = `
      <div class="mermaid-error">
        <strong>Erreur Mermaid:</strong> ${error.message}
        <details style="margin-top: 10px;">
          <summary>Code source</summary>
          <pre style="background: #f0f0f0; padding: 10px; border-radius: 4px; margin-top: 5px;"><code>${props.code}</code></pre>
        </details>
      </div>
    `
  }
}

onMounted(() => {
  renderMermaid()
})

watch(() => props.code, () => {
  renderMermaid()
})
</script>

<style scoped>
.mermaid-container {
  margin: 20px 0;
  text-align: center;
  overflow-x: auto;
}

.mermaid-container :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>