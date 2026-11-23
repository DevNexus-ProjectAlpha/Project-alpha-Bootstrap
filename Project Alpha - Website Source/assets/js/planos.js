// Alterna os valores dos planos entre mensal e anual na página inicial.
// O desconto do anual é o mesmo da matrícula (PERIODOS.anual em matricula.js): 15% em 12 meses.
var MESES_ANUAL = 12;
var DESCONTO_ANUAL = 15;
var ALPHA_PASS_MENSAL = 3990;

// 129990 -> "R$ 1.299,90"
function formatarMoeda(centavos) {
    return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// valor de 12 meses já com o desconto (em centavos)
function valorAnual(mensal) {
    return Math.round(mensal * MESES_ANUAL * (100 - DESCONTO_ANUAL) / 100);
}

function mostrarPeriodo(periodo) {
    let anual = periodo == 'anual';

    for (let botao of document.querySelectorAll('.alternar-periodo button')) {
        let ativo = botao.dataset.periodo == periodo;
        botao.classList.toggle('ativo', ativo);
        botao.setAttribute('aria-pressed', ativo);
    }

    for (let preco of document.querySelectorAll('#planos .price[data-mensal]')) {
        let mensal = Number(preco.dataset.mensal);
        let cabecalho = preco.parentElement;
        let validade = cabecalho.querySelector('.validity');
        let equivalente = cabecalho.querySelector('.equivalente');

        if (anual) {
            let total = valorAnual(mensal);
            preco.textContent = formatarMoeda(total);
            validade.textContent = '/por ano';
            equivalente.innerHTML = `${formatarMoeda(Math.round(total / MESES_ANUAL))}/mês · <strong>economize ${formatarMoeda(mensal * MESES_ANUAL - total)}</strong>`;
        } else {
            preco.textContent = formatarMoeda(mensal);
            validade.textContent = '/por mês';
            equivalente.innerHTML = '';
        }
    }

    for (let item of document.querySelectorAll('#planos .valor-alpha-pass'))
        item.textContent = anual ? `+ ${formatarMoeda(valorAnual(ALPHA_PASS_MENSAL))}/ano` : `+ ${formatarMoeda(ALPHA_PASS_MENSAL)}/mês`;

    // "Escolher plano" leva o período junto: cadastro.html?pacote=fit&periodo=anual#plano
    for (let link of document.querySelectorAll('#planos .package-box .button a')) {
        let url = new URL(link.getAttribute('href'), window.location.href);
        if (anual)
            url.searchParams.set('periodo', 'anual');
        else
            url.searchParams.delete('periodo');
        link.setAttribute('href', `cadastro.html${url.search}${url.hash}`);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    for (let botao of document.querySelectorAll('.alternar-periodo button'))
        botao.addEventListener('click', function () {
            mostrarPeriodo(this.dataset.periodo);
        }, false);
}, false);
