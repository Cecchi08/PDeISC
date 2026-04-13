// Componente: usa el módulo URL nativo de Node.js

export function analizarURL(urlString) {
    try {
      const miURL = new URL(urlString);
  
      const resultado = {
        urlCompleta:  miURL.href,
        protocolo:    miURL.protocol,
        host:         miURL.host,
        hostname:     miURL.hostname,
        puerto:       miURL.port || '(predeterminado)',
        pathname:     miURL.pathname,
        busqueda:     miURL.search || '(ninguna)',
        hash:         miURL.hash  || '(ninguno)',
        params:       {}
      };
  
      miURL.searchParams.forEach((valor, clave) => {
        resultado.params[clave] = valor;
      });
  
      console.log('\n========== [ MÓDULO URL - ANÁLISIS ] ==========');
      console.log('URL completa :', resultado.urlCompleta);
      console.log('Protocolo    :', resultado.protocolo);
      console.log('Host         :', resultado.host);
      console.log('Hostname     :', resultado.hostname);
      console.log('Puerto       :', resultado.puerto);
      console.log('Path         :', resultado.pathname);
      console.log('Search       :', resultado.busqueda);
      console.log('Hash         :', resultado.hash);
      console.log('Params       :', resultado.params);
  
      return resultado;
  
    } catch (error) {
      console.error('[URL] Error al parsear la URL:', error.message);
      return null;
    }
  }
  