/**
 * AI Engine Cross-Site Chatbot Embed Script
 * This script allows external websites to embed AI Engine chatbots
 */

(function() {
  'use strict';

  // Avoid multiple initializations
  if (window.MwaiChatbot) {
    return;
  }

  const MwaiChatbot = {
    instances: {},
    loaded: false,
    loading: false,
    baseUrl: '',

    /**
     * Initialize a Cross-Site chatbot
     * @param {Object} config - Configuration object
     * @param {string} config.botId - The chatbot ID
     * @param {string|HTMLElement} config.container - Container selector or element
     */
    init: async function(config) {
      if (!config.botId) {
        console.error('MwaiChatbot: botId is required');
        return;
      }

      // Extract base URL from current script
      if (!this.baseUrl) {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const src = scripts[i].src;
          // Look for any script ending with /app/embed.js in a plugins folder
          if (src && src.includes('/wp-content/plugins/') && src.includes('/app/embed.js')) {
            // Extract the base URL (site root) from the script path
            this.baseUrl = src.replace(/\/wp-content\/plugins\/[^\/]+\/app\/embed\.js.*$/, '');
            break;
          }
        }
      }

      if (!this.baseUrl) {
        console.error('MwaiChatbot: Could not determine WordPress site URL');
        return;
      }

      // Generate unique instance ID
      const instanceId = 'mwai-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      // Store instance config
      this.instances[instanceId] = {
        config: config,
        loaded: false
      };

      try {
        // First get the config to know the plugin URL
        const configUrl = this.baseUrl + '/wp-json/mwai-ui/v1/cross-site/config?botId=' + config.botId;
        const configResponse = await fetch(configUrl, {
          method: 'GET'
        });
        
        if (!configResponse.ok) {
          const error = await configResponse.json();
          throw new Error(error.message || 'Failed to load configuration');
        }
        
        const configData = await configResponse.json();
        
        // Load required scripts and styles if not already loaded
        await this.loadDependencies(configData.pluginUrl);

        // Authenticate with the WordPress site
        const authData = await this.authenticate(config);
        
        // Create the chatbot container
        const container = this.getContainer(config.container);
        if (!container) {
          throw new Error('Container element not found');
        }

        // Add cross-site specific data attributes
        container.setAttribute('data-mwai-cross-site', 'true');
        container.setAttribute('data-mwai-origin', window.location.origin);
        
        // Render the chatbot with config data
        this.renderChatbot(instanceId, container, config, authData, configData);
        
      } catch (error) {
        console.error('MwaiChatbot initialization failed:', error);
        this.handleError(instanceId, error.message);
      }
    },

    /**
     * Get container element
     */
    getContainer: function(container) {
      if (typeof container === 'string') {
        const element = document.querySelector(container);
        if (!element) {
          alert('AI Engine Cross-Site Error: Container element not found: ' + container + 
                '\n\nPlease make sure the container exists on your page or remove the container parameter to use popup mode.');
          throw new Error('Container element not found: ' + container);
        }
        return element;
      } else if (container instanceof HTMLElement) {
        return container;
      } else {
        // No container specified - create one for popup mode
        const div = document.createElement('div');
        div.className = 'mwai-chatbot-container mwai-chatbot-popup-container';
        div.style.position = 'fixed';
        div.style.bottom = '0';
        div.style.right = '0';
        div.style.zIndex = '9999';
        document.body.appendChild(div);
        return div;
      }
    },

    /**
     * Load required dependencies
     */
    loadDependencies: async function(pluginUrl) {
      if (this.loaded || this.loading) {
        // Wait if already loading
        while (this.loading) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return;
      }

      this.loading = true;

      try {
        // Load React and ReactDOM first if not already present
        if (!window.React) {
          await this.loadScript('https://unpkg.com/react@18/umd/react.production.min.js');
        }
        if (!window.ReactDOM) {
          await this.loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
        }

        // Make React available globally (required by webpack externals)
        window.React = window.React || window.react;
        window.ReactDOM = window.ReactDOM || window.reactDOM;

        // Make React available to WordPress scripts with render function
        window.wp = window.wp || {};
        
        // For React 18, we need to use the legacy render for backward compatibility
        const legacyRender = (element, container) => {
          // Check if we should use createRoot (React 18) or legacy render
          if (window.ReactDOM.createRoot) {
            const root = window.ReactDOM.createRoot(container);
            root.render(element);
          } else {
            window.ReactDOM.render(element, container);
          }
        };
        
        window.wp.element = {
          ...window.React,
          render: legacyRender,
          createRoot: window.ReactDOM.createRoot,
          unmountComponentAtNode: window.ReactDOM.unmountComponentAtNode
        };

        // Now load chatbot JavaScript (which depends on React)
        // Use the pluginUrl from the server if available
        let chatbotUrl;
        if (pluginUrl) {
          chatbotUrl = pluginUrl + '/app/chatbot.js';
        } else {
          // Fallback: try to derive from the current script's path
          const currentScript = document.currentScript || 
            Array.from(document.scripts).find(s => s.src.includes('/app/embed.js'));
          if (currentScript && currentScript.src) {
            chatbotUrl = currentScript.src.replace('/app/embed.js', '/app/chatbot.js');
          } else {
            // Last resort fallback
            console.warn('Could not determine plugin URL, using default path');
            chatbotUrl = this.baseUrl + '/wp-content/plugins/ai-engine-pro/app/chatbot.js';
          }
        }
        await this.loadScript(chatbotUrl);

        this.loaded = true;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },

    /**
     * Load a script dynamically
     */
    loadScript: function(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load script: ' + src));
        document.head.appendChild(script);
      });
    },

    /**
     * Load a stylesheet dynamically
     */
    loadStyle: function(href) {
      return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = () => reject(new Error('Failed to load stylesheet: ' + href));
        document.head.appendChild(link);
      });
    },

    /**
     * Authenticate with WordPress site
     */
    authenticate: async function(config) {
      const authUrl = this.baseUrl + '/wp-json/mwai-ui/v1/cross-site/auth';
      
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: config.botId,
          origin: window.location.origin
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }

      const data = await response.json();
      return data;
    },

    /**
     * Render the chatbot
     */
    renderChatbot: async function(instanceId, container, config, authData, configData) {
      const instance = this.instances[instanceId];
      
      try {
        // Use the configData we already fetched
        const data = configData;
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to load chatbot configuration');
        }

        // Load theme CSS
        // Use themeCssUrl if provided (supports custom themes), otherwise fall back to physical file
        if (data.themeCssUrl) {
          await this.loadStyle(data.themeCssUrl);
        } else if (data.theme && data.pluginUrl) {
          await this.loadStyle(data.pluginUrl + '/themes/' + data.theme + '.css');
        }

        // Prepare system data
        const system = {
          botId: config.botId,
          customId: null,
          userData: authData.userData || {},
          sessionId: authData.sessionId,
          restNonce: authData.nonce,
          contextId: null,
          pluginUrl: data.pluginUrl,
          restUrl: data.restUrl,
          stream: data.stream || false,
          debugMode: false,
          eventLogs: false,
          speech_recognition: data.speech_recognition || false,
          speech_synthesis: false,
          typewriter: data.typewriter || false,
          virtual_keyboard_fix: false,
          crossSite: true,
          origin: window.location.origin,
          actions: data.actions || [],
          blocks: data.blocks || [],
          shortcuts: data.shortcuts || []
        };

        // Prepare params (these should come from the server based on botId)
        const params = data.params || {};

        // Prepare theme
        const theme = data.themeData || null;

        // Create data attributes
        // No need for HTML encoding since we're setting attributes via JavaScript
        container.className = 'mwai-chatbot-container';
        container.setAttribute('data-params', JSON.stringify(params));
        container.setAttribute('data-system', JSON.stringify(system));
        container.setAttribute('data-theme', JSON.stringify(theme));

        // Add crossSite flag to the container
        container.setAttribute('data-mwai-cross-site', 'true');

        // Initialize the chatbot
        if (window.mwaiInitialize) {
          window.mwaiInitialize();
        }

        instance.loaded = true;
        instance.container = container;

        // Call onReady callback if provided
        if (config.onReady) {
          config.onReady();
        }
      } catch (error) {
        console.error('Failed to render chatbot:', error);
        this.handleError(instanceId, error.message);
      }
    },

    /**
     * Handle initialization errors
     */
    handleError: function(instanceId, message) {
      const instance = this.instances[instanceId];
      if (instance && instance.config.onError) {
        instance.config.onError(message);
      } else {
        console.error('MwaiChatbot Error:', message);
      }
    }
  };

  // Expose to global scope
  window.MwaiChatbot = MwaiChatbot;

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('[data-mwai-chatbot]');
    elements.forEach(function(element) {
      const config = {
        botId: element.getAttribute('data-mwai-chatbot'),
        container: element
      };

      MwaiChatbot.init(config);
    });
  });

})();