var vetAvaliacoes = [
    {id:1, aluno:'Ismael Pirondi',                      data:'2026-09-15', hora:'17:00', avaliador:'Igor Domingos Marques',  objetivo:'Hipertrofia',            obs:'', status:'Concluída', peso:82.5, altura:1.78},
    {id:2, aluno:'William Eduardo di Martini Minorelli', data:'2026-09-16', hora:'19:00', avaliador:'Igor Domingos Marques',  objetivo:'Performance Esportiva',  obs:'', status:'Concluída', peso:74, altura:1.80},
    {id:3, aluno:'Ana Clara Lima',                      data:'2026-09-18', hora:'18:00', avaliador:'Igor dos Santos Pereira', objetivo:'Condicionamento Físico', obs:'', status:'Confirmada'},
    {id:4, aluno:'Gustavo Santos Ribeiro de Goes',      data:'2026-09-18', hora:'19:00', avaliador:'Igor Domingos Marques',  objetivo:'Hipertrofia',            obs:'', status:'Confirmada'},
    {id:5, aluno:'Igor Domingos Marques',               data:'2026-09-19', hora:'18:30', avaliador:'Igor dos Santos Pereira', objetivo:'Condicionamento Físico', obs:'', status:'Pendente'},
    {id:6, aluno:'Igor dos Santos Pereira',             data:'2026-09-19', hora:'19:30', avaliador:'Ana Clara Lima',          objetivo:'Qualidade de Vida',      obs:'', status:'Confirmada'},
    {id:7, aluno:'Kauan Felipe Oliveira Gois',          data:'2026-09-22', hora:'20:00', avaliador:'Igor dos Santos Pereira', objetivo:'Hipertrofia',            obs:'', status:'Pendente'},
    {id:8, aluno:'Luiggi de Aguiar Bezerra',            data:'2026-09-23', hora:'17:00', avaliador:'Ana Clara Lima',          objetivo:'Emagrecimento',          obs:'', status:'Confirmada'},
]

// registros do histórico (o mais recente fica na posição 0)
var vetHistorico = [
    {classe:'badge-add',  rotulo:'Agendamento',    titulo:'Avaliação agendada.',     texto:'A aluna <strong>Ana Clara Lima</strong> realizou o agendamento para <strong>18/09/2026 às 18:00</strong>.', data:'17/09/2026', hora:'14:32'},
    {classe:'badge-edit', rotulo:'Reagendamento',  titulo:'Horário alterado.',       texto:'A avaliação de <strong>Igor Domingos Marques</strong> foi alterada para <strong>19/09/2026 às 18:30</strong>.', data:'17/09/2026', hora:'13:47'},
    {classe:'badge-del',  rotulo:'Concluída',      titulo:'Avaliação finalizada.',   texto:'O relatório físico de <strong>Ismael Pirondi</strong> foi registrado no sistema.', data:'16/09/2026', hora:'20:15'},
    {classe:'badge-add',  rotulo:'Nova Avaliação', titulo:'Agendamento realizado.',  texto:'O aluno <strong>Luiggi de Aguiar Bezerra</strong> foi incluído na agenda de avaliações.', data:'16/09/2026', hora:'18:04'},
]

// configurações da tabela
var itensPorPagina = 6;
var paginaAtual = 1;

// configurações do histórico
var historicoPorPagina = 4;
var paginaHistorico = 1;

// regras do formulário
var HORA_ABERTURA = '06:00';
var HORA_ULTIMA_AVALIACAO = '21:00';
var DIAS_MAX_ANTECEDENCIA = 180;   // até 6 meses à frente
// avaliação que está aberta no modal de IMC
var idEmAvaliacao = null;

// faixas de IMC segundo a OMS (o "ate" é o limite de cada faixa)
var FAIXAS_IMC = [
    {ate: 18.5,     texto: 'Abaixo do peso',     cor: '#3b82f6'},
    {ate: 25,       texto: 'Peso normal',        cor: '#16a34a'},
    {ate: 30,       texto: 'Sobrepeso',          cor: '#ca8a04'},
    {ate: 35,       texto: 'Obesidade grau I',   cor: '#ea580c'},
    {ate: 40,       texto: 'Obesidade grau II',  cor: '#dc2626'},
    {ate: Infinity, texto: 'Obesidade grau III', cor: '#991b1b'},
];

// preposições que podem aparecer no meio do nome (ex.: Ana "de" Souza)
var CONECTORES = ['da', 'das', 'de', 'di', 'do', 'dos', 'e'];


// converte '2026-09-15' em '15/09/2026' para exibir na tabela
function formatarData(dataISO) {
    let partes = dataISO.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// devolve a data de hoje no formato 'aaaa-mm-dd' (usando o fuso do usuário)
function hojeISO() {
    let d = new Date();
    let mes = String(d.getMonth() + 1).padStart(2, '0');
    let dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
}

// soma dias a hoje e devolve no formato 'aaaa-mm-dd'
function somarDiasISO(qtdDias) {
    let d = new Date();
    d.setDate(d.getDate() + qtdDias);
    let mes = String(d.getMonth() + 1).padStart(2, '0');
    let dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
}

// hora atual no formato 'hh:mm'
function horaAtual() {
    let d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}


// aplica a busca e a ordenação escolhidas e devolve uma nova lista
function obterListaFiltrada() {
    let termo = document.querySelector('#busca').value.trim().toLowerCase();
    let ordem = document.querySelector('#ordenar').value;
    let lista = [];

    // busca por aluno, avaliador ou data (dd/mm/aaaa)
    for (let av of vetAvaliacoes) {
        let texto = (av.aluno + ' ' + av.avaliador + ' ' + formatarData(av.data)).toLowerCase();
        if (termo == '' || texto.includes(termo))
            lista.push(av);
    }

    // ordenação
    if (ordem == 'az')
        lista.sort((a, b) => a.aluno.localeCompare(b.aluno, 'pt-BR'));
    else if (ordem == 'za')
        lista.sort((a, b) => b.aluno.localeCompare(a.aluno, 'pt-BR'));
    else if (ordem == 'recentes')
        lista.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
    else // padrão e 'antigas': ordem cronológica
        lista.sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));

    return lista;
}

// gera o badge de status com a cor certa
function badgeStatus(status) {
    let classe = 'badge-edit';               // Pendente  -> amarelo
    if (status == 'Confirmada') classe = 'badge-add';   // verde
    if (status == 'Concluída')  classe = 'badge-del';   // vermelho
    return `<span class="badge badge-status ${classe}">${status}</span>`;
}

// avaliação já concluída não pode ser reagendada
function botaoReagendar(av) {
    if (av.status == 'Concluída')
        return '';
    return `<button class="btn btn-sm btn-brand text-nowrap" type="button" onclick="abrirReagendar(${av.id})">
                <i class="fa-solid fa-calendar-days me-1"></i> Reagendar
            </button>`;
}

// o segundo botão de ação muda conforme o status da avaliação
function botaoStatus(av) {
    if (av.status == 'Pendente')
        return `<button class="btn btn-sm btn-brand text-nowrap" type="button" onclick="avancarStatus(${av.id})">
                    <i class="fa-solid fa-check me-1"></i> Confirmar
                </button>`;
    if (av.status == 'Confirmada')
        return `<button class="btn btn-sm btn-brand text-nowrap" type="button" onclick="abrirAvaliacao(${av.id})">
                    <i class="fa-solid fa-weight-scale me-1"></i> Realizar avaliação
                </button>`;
    return `<button class="btn btn-sm btn-brand text-nowrap" type="button" onclick="verRelatorio(${av.id})">
                <i class="fa-solid fa-file-lines me-1"></i> Relatório
            </button>`;
}

function montarTabela() {
    let vTab = document.querySelector('#tb-body');
    let lista = obterListaFiltrada();
    let html = '';

    // calcula quais itens aparecem na página atual
    let totalPaginas = Math.max(1, Math.ceil(lista.length / itensPorPagina));
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
    let inicio = (paginaAtual - 1) * itensPorPagina;
    let listaPagina = lista.slice(inicio, inicio + itensPorPagina);

    // percorrer o vetor de objetos e gerar uma linha para cada avaliação
    for (let av of listaPagina) {
        // Template String (crase) + DATA ATTRIBUTE (data-id) no checkbox
        html += `<tr>
                    <td>
                        <input class="form-check-input" type="checkbox" data-id="${av.id}" aria-label="Selecionar ${av.aluno}">
                    </td>
                    <td>${av.aluno}</td>
                    <td>${formatarData(av.data)}</td>
                    <td>${av.hora}</td>
                    <td>${av.avaliador}</td>
                    <td>${badgeStatus(av.status)}</td>
                    <td>
                        <div class="d-flex gap-2 flex-nowrap">
                            <button class="btn btn-sm btn-dark-soft text-nowrap" type="button" onclick="delAvaliacao(${av.id})">
                                <i class="fa-solid fa-trash me-1"></i> Excluir
                            </button>
                            ${botaoReagendar(av)}
                            ${botaoStatus(av)}
                        </div>
                    </td>
                </tr>`;
    }

    // tabela vazia (nenhum registro ou a busca não encontrou nada)
    if (lista.length == 0) {
        html = `<tr>
                    <td colspan="7" class="text-center py-4 text-body-secondary">
                        <i class="fa-solid fa-calendar-xmark me-1"></i> Nenhuma avaliação encontrada.
                    </td>
                </tr>`;
    }

    // associar essa string ao <tbody> para ser renderizada
    vTab.innerHTML = html;

    // depois de redesenhar, o "selecionar todos" volta a ficar desmarcado
    document.querySelector('#ckTodos').checked = false;

    document.querySelector('#paginacao').innerHTML = gerarPaginacao(paginaAtual, totalPaginas);
    let texto = lista.length == 1 ? '1 agendamento' : `${lista.length} agendamentos`;
    document.querySelector('#infoPaginacao').innerHTML =
        `Página <strong class="text-body">${paginaAtual}</strong> de <strong class="text-body">${totalPaginas}</strong>
         <span class="opacity-75 ms-1">(${texto})</span>`;

    atualizarContadores();
}

// monta os botões < 1 2 3 > (usada pela tabela e pelo histórico)
function gerarPaginacao(atual, totalPaginas) {
    let html = '';

    // botão "anterior"
    html += `<li class="page-item ${atual == 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${atual - 1}" aria-label="Página anterior"><i class="fa-solid fa-chevron-left"></i></a>
             </li>`;

    // mostra no máximo 5 números para não "estourar" quando tiver muitas páginas
    let inicio = Math.max(1, atual - 2);
    let fim = Math.min(totalPaginas, inicio + 4);
    inicio = Math.max(1, fim - 4);

    for (let i = inicio; i <= fim; i++) {
        html += `<li class="page-item ${i == atual ? 'active' : ''}">
                    <a class="page-link" href="#" data-pagina="${i}">${i}</a>
                 </li>`;
    }

    // botão "próxima"
    html += `<li class="page-item ${atual == totalPaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" data-pagina="${atual + 1}" aria-label="Próxima página"><i class="fa-solid fa-chevron-right"></i></a>
             </li>`;

    return html;
}

// descobre qual página foi clicada (mesmo se clicar no ícone dentro do <a>)
function paginaClicada(event) {
    event.preventDefault();
    let link = event.target.closest('[data-pagina]');
    if (link == null || link.parentElement.classList.contains('disabled'))
        return 0;
    return parseInt(link.dataset.pagina);
}

function irParaPagina(event) {
    let pagina = paginaClicada(event);
    if (pagina == 0) return;
    paginaAtual = pagina;
    montarTabela();
}


function atualizarContadores() {
    let pendentes = 0, confirmadas = 0, concluidas = 0;

    for (let av of vetAvaliacoes) {
        if (av.status == 'Pendente')   pendentes++;
        if (av.status == 'Confirmada') confirmadas++;
        if (av.status == 'Concluída')  concluidas++;
    }
    // "agendadas" = tudo que ainda vai acontecer (pendentes + confirmadas)
    let agendadas = pendentes + confirmadas;

    document.querySelector('#contTopo').textContent = agendadas;
    document.querySelector('#contAgendadas').textContent = String(agendadas).padStart(2, '0');
    document.querySelector('#contPendentes').textContent = String(pendentes).padStart(2, '0');
    document.querySelector('#contConcluidas').textContent = String(concluidas).padStart(2, '0');

    document.querySelector('#metaAgendadas').textContent =
        confirmadas == 1 ? '1 confirmada' : `${confirmadas} confirmadas`;
    document.querySelector('#metaPendentes').textContent =
        pendentes == 0 ? 'nenhuma aguardando confirmação' : `${pendentes} aguardando confirmação`;
    document.querySelector('#metaConcluidas').textContent =
        `de ${vetAvaliacoes.length} avaliações no total`;
}


function montarHistorico() {
    let vLista = document.querySelector('#listaHistorico');
    let html = '';

    let totalPaginas = Math.max(1, Math.ceil(vetHistorico.length / historicoPorPagina));
    if (paginaHistorico > totalPaginas) paginaHistorico = totalPaginas;
    let inicio = (paginaHistorico - 1) * historicoPorPagina;
    let listaPagina = vetHistorico.slice(inicio, inicio + historicoPorPagina);

    for (let log of listaPagina) {
        html += `<div class="log-item p-3">
                    <div class="log-text">
                        <span class="badge badge-status ${log.classe} me-2">${log.rotulo}</span>
                        <strong>${log.titulo}</strong> ${log.texto}
                        <div class="log-meta mt-1">Data: ${log.data} • Horário: ${log.hora}</div>
                    </div>
                </div>`;
    }

    if (vetHistorico.length == 0)
        html = `<div class="p-3 small text-body-secondary">Nenhuma alteração registrada.</div>`;

    vLista.innerHTML = html;

    document.querySelector('#paginacaoHistorico').innerHTML = gerarPaginacao(paginaHistorico, totalPaginas);
    let texto = vetHistorico.length == 1 ? '1 registro' : `${vetHistorico.length} registros`;
    document.querySelector('#infoHistorico').innerHTML =
        `Página <strong class="text-body">${paginaHistorico}</strong> de <strong class="text-body">${totalPaginas}</strong>
         <span class="opacity-75 ms-1">(${texto})</span>`;
}

function irParaPaginaHistorico(event) {
    let pagina = paginaClicada(event);
    if (pagina == 0) return;
    paginaHistorico = pagina;
    montarHistorico();
}

function registrarHistorico(classeBadge, rotulo, titulo, texto) {
    // o mais recente fica em cima (unshift = adiciona no começo do vetor)
    vetHistorico.unshift({
        classe: classeBadge,
        rotulo: rotulo,
        titulo: titulo,
        texto: texto,
        data: formatarData(hojeISO()),
        hora: horaAtual()
    });
    // volta para a primeira página para mostrar o registro novo
    paginaHistorico = 1;
    montarHistorico();
}


// procura uma avaliação pelo id
function buscarPorId(id) {
    for (let av of vetAvaliacoes)
        if (av.id == id) return av;
    return null;
}

function delAvaliacao(idDel) {
    let av = buscarPorId(idDel);
    if (av == null) return;

    if (!confirm(`Excluir a avaliação de ${av.aluno} (${formatarData(av.data)} às ${av.hora})?`))
        return;

    removerDoVetor([idDel]);
    registrarHistorico('badge-del', 'Exclusão', 'Avaliação excluída.',
        `O agendamento de <strong>${av.aluno}</strong> para <strong>${formatarData(av.data)} às ${av.hora}</strong> foi removido.`);
    montarTabela();
}

// remove do vetor todos os ids recebidos (mesma ideia da lista auxiliar da aula)
function removerDoVetor(listaIds) {
    let listaAux = [];
    for (let i = 0; i < vetAvaliacoes.length; i++) {
        if (!listaIds.includes(String(vetAvaliacoes[i].id)) && !listaIds.includes(vetAvaliacoes[i].id))
            listaAux.push(vetAvaliacoes[i]);
    }
    // substituir o vetor pelos objetos que ficaram na lista auxiliar
    vetAvaliacoes = listaAux;
}

function excluirSelecionados() {
    // pegar só os checkbox com 'data-id' que estão marcados
    let listaCK = document.querySelectorAll('#tb-body [data-id]:checked');

    if (listaCK.length == 0) {
        alert('Não há avaliações selecionadas para serem excluídas!!');
        return;
    }

    let qtd = listaCK.length;
    if (!confirm(`Excluir ${qtd} ${qtd == 1 ? 'avaliação selecionada' : 'avaliações selecionadas'}?`))
        return;

    // guarda os ids e os nomes antes de apagar
    let ids = [];
    let nomes = [];
    for (let ck of listaCK) {
        ids.push(ck.dataset.id);
        nomes.push(buscarPorId(ck.dataset.id).aluno);
    }

    removerDoVetor(ids);
    registrarHistorico('badge-del', 'Exclusão', `${qtd} ${qtd == 1 ? 'avaliação excluída' : 'avaliações excluídas'}.`,
        `Removidos: <strong>${nomes.join(', ')}</strong>.`);
    montarTabela();
}

function selecionaTodos() {
    let listaCK = document.querySelectorAll('#tb-body [data-id]');
    // pegamos o checkbox do cabeçalho da tabela
    let ckPai = document.querySelector('#ckTodos');
    for (let ck of listaCK)
        ck.checked = ckPai.checked;
}

// Pendente -> Confirmada (a conclusão é feita pelo modal "Realizar avaliação")
function avancarStatus(id) {
    let av = buscarPorId(id);
    if (av == null || av.status != 'Pendente') return;

    av.status = 'Confirmada';
    registrarHistorico('badge-add', 'Confirmação', 'Avaliação confirmada.',
        `A avaliação de <strong>${av.aluno}</strong> em <strong>${formatarData(av.data)} às ${av.hora}</strong> foi confirmada.`);
    montarTabela();
}


// avaliação que está aberta no modal de reagendamento
var idEmReagendamento = null;

function camposReagendar() {
    return {
        aluno: document.querySelector('#r-aluno'),
        data: document.querySelector('#r-data'),
        hora: document.querySelector('#r-hora'),
        avaliador: document.querySelector('#r-avaliador'),
        objetivo: document.querySelector('#r-objetivo'),
        objetivoOutro: document.querySelector('#r-objetivo-outro')
    };
}

function abrirReagendar(id) {
    let av = buscarPorId(id);
    if (av == null) return;
    idEmReagendamento = id;

    // preenche o modal com os dados atuais da avaliação
    let c = camposReagendar();
    c.aluno.value = av.aluno;
    c.data.value = av.data;
    c.hora.value = av.hora;
    c.avaliador.value = av.avaliador;
    preencherObjetivo(c.objetivo, c.objetivoOutro, av.objetivo);
    document.querySelector('#r-obs').value = av.obs;
    limparValidacao([c.data, c.hora, c.avaliador, c.objetivo, c.objetivoOutro]);

    document.querySelector('#avisoReagendar').innerHTML = av.status == 'Confirmada'
        ? '<i class="fa-solid fa-circle-info me-1"></i>Se a data, o horário ou o avaliador mudarem, a avaliação volta para <strong>Pendente</strong> e precisa ser confirmada de novo.'
        : '';

    bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalReagendar')).show();
}

function salvarReagendamento() {
    let av = buscarPorId(idEmReagendamento);
    if (av == null) return;
    let c = camposReagendar();

    let okData = validarData(c.data);
    let okHora = validarHora(c.hora, c.data);
    let okAvaliador = validarAvaliador(c.avaliador);
    let okObjetivo = validarObjetivo(c.objetivo, c.objetivoOutro);
    if (!(okData && okHora && okAvaliador && okObjetivo)) return;
    if (!validarConflitos(c, av.id)) return;

    let dataAntiga = `${formatarData(av.data)} às ${av.hora}`;
    let mudouAgenda = av.data != c.data.value || av.hora != c.hora.value || av.avaliador != c.avaliador.value;

    av.data = c.data.value;
    av.hora = c.hora.value;
    av.avaliador = c.avaliador.value;
    av.objetivo = lerObjetivo(c.objetivo, c.objetivoOutro);
    av.obs = document.querySelector('#r-obs').value.trim();

    if (mudouAgenda) {
        // novo horário precisa ser confirmado de novo
        av.status = 'Pendente';
        registrarHistorico('badge-edit', 'Reagendamento', 'Avaliação reagendada.',
            `A avaliação de <strong>${av.aluno}</strong> foi alterada de ${dataAntiga} para <strong>${formatarData(av.data)} às ${av.hora}</strong> com ${av.avaliador}.`);
    } else {
        registrarHistorico('badge-edit', 'Edição', 'Agendamento atualizado.',
            `Objetivo e observações de <strong>${av.aluno}</strong> foram atualizados.`);
    }

    bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalReagendar')).hide();
    idEmReagendamento = null;
    montarTabela();
}


// IMC = peso / (altura x altura)
function calcularImc(peso, altura) {
    return peso / (altura * altura);
}

// devolve a faixa da OMS em que o IMC se encaixa
function classificarImc(imc) {
    for (let faixa of FAIXAS_IMC)
        if (imc < faixa.ate) return faixa;
    return FAIXAS_IMC[FAIXAS_IMC.length - 1];
}

// número no formato brasileiro: 24.5 -> "24,5"
function numeroBR(valor, casas) {
    return valor.toFixed(casas).replace('.', ',');
}

// barra colorida com as faixas e um marcador na posição do IMC (escala de 15 a 45)
function barraImc(imc) {
    let html = '<div class="imc-barra">';
    let inicio = 15;
    for (let faixa of FAIXAS_IMC) {
        let fim = Math.min(faixa.ate, 45);
        html += `<div class="faixa" style="width:${(fim - inicio) / 30 * 100}%; background:${faixa.cor}"></div>`;
        inicio = fim;
    }
    let posicao = Math.min(Math.max((imc - 15) / 30 * 100, 0), 100);
    html += `<div class="marcador" style="left:${posicao}%"></div></div>`;
    html += `<div class="imc-legenda"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>35</span><span>40</span><span>45</span></div>`;
    return html;
}

// faixa de peso considerada saudável (IMC 18,5 a 24,9) para a altura informada
function faixaPesoSaudavel(altura) {
    let min = 18.5 * altura * altura;
    let max = 24.9 * altura * altura;
    return `${numeroBR(min, 1)} kg a ${numeroBR(max, 1)} kg`;
}

// lê o número aceitando vírgula (ex.: "1,75")
function lerNumero(input) {
    let texto = input.value.trim().replace(',', '.');
    if (texto == '' || isNaN(texto)) return NaN;
    return parseFloat(texto);
}

// altura em centímetros (ex.: 175) é convertida para metros
function lerAltura() {
    let altura = lerNumero(document.querySelector('#altura'));
    if (altura >= 100 && altura <= 250) altura = altura / 100;
    return altura;
}

function validarPeso() {
    let vPeso = document.querySelector('#peso');
    let peso = lerNumero(vPeso);

    if (vPeso.value.trim() == '')
        return setValidacao(vPeso, false, 'Informe o peso.');
    if (isNaN(peso))
        return setValidacao(vPeso, false, 'Digite apenas números (ex.: 72,5).');
    if (peso < 20 || peso > 300)
        return setValidacao(vPeso, false, 'O peso deve estar entre 20 e 300 kg.');

    return setValidacao(vPeso, true, '');
}

function validarAltura() {
    let vAltura = document.querySelector('#altura');
    let altura = lerAltura();

    if (vAltura.value.trim() == '')
        return setValidacao(vAltura, false, 'Informe a altura.');
    if (isNaN(altura))
        return setValidacao(vAltura, false, 'Digite apenas números (ex.: 1,75).');
    if (altura < 1 || altura > 2.5)
        return setValidacao(vAltura, false, 'Informe a altura em metros (ex.: 1,75) ou em centímetros (ex.: 175).');

    return setValidacao(vAltura, true, '');
}

// recalcula o IMC enquanto o usuário digita
function atualizarImc() {
    let peso = lerNumero(document.querySelector('#peso'));
    let altura = lerAltura();
    let vResultado = document.querySelector('#resultadoImc');

    // só mostra o resultado quando os dois valores fazem sentido
    if (isNaN(peso) || isNaN(altura) || peso < 20 || peso > 300 || altura < 1 || altura > 2.5) {
        vResultado.innerHTML = `<div class="text-body-secondary small py-2">
                                    <i class="fa-solid fa-calculator me-1"></i>
                                    Informe o peso e a altura para calcular o IMC.
                                </div>`;
        return;
    }

    let imc = calcularImc(peso, altura);
    let faixa = classificarImc(imc);

    vResultado.innerHTML = `
        <div class="small text-body-secondary text-uppercase fw-semibold">Índice de Massa Corporal</div>
        <div class="imc-valor">${numeroBR(imc, 1)}</div>
        <span class="imc-classe" style="background:${faixa.cor}">${faixa.texto}</span>
        ${barraImc(imc)}
        <div class="small mt-2">Peso saudável para ${numeroBR(altura, 2)} m: <strong>${faixaPesoSaudavel(altura)}</strong></div>`;
}

function abrirAvaliacao(id) {
    let av = buscarPorId(id);
    if (av == null) return;
    idEmAvaliacao = id;

    document.querySelector('#infoAvaliacao').innerHTML = `
        <div class="fw-bold mb-1"><i class="fa-solid fa-user me-2"></i>${av.aluno}</div>
        <div class="text-body-secondary">
            <i class="fa-solid fa-calendar-day me-2"></i>${formatarData(av.data)} às ${av.hora}<br>
            <i class="fa-solid fa-user-doctor me-2"></i>${av.avaliador}<br>
            <i class="fa-solid fa-bullseye me-2"></i>${av.objetivo}
        </div>`;

    // limpa os campos de uma avaliação anterior
    let vPeso = document.querySelector('#peso');
    let vAltura = document.querySelector('#altura');
    vPeso.value = '';
    vAltura.value = '';
    limparValidacao([vPeso, vAltura]);
    atualizarImc();

    let vModal = document.querySelector('#modalAvaliacao');
    bootstrap.Modal.getOrCreateInstance(vModal).show();
    // foco no peso depois que o modal termina de abrir
    vModal.addEventListener('shown.bs.modal', function () { vPeso.focus(); }, { once: true });
}

function concluirAvaliacao() {
    let okPeso = validarPeso();
    let okAltura = validarAltura();
    if (!(okPeso && okAltura)) return;

    let av = buscarPorId(idEmAvaliacao);
    if (av == null) return;

    // guarda o resultado no próprio objeto da avaliação
    av.peso = lerNumero(document.querySelector('#peso'));
    av.altura = lerAltura();
    av.status = 'Concluída';

    let imc = calcularImc(av.peso, av.altura);
    registrarHistorico('badge-del', 'Concluída', 'Avaliação realizada.',
        `<strong>${av.aluno}</strong>: IMC <strong>${numeroBR(imc, 1)}</strong> (${classificarImc(imc).texto}).`);

    bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalAvaliacao')).hide();
    idEmAvaliacao = null;
    montarTabela();
}

// Enter no peso ou na altura também salva
function enterNaAvaliacao(event) {
    if (event.key == 'Enter') {
        event.preventDefault();
        concluirAvaliacao();
    }
}

// converte '2026-09-15' em '15 de setembro de 2026'
function dataPorExtenso(dataISO) {
    let meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    let partes = dataISO.split('-');
    return `${parseInt(partes[2])} de ${meses[parseInt(partes[1]) - 1]} de ${partes[0]}`;
}

// soma dias a uma data 'aaaa-mm-dd' (usada para sugerir a reavaliação)
function somarDiasEm(dataISO, qtdDias) {
    let partes = dataISO.split('-');
    let d = new Date(partes[0], partes[1] - 1, partes[2]);
    d.setDate(d.getDate() + qtdDias);
    return formatarData(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
}

// parte do relatório com peso, altura e IMC (só aparece se a avaliação tiver resultado)
function secaoResultados(av) {
    if (av.peso == undefined || av.altura == undefined)
        return '';

    let imc = calcularImc(av.peso, av.altura);
    let faixa = classificarImc(imc);

    return `
        <div class="doc-secao"><i class="fa-solid fa-weight-scale"></i>Resultados</div>
        <div class="doc-dados doc-resultados">
            <div>
                <div class="rotulo">Peso</div>
                <div class="valor">${numeroBR(av.peso, 1)} kg</div>
            </div>
            <div>
                <div class="rotulo">Altura</div>
                <div class="valor">${numeroBR(av.altura, 2)} m</div>
            </div>
            <div>
                <div class="rotulo">IMC</div>
                <div class="valor">${numeroBR(imc, 1)} kg/m²</div>
            </div>
            <div>
                <div class="rotulo">Classificação</div>
                <div class="valor" style="color:${faixa.cor}">${faixa.texto}</div>
            </div>
        </div>
        ${barraImc(imc)}
        <p class="doc-nota">
            Peso considerado saudável para a altura: <strong>${faixaPesoSaudavel(av.altura)}</strong>.
            Classificação segundo a OMS. O IMC é um indicador de triagem e não avalia a composição corporal.
        </p>`;
}

// trecho da declaração sobre o objetivo
function fraseObjetivo(objetivo) {
    if (objetivo == 'Não informado' || objetivo == '')
        return ', sem objetivo principal definido até o momento';
    return `, com o objetivo de <strong>${objetivo.toLowerCase()}</strong>`;
}

// monta o documento da avaliação dentro do modal
function verRelatorio(id) {
    let av = buscarPorId(id);
    if (av == null) return;

    let protocolo = `AV-${av.data.substring(0, 4)}-${String(av.id).slice(-6).padStart(6, '0')}`;
    let obs = av.obs != '' ? av.obs : 'Nenhuma observação registrada.';

    let html = `
        <div class="doc-cabecalho">
            <img src="assets/images/Logo-nav.png" alt="Project Alpha Academia">
            <div class="doc-empresa">
                <strong>Project Alpha Academia</strong><br>
                Av. Alpha Performance, 1200 - Presidente Prudente, SP<br>
                (18) 88888-7777 • contato@projectalpha.com.br
            </div>
        </div>

        <div class="doc-titulo">Relatório de Avaliação Física</div>
        <div class="doc-protocolo">Protocolo nº <strong>${protocolo}</strong> • Emitido em ${formatarData(hojeISO())} às ${horaAtual()}</div>

        <div class="doc-secao"><i class="fa-solid fa-clipboard-user"></i>Dados da avaliação</div>
        <div class="doc-dados">
            <div class="inteiro">
                <div class="rotulo">Aluno(a)</div>
                <div class="valor"><i class="fa-solid fa-user"></i> ${av.aluno}</div>
            </div>
            <div>
                <div class="rotulo">Data</div>
                <div class="valor"><i class="fa-solid fa-calendar-day"></i> ${formatarData(av.data)}</div>
            </div>
            <div>
                <div class="rotulo">Horário</div>
                <div class="valor"><i class="fa-solid fa-clock"></i> ${av.hora}</div>
            </div>
            <div>
                <div class="rotulo">Avaliador(a) responsável</div>
                <div class="valor"><i class="fa-solid fa-user-doctor"></i> ${av.avaliador}</div>
            </div>
            <div>
                <div class="rotulo">Objetivo</div>
                <div class="valor"><i class="fa-solid fa-bullseye"></i> ${av.objetivo}</div>
            </div>
            <div>
                <div class="rotulo">Status</div>
                <div class="valor"><i class="fa-solid fa-circle-check"></i> ${av.status}</div>
            </div>
            <div>
                <div class="rotulo">Reavaliação sugerida</div>
                <div class="valor"><i class="fa-solid fa-rotate"></i> a partir de ${somarDiasEm(av.data, 90)}</div>
            </div>
            <div class="inteiro">
                <div class="rotulo">Observações</div>
                <div class="valor"><i class="fa-solid fa-comment-medical"></i> ${obs}</div>
            </div>
        </div>

        ${secaoResultados(av)}

        <div class="doc-secao"><i class="fa-solid fa-file-signature"></i>Declaração</div>
        <p>
            Declaramos, para os devidos fins, que <strong>${av.aluno}</strong> realizou avaliação física
            na Project Alpha Academia no dia <strong>${dataPorExtenso(av.data)}</strong>, às <strong>${av.hora}</strong>,
            sob a responsabilidade de <strong>${av.avaliador}</strong>${fraseObjetivo(av.objetivo)}.
        </p>
        <p>
            Os dados coletados nesta avaliação servem como base para a prescrição e o acompanhamento do
            programa de treinamento, sendo de uso exclusivo da academia e do aluno, conforme a Lei Geral
            de Proteção de Dados (LGPD).
        </p>

        <div class="doc-secao"><i class="fa-solid fa-list-check"></i>Orientações</div>
        <ul>
            <li>Siga o plano de treino definido pelo avaliador a partir desta avaliação.</li>
            <li>Mantenha uma boa hidratação e alimentação equilibrada ao longo da semana.</li>
            <li>Comunique ao instrutor qualquer dor, desconforto ou alteração de saúde.</li>
            <li>Agende a reavaliação para acompanhar a sua evolução.</li>
        </ul>

        <div class="doc-local">Presidente Prudente, ${dataPorExtenso(hojeISO())}.</div>

        <div class="doc-assinaturas">
            <div class="doc-assinatura">
                ${av.aluno}
                <span>Assinatura do(a) aluno(a)</span>
            </div>
            <div class="doc-assinatura">
                ${av.avaliador}
                <span>Assinatura do(a) avaliador(a) • CREF ____________</span>
            </div>
        </div>

        <div class="doc-rodape">
            <span><i class="fa-solid fa-location-dot"></i>Av. Alpha Performance, 1200 - Presidente Prudente, SP</span>
            <span><i class="fa-solid fa-phone"></i>(18) 88888-7777</span>
            <span><i class="fa-brands fa-whatsapp"></i>(18) 98888-5555</span>
            <span><i class="fa-solid fa-envelope"></i>contato@projectalpha.com.br</span>
            <span><i class="fa-brands fa-instagram"></i>@projectalpha</span>
            <div class="doc-gerado">Documento gerado pelo sistema Project Alpha.</div>
        </div>`;

    document.querySelector('#documentoRelatorio').innerHTML = html;

    // abre o modal do Bootstrap com o documento
    bootstrap.Modal.getOrCreateInstance(document.querySelector('#modalRelatorio')).show();
}

function imprimirRelatorio() {
    // o CSS @media print esconde o resto da página e deixa só o documento
    window.print();
}


// marca o campo como válido/inválido e mostra a mensagem embaixo dele
function setValidacao(input, valido, mensagemErro) {
    let feedback = document.querySelector('#fb-' + input.id);

    if (valido) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        if (feedback) feedback.style.display = 'none';
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (feedback) {
            feedback.textContent = mensagemErro;
            feedback.style.display = 'block';
        }
    }
    return valido;
}

// tira as bordas verde/vermelha e as mensagens dos campos recebidos
function limparValidacao(campos) {
    for (let campo of campos) {
        campo.classList.remove('is-valid', 'is-invalid');
        let feedback = document.querySelector('#fb-' + campo.id);
        if (feedback) feedback.style.display = 'none';
    }
}

// As validações recebem o campo como parâmetro, assim servem tanto para o
// formulário lateral quanto para o cadastro pela tabela.

// Nome: obrigatório, só letras, com nome E sobrenome
function validarNome(vAluno) {
    // tira espaços do começo/fim e espaços repetidos no meio
    let nome = vAluno.value.trim().replace(/\s+/g, ' ');

    if (nome == '')
        return setValidacao(vAluno, false, 'Informe o nome do aluno.');

    // letras (com acento), espaço, apóstrofo e hífen (ex.: D'Ávila, Ana-Maria)
    let regEx = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    if (!regEx.test(nome))
        return setValidacao(vAluno, false, 'O nome deve conter apenas letras.');

    let partes = nome.split(' ');
    if (partes.length < 2)
        return setValidacao(vAluno, false, 'Informe o nome e o sobrenome do aluno.');

    let primeiro = partes[0];
    let ultimo = partes[partes.length - 1];
    if (primeiro.length < 2 || ultimo.length < 2 || CONECTORES.includes(ultimo.toLowerCase()))
        return setValidacao(vAluno, false, 'Nome e sobrenome devem ter pelo menos 2 letras cada.');

    // deixa o nome padronizado: "ana clara DE lima" -> "Ana Clara de Lima"
    let formatado = [];
    for (let i = 0; i < partes.length; i++) {
        let p = partes[i].toLowerCase();
        if (i > 0 && CONECTORES.includes(p))
            formatado.push(p);
        else
            formatado.push(p.charAt(0).toUpperCase() + p.substring(1));
    }
    vAluno.value = formatado.join(' ');

    return setValidacao(vAluno, true, '');
}

// Data: obrigatória, não pode ser no passado nem muito distante
function validarData(vData) {
    let data = vData.value;   // o input date devolve 'aaaa-mm-dd' ou '' se for inválida

    if (data == '')
        return setValidacao(vData, false, 'Selecione uma data válida para a avaliação.');

    if (data < hojeISO())
        return setValidacao(vData, false, 'A data não pode estar no passado.');

    if (data > somarDiasISO(DIAS_MAX_ANTECEDENCIA))
        return setValidacao(vData, false, 'Agende com no máximo 6 meses de antecedência.');

    return setValidacao(vData, true, '');
}

// Horário: obrigatório, dentro do expediente e no futuro (se for hoje)
function validarHora(vHora, vData) {
    let hora = vHora.value;   // 'hh:mm'

    if (hora == '')
        return setValidacao(vHora, false, 'Selecione o horário.');

    if (hora < HORA_ABERTURA || hora > HORA_ULTIMA_AVALIACAO)
        return setValidacao(vHora, false, `Escolha um horário entre ${HORA_ABERTURA} e ${HORA_ULTIMA_AVALIACAO}.`);

    if (vData.value == hojeISO() && hora <= horaAtual())
        return setValidacao(vHora, false, 'Esse horário já passou. Escolha um horário futuro.');

    return setValidacao(vHora, true, '');
}

// Avaliador: obrigatório
function validarAvaliador(vAvaliador) {
    if (vAvaliador.value == '')
        return setValidacao(vAvaliador, false, 'Escolha o avaliador responsável.');

    return setValidacao(vAvaliador, true, '');
}

// Objetivo: obrigatório escolher uma opção; se for "Outro", precisa digitar qual
function validarObjetivo(vSelect, vOutro) {
    if (vSelect.value == '')
        return setValidacao(vSelect, false, 'Selecione um objetivo (ou "Ainda não definido").');
    setValidacao(vSelect, true, '');

    if (vSelect.value != 'outro')
        return true;

    let texto = vOutro.value.trim().replace(/\s+/g, ' ');
    if (texto == '')
        return setValidacao(vOutro, false, 'Digite qual é o objetivo.');
    if (texto.length < 3)
        return setValidacao(vOutro, false, 'O objetivo deve ter pelo menos 3 letras.');
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9 ,.-]+$/.test(texto))
        return setValidacao(vOutro, false, 'Use apenas letras e números.');

    return setValidacao(vOutro, true, '');
}

// devolve o texto do objetivo que vai ser gravado no vetor
function lerObjetivo(vSelect, vOutro) {
    if (vSelect.value != 'outro')
        return vSelect.value;
    let texto = vOutro.value.trim().replace(/\s+/g, ' ');
    // primeira letra maiúscula: "reabilitação do joelho" -> "Reabilitação do joelho"
    return texto.charAt(0).toUpperCase() + texto.substring(1);
}

// mostra o campo de digitar só quando a opção "Outro" estiver escolhida
function alternarOutro(vSelect, vOutro) {
    if (vSelect.value == 'outro') {
        vOutro.classList.remove('d-none');
    } else {
        vOutro.classList.add('d-none');
        vOutro.value = '';
        limparValidacao([vOutro]);
    }
}

// usado no reagendamento: coloca no select o objetivo que já estava gravado
function preencherObjetivo(vSelect, vOutro, valor) {
    let existe = false;
    for (let opcao of vSelect.options)
        if (opcao.value == valor && valor != '') existe = true;

    if (existe) {
        vSelect.value = valor;
        vOutro.value = '';
    } else {
        // objetivo digitado em "Outro" (ex.: "Reabilitação")
        vSelect.value = 'outro';
        vOutro.value = valor;
    }
    vOutro.classList.toggle('d-none', vSelect.value != 'outro');
}

// regras que dependem de mais de um campo (conflitos de agenda)
// idIgnorar: no reagendamento a própria avaliação não conta como conflito
function validarConflitos(campos, idIgnorar) {
    let data = campos.data.value;
    let hora = campos.hora.value;
    let avaliador = campos.avaliador.value;
    let ok = true;

    for (let av of vetAvaliacoes) {
        if (av.status == 'Concluída' || av.id == idIgnorar) continue;

        // o avaliador já tem alguém nesse dia e horário
        if (av.data == data && av.hora == hora && av.avaliador == avaliador) {
            setValidacao(campos.hora, false, `${avaliador} já tem uma avaliação em ${formatarData(data)} às ${hora}.`);
            ok = false;
        }
        // o aluno já tem avaliação marcada nesse dia
        if (av.data == data && av.aluno.toLowerCase() == campos.aluno.value.toLowerCase()) {
            setValidacao(campos.aluno, false, `${av.aluno} já tem uma avaliação marcada em ${formatarData(data)}.`);
            ok = false;
        }
    }
    return ok;
}

// valida todos os campos de uma vez (para todos os erros aparecerem juntos)
function validarCampos(campos) {
    let okNome = validarNome(campos.aluno);
    let okData = validarData(campos.data);
    let okHora = validarHora(campos.hora, campos.data);
    let okAvaliador = validarAvaliador(campos.avaliador);
    let okObjetivo = validarObjetivo(campos.objetivo, campos.objetivoOutro);

    if (!(okNome && okData && okHora && okAvaliador && okObjetivo))
        return false;
    return validarConflitos(campos);
}

// liga a validação de cada campo quando o usuário sai dele (onblur / onchange)
function ligarValidacoes(campos) {
    campos.aluno.addEventListener('blur', function () {
        // campo vazio só é cobrado quando tentar agendar
        if (campos.aluno.value.trim() == '' && !campos.aluno.classList.contains('is-invalid')) return;
        validarNome(campos.aluno);
    }, false);
    campos.data.addEventListener('change', function () {
        validarData(campos.data);
        // se o horário já foi preenchido, revalida (ex.: data mudou para hoje)
        if (campos.hora.value != '') validarHora(campos.hora, campos.data);
    }, false);
    campos.hora.addEventListener('change', function () { validarHora(campos.hora, campos.data); }, false);
    campos.avaliador.addEventListener('change', function () { validarAvaliador(campos.avaliador); }, false);
    campos.objetivo.addEventListener('change', function () {
        alternarOutro(campos.objetivo, campos.objetivoOutro);
        setValidacao(campos.objetivo, true, '');
        if (campos.objetivo.value == 'outro') campos.objetivoOutro.focus();
    }, false);
    // ao corrigir um campo com erro, a mensagem some enquanto digita
    // (se sumisse só no blur, o botão "pularia" de lugar e o clique se perderia)
    for (let campo of [campos.aluno, campos.objetivoOutro]) {
        campo.addEventListener('input', function () {
            if (campo.classList.contains('is-invalid')) limparValidacao([campo]);
        }, false);
    }
    campos.objetivoOutro.addEventListener('blur', function () {
        if (campos.objetivoOutro.value.trim() != '' || campos.objetivoOutro.classList.contains('is-invalid'))
            validarObjetivo(campos.objetivo, campos.objetivoOutro);
    }, false);

    // não deixa escolher datas e horários fora do intervalo nos seletores
    campos.data.min = hojeISO();
    campos.data.max = somarDiasISO(DIAS_MAX_ANTECEDENCIA);
    campos.hora.min = HORA_ABERTURA;
    campos.hora.max = HORA_ULTIMA_AVALIACAO;
}

// campos do formulário lateral
function camposLateral() {
    return {
        aluno: document.querySelector('#aluno'),
        data: document.querySelector('#data'),
        hora: document.querySelector('#hora'),
        avaliador: document.querySelector('#avaliador'),
        objetivo: document.querySelector('#objetivo'),
        objetivoOutro: document.querySelector('#objetivo-outro')
    };
}

// campos da linha de cadastro dentro da tabela
function camposTabela() {
    return {
        aluno: document.querySelector('#q-aluno'),
        data: document.querySelector('#q-data'),
        hora: document.querySelector('#q-hora'),
        avaliador: document.querySelector('#q-avaliador'),
        objetivo: document.querySelector('#q-objetivo'),
        objetivoOutro: document.querySelector('#q-objetivo-outro')
    };
}


// grava a avaliação no vetor, registra no histórico e redesenha a tabela
function salvarAvaliacao(campos, objetivo, obs) {
    let novoObj = {
        id: new Date().getTime(),
        aluno: campos.aluno.value,
        data: campos.data.value,
        hora: campos.hora.value,
        avaliador: campos.avaliador.value,
        objetivo: objetivo,
        obs: obs,
        status: 'Pendente'
    };

    // adicionar o objeto no vetor
    vetAvaliacoes.push(novoObj);

    registrarHistorico('badge-add', 'Nova Avaliação', 'Agendamento realizado.',
        `O aluno <strong>${novoObj.aluno}</strong> foi agendado para <strong>${formatarData(novoObj.data)} às ${novoObj.hora}</strong> com ${novoObj.avaliador}.`);

    // limpa a busca e vai para a página onde a nova avaliação ficou
    document.querySelector('#busca').value = '';
    let lista = obterListaFiltrada();
    for (let i = 0; i < lista.length; i++)
        if (lista[i].id == novoObj.id)
            paginaAtual = Math.floor(i / itensPorPagina) + 1;

    montarTabela();
}

// botão "Agendar Avaliação" do formulário lateral
function addAvaliacao(event) {
    event.preventDefault();   // não recarrega a página
    let campos = camposLateral();

    if (!validarCampos(campos))
        return;

    salvarAvaliacao(campos, lerObjetivo(campos.objetivo, campos.objetivoOutro), document.querySelector('#obs').value.trim());

    // limpar o formulário e colocar o foco no nome
    document.querySelector('#formAvaliacao').reset();
    campos.aluno.focus();
}

// "+ Nova avaliação" ou Enter na linha de cadastro da tabela
function addRapido() {
    let campos = camposTabela();

    if (!validarCampos(campos))
        return;

    let vObs = document.querySelector('#q-obs');
    salvarAvaliacao(campos, lerObjetivo(campos.objetivo, campos.objetivoOutro), vObs.value.trim());

    // limpar os campos da linha e colocar o foco no nome
    campos.aluno.value = '';
    campos.data.value = '';
    campos.hora.value = '';
    campos.avaliador.value = '';
    campos.objetivo.selectedIndex = 0;
    alternarOutro(campos.objetivo, campos.objetivoOutro);
    vObs.value = '';
    limparValidacao([campos.aluno, campos.data, campos.hora, campos.avaliador, campos.objetivo]);
    campos.aluno.focus();
}

// Enter dentro da linha da tabela também adiciona
function enterNaLinha(event) {
    if (event.key == 'Enter') {
        event.preventDefault();
        addRapido();
    }
}

function limparFormulario() {
    // o reset do formulário apaga os valores; aqui apagamos o estado de validação
    let c = camposLateral();
    limparValidacao([c.aluno, c.data, c.hora, c.avaliador, c.objetivo, c.objetivoOutro]);
    c.objetivoOutro.classList.add('d-none');
    document.querySelector('#contObs').textContent = '0';
}

function contarObs() {
    document.querySelector('#contObs').textContent = document.querySelector('#obs').value.length;
}


// liga ou desliga o formulário lateral; quando desligado, o cadastro é feito pela tabela
function alternarFormLateral(habilitar) {
    let colForm = document.querySelector('#colFormLateral');
    let colTabela = document.querySelector('#colTabela');
    let linha = document.querySelector('#linhaCadastro');
    let linha2 = document.querySelector('#linhaCadastro2');

    if (habilitar) {
        colForm.classList.remove('d-none');
        linha.classList.add('d-none');
        linha2.classList.add('d-none');
        colTabela.classList.replace('col-xxl-12', 'col-xxl-8');
    } else {
        colForm.classList.add('d-none');
        linha.classList.remove('d-none');
        linha2.classList.remove('d-none');
        // sem o formulário, a tabela ocupa a largura toda
        colTabela.classList.replace('col-xxl-8', 'col-xxl-12');
    }

    // marca no menu qual opção está ativa
    document.querySelector('#optFormLateral').classList.toggle('active', habilitar);
    document.querySelector('#optFormTabela').classList.toggle('active', !habilitar);

    // lembra a escolha quando a página for aberta de novo
    try { localStorage.setItem('formLateral', habilitar ? 'sim' : 'nao'); } catch (e) {}
}

function novaAvaliacao() {
    let lateralAtivo = !document.querySelector('#colFormLateral').classList.contains('d-none');

    // formulário lateral: o botão só leva até o formulário
    if (lateralAtivo) {
        let vAluno = document.querySelector('#aluno');
        vAluno.scrollIntoView({ behavior: 'smooth', block: 'center' });
        vAluno.focus();
        return;
    }

    // cadastro pela tabela: se a linha estiver vazia, leva até ela; se tiver algo, tenta adicionar
    let c = camposTabela();
    if (c.aluno.value.trim() == '' && c.data.value == '' && c.hora.value == '' && c.avaliador.value == '') {
        c.aluno.scrollIntoView({ behavior: 'smooth', block: 'center' });
        c.aluno.focus();
    } else {
        addRapido();
    }
}

function pesquisar() {
    paginaAtual = 1;
    montarTabela();
}


function iniciarDashboard() {
    montarTabela();
    montarHistorico();

    // tabela
    document.querySelector('#ckTodos').addEventListener('click', selecionaTodos, false);
    document.querySelector('#btnExcluirSelecionados').addEventListener('click', excluirSelecionados, false);
    document.querySelector('#paginacao').addEventListener('click', irParaPagina, false);
    document.querySelector('#paginacaoHistorico').addEventListener('click', irParaPaginaHistorico, false);

    // busca e ordenação
    document.querySelector('#busca').addEventListener('input', pesquisar, false);
    document.querySelector('#btnBuscar').addEventListener('click', pesquisar, false);
    document.querySelector('#ordenar').addEventListener('change', pesquisar, false);
    document.querySelector('#btnNovaAvaliacao').addEventListener('click', novaAvaliacao, false);

    // menu de opções (botão ao lado de "+ Nova avaliação")
    document.querySelector('#optFormLateral').addEventListener('click', function () { alternarFormLateral(true); }, false);
    document.querySelector('#optFormTabela').addEventListener('click', function () { alternarFormLateral(false); }, false);

    // realizar avaliação (IMC)
    document.querySelector('#peso').addEventListener('input', function () {
        // se o campo estava com erro, revalida enquanto digita para o erro sumir
        if (this.classList.contains('is-invalid')) validarPeso();
        atualizarImc();
    }, false);
    document.querySelector('#altura').addEventListener('input', function () {
        if (this.classList.contains('is-invalid')) validarAltura();
        atualizarImc();
    }, false);
    document.querySelector('#peso').addEventListener('blur', function () { if (this.value.trim() != '') validarPeso(); }, false);
    document.querySelector('#altura').addEventListener('blur', function () { if (this.value.trim() != '') validarAltura(); }, false);
    document.querySelector('#peso').addEventListener('keydown', enterNaAvaliacao, false);
    document.querySelector('#altura').addEventListener('keydown', enterNaAvaliacao, false);
    document.querySelector('#btnConcluirAvaliacao').addEventListener('click', concluirAvaliacao, false);

    // reagendamento
    document.querySelector('#btnSalvarReagendar').addEventListener('click', salvarReagendamento, false);
    let cR = camposReagendar();
    cR.data.addEventListener('change', function () {
        validarData(cR.data);
        if (cR.hora.value != '') validarHora(cR.hora, cR.data);
    }, false);
    cR.hora.addEventListener('change', function () { validarHora(cR.hora, cR.data); }, false);
    cR.objetivo.addEventListener('change', function () {
        alternarOutro(cR.objetivo, cR.objetivoOutro);
        if (cR.objetivo.value == 'outro') cR.objetivoOutro.focus();
    }, false);
    cR.data.min = hojeISO();
    cR.data.max = somarDiasISO(DIAS_MAX_ANTECEDENCIA);
    cR.hora.min = HORA_ABERTURA;
    cR.hora.max = HORA_ULTIMA_AVALIACAO;

    // relatório
    document.querySelector('#btnImprimir').addEventListener('click', imprimirRelatorio, false);

    // formulário lateral
    let vForm = document.querySelector('#formAvaliacao');
    vForm.addEventListener('submit', addAvaliacao, false);
    vForm.addEventListener('reset', limparFormulario, false);
    document.querySelector('#obs').addEventListener('input', contarObs, false);
    ligarValidacoes(camposLateral());

    // cadastro pela tabela
    document.querySelector('#linhaCadastro').addEventListener('keydown', enterNaLinha, false);
    document.querySelector('#linhaCadastro2').addEventListener('keydown', enterNaLinha, false);
    ligarValidacoes(camposTabela());

    // abre do jeito que o usuário deixou da última vez (padrão: formulário lateral)
    let preferencia = 'sim';
    try { preferencia = localStorage.getItem('formLateral') || 'sim'; } catch (e) {}
    alternarFormLateral(preferencia == 'sim');
}

// o script é carregado no fim do <body>, mas usamos o DOMContentLoaded igual à aula
if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', iniciarDashboard, false);
else
    iniciarDashboard();
