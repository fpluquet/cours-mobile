import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import { nextTick, onMounted } from 'vue'
import './mermaid.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    if (inBrowser) {
      router.onAfterRouteChanged = async () => {
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 100))
        initMermaid()
      }
    }
  },
  setup() {
    if (inBrowser) {
      onMounted(async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
        initMermaid()
      })
    }
  }
}

let mermaidInstance = null

async function initMermaid() {
  try {
    if (!mermaidInstance) {
      const mermaid = await import('mermaid')
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
      mermaidInstance = mermaid.default
    }

    // Traiter tous les diagrammes Mermaid
    const diagrams = document.querySelectorAll('.mermaid-diagram:not([data-processed])')
    
    for (let i = 0; i < diagrams.length; i++) {
      const diagram = diagrams[i]
      const code = decodeURIComponent(diagram.getAttribute('data-mermaid'))
      
      try {
        const id = `mermaid-${Date.now()}-${i}`
        const { svg } = await mermaidInstance.render(id, code)
        
        const container = document.createElement('div')
        container.className = 'mermaid-container'
        container.innerHTML = svg
        
        diagram.parentNode.replaceChild(container, diagram)
        
      } catch (error) {
        console.error('Erreur Mermaid:', error)
        diagram.innerHTML = `
          <div class="mermaid-error">
            <strong>❌ Erreur Mermaid:</strong> ${error.message}
            <details>
              <summary>Code source</summary>
              <pre><code>${code}</code></pre>
            </details>
          </div>
        `
        diagram.setAttribute('data-processed', 'error')
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement de Mermaid:', error)
  }
}