// Valores conforme o Anexo I do ERS (Documentos 01 e 03).
// Os valores ficam em centavos para não ter erro de arredondamento (129,90 = 12990).
var MENSALIDADE_BASE = 12990;

// todos os pacotes incluem musculação; eles se diferenciam pelos benefícios
// alphaPass: true = incluso no pacote; false = pode ser contratado como adicional
var PACOTES = {
    start:       { nome: 'Start',       acrescimo: 0,    alphaPass: false },
    fit:         { nome: 'Fit',         acrescimo: 2990, alphaPass: false },
    performance: { nome: 'Performance', acrescimo: 5990, alphaPass: true },
    full:        { nome: 'Full',        acrescimo: 8990, alphaPass: true }
};

// aulas com professor, contratadas à parte (valor mensal em centavos)
var AULAS = {
    funcional: { nome: 'Treinamento Funcional', valor: 4990 },
    spinning:  { nome: 'Spinning',              valor: 4990 },
    danca:     { nome: 'Ritmos e Dança',        valor: 4990 },
    yoga:      { nome: 'Yoga',                  valor: 5990 },
    crossfit:  { nome: 'CrossFit',              valor: 7990 },
    pilates:   { nome: 'Pilates',               valor: 8990 }
};

// desconto nas aulas conforme a quantidade escolhida
function descontoAulas(qtd) {
    if (qtd >= 4) return 20;
    if (qtd == 3) return 15;
    if (qtd == 2) return 10;
    return 0;
}

// Alpha Pass (acesso a outras unidades e academias parceiras) como adicional mensal
var VALOR_ALPHA_PASS = 3990;

// desconto decorre da quantidade de meses (não é digitado)
var PERIODOS = {
    mensal:     { nome: 'Mensal',     meses: 1,  desconto: 0 },
    trimestral: { nome: 'Trimestral', meses: 3,  desconto: 5 },
    semestral:  { nome: 'Semestral',  meses: 6,  desconto: 10 },
    anual:      { nome: 'Anual',      meses: 12, desconto: 15 }
};

var DIAS_MAX_INICIO = 30;


// 37022 -> "R$ 370,22"
function moeda(centavos) {
    return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function dataISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatarDataBR(iso) {
    let p = iso.split('-');
    return `${p[2]}/${p[1]}/${p[0]}`;
}

// soma meses a uma data; se o dia não existir no mês final (ex.: 31/01 + 1 mês), usa o último dia do mês
function somarMeses(iso, meses) {
    let p = iso.split('-').map(Number);
    let ultimoDia = new Date(p[0], p[1] - 1 + meses + 1, 0).getDate();
    let d = new Date(p[0], p[1] - 1 + meses, Math.min(p[2], ultimoDia));
    return dataISO(d);
}

// valor do radio marcado em um grupo (ou '' se nenhum)
function valorMarcado(nome) {
    let marcado = document.querySelector(`input[name="${nome}"]:checked`);
    return marcado ? marcado.value : '';
}

// aulas marcadas (objetos de AULAS)
function aulasEscolhidas() {
    let lista = [];
    for (let ck of document.querySelectorAll('input[name="aulas"]:checked'))
        lista.push(AULAS[ck.value]);
    return lista;
}


// valor total = valor mensal x quantidade de meses x (1 - desconto)   (ERS, item 1.2)
function calcularMatricula() {
    let pacote = PACOTES[valorMarcado('pacote')];
    let periodo = PERIODOS[valorMarcado('periodo')];
    if (!pacote || !periodo) return null;

    // adicional do Alpha Pass só quando o pacote não inclui e o aluno marcou
    let adicionalAlphaPass = (!pacote.alphaPass && document.querySelector('#alphaPass').checked) ? VALOR_ALPHA_PASS : 0;
    // aulas adicionais: soma dos valores - desconto por quantidade
    let aulas = aulasEscolhidas();
    let aulasBruto = 0;
    for (let aula of aulas) aulasBruto += aula.valor;
    let pctAulas = descontoAulas(aulas.length);
    let aulasLiquido = Math.round(aulasBruto * (100 - pctAulas) / 100);

    let mensal = MENSALIDADE_BASE + pacote.acrescimo + adicionalAlphaPass + aulasLiquido;
    let subtotal = mensal * periodo.meses;
    let total = Math.round(subtotal * (100 - periodo.desconto) / 100);
    let inicio = document.querySelector('#dataInicio').value;

    return {
        pacote: pacote,
        periodo: periodo,
        mensal: mensal,
        adicionalAlphaPass: adicionalAlphaPass,
        alphaPass: pacote.alphaPass ? 'Incluso' : (adicionalAlphaPass > 0 ? 'Adicional' : 'Não contratado'),
        subtotal: subtotal,
        valorDesconto: subtotal - total,
        total: total,
        parcela: Math.round(total / periodo.meses),   // cobrança mensal já com desconto
        aulas: aulas,
        aulasBruto: aulasBruto,
        pctAulas: pctAulas,
        aulasLiquido: aulasLiquido,
        inicio: inicio,
        termino: inicio != '' ? somarMeses(inicio, periodo.meses) : ''
    };
}

// monta as linhas do resumo (usado no formulário e no modal de pagamento)
function htmlResumo(m) {
    let html = `
        <div class="linha"><span>Pacote</span><span>${m.pacote.nome}</span></div>
        <div class="linha"><span>Período</span><span>${m.periodo.nome} (${m.periodo.meses} ${m.periodo.meses == 1 ? 'mês' : 'meses'})</span></div>
        <div class="linha"><span>Pacote ${m.pacote.nome} (com musculação)</span><span>${moeda(MENSALIDADE_BASE + m.pacote.acrescimo)}</span></div>
        <div class="linha"><span>Alpha Pass</span><span>${m.alphaPass == 'Adicional' ? '+ ' + moeda(m.adicionalAlphaPass) : m.alphaPass}</span></div>`;

    if (m.aulas.length > 0) {
        let nomes = m.aulas.map(a => a.nome).join(', ');
        html += `<div class="linha"><span>Aulas: ${nomes}</span><span>+ ${moeda(m.aulasBruto)}</span></div>`;
        if (m.pctAulas > 0)
            html += `<div class="linha desconto"><span>Desconto de ${m.pctAulas}% nas aulas (${m.aulas.length} aulas)</span><span>− ${moeda(m.aulasBruto - m.aulasLiquido)}</span></div>`;
    } else {
        html += `<div class="linha"><span>Aulas adicionais</span><span>—</span></div>`;
    }

    html += `<div class="linha fw-semibold"><span>Mensalidade</span><span>${moeda(m.mensal)}</span></div>`;

    if (m.periodo.meses > 1)
        html += `<div class="linha"><span>Subtotal (${m.periodo.meses} × ${moeda(m.mensal)})</span><span>${moeda(m.subtotal)}</span></div>`;
    if (m.periodo.desconto > 0)
        html += `<div class="linha desconto"><span>Desconto de ${m.periodo.desconto}% (${m.periodo.nome.toLowerCase()})</span><span>− ${moeda(m.valorDesconto)}</span></div>`;

    html += `<div class="linha total"><span>Valor total</span><span>${moeda(m.total)}</span></div>`;

    if (m.periodo.meses > 1)
        html += `<div class="linha small"><span>Equivale a</span><span>${m.periodo.meses}× de ${moeda(m.parcela)} por mês</span></div>`;

    return html;
}

function atualizarResumo() {
    let vResumo = document.querySelector('#resumoPlano');
    let m = calcularMatricula();

    if (m == null) {
        vResumo.innerHTML = `<div class="text-white-50 small">
                                <i class="fa-solid fa-calculator me-1"></i>
                                Escolha o pacote e o período para ver o valor da matrícula.
                             </div>`;
        document.querySelector('#dataTermino').value = '';
        return;
    }

    vResumo.innerHTML = htmlResumo(m);
    document.querySelector('#dataTermino').value = m.termino != '' ? formatarDataBR(m.termino) : '';
}


// marca/desmarca o erro em um grupo de opções (radio ou checkbox)
function setValidacaoGrupo(idGrupo, idFeedback, valido, mensagem) {
    let grupo = document.querySelector(idGrupo);
    let feedback = document.querySelector(idFeedback);
    if (valido) {
        grupo.classList.remove('is-invalid');
    } else {
        grupo.classList.add('is-invalid');
        feedback.textContent = mensagem;
    }
    return valido;
}

function validarPacote() {
    return setValidacaoGrupo('#grupo-pacote', '#fb-pacote', valorMarcado('pacote') != '', 'Escolha um pacote.');
}

function validarPeriodo() {
    return setValidacaoGrupo('#grupo-periodo', '#fb-periodo', valorMarcado('periodo') != '', 'Escolha o período de pagamento.');
}

// início: hoje ou até 30 dias à frente
function validarDataInicio(elem) {
    let data = elem.value;
    let hoje = dataISO(new Date());
    let limite = new Date();
    limite.setDate(limite.getDate() + DIAS_MAX_INICIO);

    if (data == '')
        return setValidacao(elem, false, 'Informe a data de início da matrícula.');
    if (data < hoje)
        return setValidacao(elem, false, 'A data de início não pode estar no passado.');
    if (data > dataISO(limite))
        return setValidacao(elem, false, `A matrícula deve começar em até ${DIAS_MAX_INICIO} dias.`);
    return setValidacao(elem, true, '');
}

// chamada pelo validarFormulario() em validate.js
function validarPlano() {
    let okPacote = validarPacote();
    let okPeriodo = validarPeriodo();
    return okPacote && okPeriodo;
}

// Alpha Pass: opção de adicionar (Start e Fit) ou aviso de "incluso" (Performance e Full)
function atualizarAlphaPass() {
    let pacote = PACOTES[valorMarcado('pacote')];
    let vCheck = document.querySelector('#alphaPass');

    document.querySelector('#boxAlphaPass').classList.toggle('d-none', !pacote);
    if (!pacote) return;

    document.querySelector('#labelAlphaPass').classList.toggle('d-none', pacote.alphaPass);
    document.querySelector('#alphaPassIncluso').classList.toggle('d-none', !pacote.alphaPass);
    // se o pacote já inclui, o adicional não faz sentido
    if (pacote.alphaPass) vCheck.checked = false;
}

function trocarPacote() {
    atualizarAlphaPass();
    validarPacote();
    atualizarResumo();
}

// mostra na dica quanto a pessoa está economizando com as aulas
function trocarAula() {
    let qtd = aulasEscolhidas().length;
    let pct = descontoAulas(qtd);
    let dica = document.querySelector('#dicaAulas');
    let proximo = qtd < 4 ? descontoAulas(qtd + 1) : 0;

    if (pct > 0)
        dica.innerHTML = `<i class="fa-solid fa-tags me-1"></i><strong class="text-success">${qtd} aulas: ${pct}% de desconto aplicado.</strong>` +
                         (proximo > pct ? ` Com mais 1 aula, o desconto vai para ${proximo}%.` : '');
    else if (qtd == 1)
        dica.innerHTML = `<i class="fa-solid fa-tags me-1"></i>Adicione mais 1 aula e ganhe <strong>10% de desconto</strong> nas aulas.`;
    else
        dica.innerHTML = `<i class="fa-solid fa-tags me-1"></i>Leve mais e pague menos: <strong>2 aulas, 10% off</strong> •
                          <strong>3 aulas, 15% off</strong> • <strong>4 ou mais, 20% off</strong> no valor das aulas.`;
    atualizarResumo();
}

function trocarPeriodo() {
    validarPeriodo();
    atualizarResumo();
}


function validarNumeroCartao(elem) {
    let numero = elem.value.replace(/\D/g, '');
    if (numero == '')
        return setValidacao(elem, false, 'Informe o número do cartão.');
    if (numero.length != 16)
        return setValidacao(elem, false, 'O número do cartão deve ter 16 dígitos.');

    // algoritmo de Luhn (dígito verificador usado pelas bandeiras de cartão)
    let soma = 0;
    for (let i = 0; i < 16; i++) {
        let d = parseInt(numero.charAt(15 - i));
        if (i % 2 == 1) {
            d = d * 2;
            if (d > 9) d = d - 9;
        }
        soma += d;
    }
    if (soma % 10 != 0)
        return setValidacao(elem, false, 'Número de cartão inválido. Confira os dígitos.');
    return setValidacao(elem, true, '');
}

function validarNomeCartao(elem) {
    let nome = elem.value.trim().replace(/\s+/g, ' ');
    if (nome == '')
        return setValidacao(elem, false, 'Informe o nome impresso no cartão.');
    if (!/^[A-ZÀ-Ý ]+$/i.test(nome) || nome.split(' ').length < 2)
        return setValidacao(elem, false, 'Digite o nome como está no cartão (nome e sobrenome, só letras).');
    return setValidacao(elem, true, '');
}

function validarValidadeCartao(elem) {
    let valor = elem.value;
    if (!/^\d{2}\/\d{2}$/.test(valor))
        return setValidacao(elem, false, 'Informe a validade no formato MM/AA.');

    let mes = parseInt(valor.substring(0, 2));
    let ano = 2000 + parseInt(valor.substring(3, 5));
    if (mes < 1 || mes > 12)
        return setValidacao(elem, false, 'Mês inválido (01 a 12).');

    let hoje = new Date();
    // o cartão vale até o último dia do mês da validade
    let fimValidade = new Date(ano, mes, 0, 23, 59, 59);
    if (fimValidade < hoje)
        return setValidacao(elem, false, 'Cartão vencido.');
    if (ano > hoje.getFullYear() + 15)
        return setValidacao(elem, false, 'Validade inválida.');
    return setValidacao(elem, true, '');
}

function validarCVV(elem) {
    if (!/^\d{3}$/.test(elem.value))
        return setValidacao(elem, false, 'O CVV tem 3 dígitos (verso do cartão).');
    return setValidacao(elem, true, '');
}

function validarAceite() {
    let ck = document.querySelector('#aceiteTermos');
    ck.classList.toggle('is-invalid', !ck.checked);
    return ck.checked;
}


function trocarFormaPagamento() {
    let forma = valorMarcado('formaPagamento');
    document.querySelector('#boxPix').classList.toggle('d-none', forma != 'pix');
    document.querySelector('#boxCartao').classList.toggle('d-none', forma != 'cartao');
    document.querySelector('#boxRecepcao').classList.toggle('d-none', forma != 'recepcao');
    setValidacaoGrupo('#grupo-forma', '#fb-forma', true, '');
}

// código "copia e cola" fictício, só para o protótipo
function gerarCodigoPix(valorCentavos) {
    let valor = (valorCentavos / 100).toFixed(2);
    return `00020126580014BR.GOV.BCB.PIX0136contato@projectalpha.com.br5204000053039865406${valor}5802BR5913PROJECT ALPHA6017PRESIDENTE PRUDEN6304A1F3`;
}

function copiarPix() {
    let codigo = document.querySelector('#codigoPix').textContent;
    try { navigator.clipboard.writeText(codigo); } catch (e) {}
    let msg = document.querySelector('#msgCopiado');
    msg.classList.remove('d-none');
    setTimeout(function () { msg.classList.add('d-none'); }, 2500);
}

// chamada pelo validarFormulario() quando o cadastro inteiro está válido
function abrirPagamento() {
    let m = calcularMatricula();
    let nome = document.querySelector('#nome').value.trim();

    document.querySelector('#resumoPagamento').innerHTML = `
        <div class="fw-bold mb-2"><i class="fa-solid fa-user me-2"></i>${nome}</div>
        ${htmlResumo(m)}
        <div class="linha small mt-2"><span>Vigência</span><span>${formatarDataBR(m.inicio)} a ${formatarDataBR(m.termino)}</span></div>
        <div class="linha"><span>1ª mensalidade (cobrada na matrícula)</span><span class="fw-bold">${moeda(m.parcela)}</span></div>`;

    document.querySelector('#codigoPix').textContent = gerarCodigoPix(m.parcela);

    // volta o modal para a etapa de pagamento
    document.querySelector('#etapaPagamento').classList.remove('d-none');
    document.querySelector('#etapaSucesso').classList.add('d-none');
    document.querySelector('#rodapePagamento').classList.remove('d-none');

    bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalPagamento')).show();
}

function confirmarMatricula() {
    let forma = valorMarcado('formaPagamento');
    let ok = setValidacaoGrupo('#grupo-forma', '#fb-forma', forma != '', 'Escolha a forma de pagamento.');

    if (forma == 'cartao') {
        let ok1 = validarNumeroCartao(document.querySelector('#numeroCartao'));
        let ok2 = validarNomeCartao(document.querySelector('#nomeCartao'));
        let ok3 = validarValidadeCartao(document.querySelector('#validadeCartao'));
        let ok4 = validarCVV(document.querySelector('#cvvCartao'));
        ok = ok && ok1 && ok2 && ok3 && ok4;
    }
    let okAceite = validarAceite();
    if (!(ok && okAceite)) return;

    mostrarSucesso(forma);
}

function mostrarSucesso(forma) {
    let m = calcularMatricula();
    let nome = document.querySelector('#nome').value.trim();
    let codigo = `MAT-${new Date().getFullYear()}-${String(new Date().getTime()).slice(-6)}`;

    let situacao = forma == 'recepcao'
        ? '<span class="badge bg-warning text-dark">Aguardando pagamento na recepção</span>'
        : '<span class="badge bg-success">Ativa</span>';
    let textoForma = { pix: 'Pix', cartao: 'Cartão de crédito', recepcao: 'Na recepção' }[forma];

    document.querySelector('#etapaSucesso').innerHTML = `
        <i class="fa-solid fa-circle-check sucesso-icone mb-3"></i>
        <h4 class="mb-1">Matrícula realizada!</h4>
        <p class="text-white-50 mb-4">Bem-vindo(a) à Project Alpha, ${nome.split(' ')[0]}.</p>
        <div class="resumo-plano text-start mx-auto" style="max-width:480px">
            <div class="linha"><span>Código da matrícula</span><span class="fw-bold">${codigo}</span></div>
            <div class="linha"><span>Situação</span><span>${situacao}</span></div>
            <div class="linha"><span>Pacote / período</span><span>${m.pacote.nome} • ${m.periodo.nome}</span></div>
            <div class="linha"><span>Aulas adicionais</span><span class="text-end">${m.aulas.length > 0 ? m.aulas.map(a => a.nome).join(', ') : '—'}</span></div>
            <div class="linha"><span>Alpha Pass</span><span>${m.alphaPass}</span></div>
            <div class="linha"><span>Vigência</span><span>${formatarDataBR(m.inicio)} a ${formatarDataBR(m.termino)}</span></div>
            <div class="linha"><span>Forma de pagamento</span><span>${textoForma}</span></div>
            <div class="linha total"><span>Valor total</span><span>${moeda(m.total)}</span></div>
        </div>
        <div class="d-flex flex-wrap justify-content-center gap-2 mt-4">
            <a href="index.html" class="btn btn-btn-success"><i class="fa-solid fa-house me-1"></i> Ir para a página inicial</a>
            <button type="button" class="btn btn-danger" id="btnNovoCadastro">Fazer outro cadastro</button>
        </div>`;

    document.querySelector('#etapaPagamento').classList.add('d-none');
    document.querySelector('#rodapePagamento').classList.add('d-none');
    document.querySelector('#etapaSucesso').classList.remove('d-none');
    document.querySelector('#btnNovoCadastro').addEventListener('click', novoCadastro, false);
}

// limpa tudo para cadastrar outra pessoa
function novoCadastro() {
    bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalPagamento')).hide();
    document.querySelector('#formCadastro').reset();
    limparPagamento();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limparPagamento() {
    for (let id of ['#numeroCartao', '#nomeCartao', '#validadeCartao', '#cvvCartao']) {
        let campo = document.querySelector(id);
        campo.value = '';
        campo.classList.remove('is-valid', 'is-invalid');
    }
    for (let r of document.querySelectorAll('input[name="formaPagamento"]')) r.checked = false;
    document.querySelector('#aceiteTermos').checked = false;
    document.querySelector('#aceiteTermos').classList.remove('is-invalid');
    trocarFormaPagamento();
}

// o botão "Limpar" do formulário também limpa o plano e as marcações de erro
function limparCadastro() {
    // o reset só termina depois deste evento, por isso o setTimeout
    setTimeout(function () {
        for (let campo of document.querySelectorAll('#formCadastro .is-valid, #formCadastro .is-invalid'))
            campo.classList.remove('is-valid', 'is-invalid');
        document.querySelector('#boxAlphaPass').classList.add('d-none');
        trocarAula();   // volta a dica das aulas e atualiza o resumo
    }, 0);
}


function iniciarMatricula() {
    let vInicio = document.querySelector('#dataInicio');
    let limite = new Date();
    limite.setDate(limite.getDate() + DIAS_MAX_INICIO);
    vInicio.min = dataISO(new Date());
    vInicio.max = dataISO(limite);
    // sugestão: começar hoje (defaultValue para o botão "Limpar" voltar a essa data)
    vInicio.defaultValue = dataISO(new Date());
    vInicio.value = vInicio.defaultValue;

    for (let r of document.querySelectorAll('input[name="pacote"]'))
        r.addEventListener('change', trocarPacote, false);
    for (let r of document.querySelectorAll('input[name="periodo"]'))
        r.addEventListener('change', trocarPeriodo, false);
    for (let ck of document.querySelectorAll('input[name="aulas"]'))
        ck.addEventListener('change', trocarAula, false);
    for (let r of document.querySelectorAll('input[name="formaPagamento"]'))
        r.addEventListener('change', trocarFormaPagamento, false);

    document.querySelector('#alphaPass').addEventListener('change', atualizarResumo, false);
    document.querySelector('#aceiteTermos').addEventListener('change', validarAceite, false);
    document.querySelector('#btnCopiarPix').addEventListener('click', copiarPix, false);
    document.querySelector('#btnConfirmarPagamento').addEventListener('click', confirmarMatricula, false);
    document.querySelector('#formCadastro').addEventListener('reset', limparCadastro, false);

    // vindo da página inicial ("Escolher plano"): cadastro.html?pacote=fit
    let pacote = new URLSearchParams(window.location.search).get('pacote');
    let radio = document.querySelector(`#pacote-${pacote}`);
    if (pacote && radio) {
        radio.checked = true;
        trocarPacote();
    }

    atualizarResumo();
}

if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', iniciarMatricula, false);
else
    iniciarMatricula();
