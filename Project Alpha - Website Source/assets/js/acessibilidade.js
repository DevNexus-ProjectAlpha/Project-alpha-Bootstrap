// Widget de acessibilidade (github.com/sinanisler/accessibility-widget)
// O arquivo do widget fica em assets/js/accessibility-widget/ para funcionar sem internet.
// O VLibras (Libras, governo federal) é incluído direto no HTML de cada página.

(function () {
    // abre em português na primeira visita (depois respeita o idioma que a pessoa escolher no widget)
    try {
        if (!localStorage.getItem('accessibilityWidgetLanguage'))
            localStorage.setItem('accessibilityWidgetLanguage', 'pt');
    } catch (e) { }

    // cores da Project Alpha
    window.ACCESSIBILITY_WIDGET_CONFIG = {
        colors: {
            primary: '#C1121F',
            secondary: '#ffffff',
            optionBg: '#ffffff',
            optionText: '#1f1f1f',
            optionIcon: '#C1121F'
        },
        // canto inferior direito; o botão do VLibras fica no meio da lateral direita
        widgetPosition: {
            side: 'right',
            right: '20px',
            bottom: '20px'
        }
    };

    // carrega o widget a partir da mesma pasta deste arquivo (funciona em qualquer página)
    var atual = document.currentScript ? document.currentScript.src : 'assets/js/acessibilidade.js';
    var pasta = atual.substring(0, atual.lastIndexOf('/') + 1);
    var script = document.createElement('script');
    script.src = pasta + 'accessibility-widget/widget.js';
    document.body.appendChild(script);
})();
