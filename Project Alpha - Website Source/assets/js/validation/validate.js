// Mostra a Mensagem de Erro
function setValidacao(input, valido, mensagemErro = '') {
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    
    if (valido) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        if (feedback && mensagemErro) {
            feedback.innerText = mensagemErro;
        }
    }
    return valido;
}

// Validações
function validarCPF(elem) {
    var cpf = elem.value;
    var ok = 1;
    var add;
    if (cpf != "") {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999") ok = 0;
        if (ok == 1) {
            add = 0;
            for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11) rev = 0;
            if (rev != parseInt(cpf.charAt(9))) ok = 0;
            if (ok == 1) {
               add = 0;
               for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
               rev = 11 - (add % 11);
               if (rev == 10 || rev == 11) rev = 0;
               if (rev != parseInt(cpf.charAt(10))) ok = 0;
            }
        }
        if (ok == 0) {
            setValidacao(elem, false, "Informe um CPF Válido!");
        } else {
            setValidacao(elem, true, "");
        }
    }
}

function validarEmail(elem) {
    const email = elem.value;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(email)) setValidacao(elem, false, "Informe um E-mail Válido!");
    else setValidacao(elem, true, "");
}

function validarData(elem) {
    const data = elem.value;
    const partes = data.split('-');
    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    const dt = new Date(ano, mes - 1, dia);
    const hoje = new Date();

    if (dt.getFullYear() !== ano || dt.getMonth() !== mes - 1 || dt.getDate() !== dia || dt >= hoje) {
        setValidacao(elem, false, "Informe uma Data de Nascimento Válida!");
    } else setValidacao(elem, true, "");
}   

function validarAltura(elem) {
    const altura = elem.value;
    const numero = Number(altura);

    if (isNaN(numero) || numero < 0.50 || numero > 2.50) {
        setValidacao(elem, false, "Informe uma Altura Válida! (entre 0,50 e 2,50 m)");
    } else setValidacao(elem, true, "");
}

function validarCEP(elem) {
    const cep = elem.value.replace(/[^0-9]/g, '');

    if (cep.length !== 8 || isNaN(Number(cep))) {
        setValidacao(elem, false, "Informe um CEP válido!");
        return;
    }

    setValidacao(elem, true, "");

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(dados => {
            if (dados.erro) {
                setValidacao(elem, false, "CEP não encontrado!");
                return;
            }

            document.getElementById('rua').value = dados.logradouro;
            document.getElementById('bairro').value = dados.bairro;
            document.getElementById('cidade').value = dados.localidade;

            if (rua.value.trim() !== '') setValidacao(rua, true, '');
            if (bairro.value.trim() !== '') setValidacao(bairro, true, '');
            if (cidade.value.trim() !== '') setValidacao(cidade, true, '');
        })
        // sem internet a busca falha, mas o CEP digitado continua válido: o endereço é preenchido à mão
        .catch(() => { });
}

function validarTexto(elem, tam, mensage) {
    const palavras = elem.value.trim().split(" ").filter(p => p !== "");
    if(palavras.length < tam) setValidacao(elem, false, mensage)
    else setValidacao(elem, true, "");
}

function validarSenha(elem) {
    const senha = elem.value;

    if (!/[A-Z]/.test(senha)) {
        setValidacao(elem, false, `A senha deve conter uma letra maiúscula! 
            A senha deve conter uma letra minúscula! 
            A senha deve conter um número!
            A senha deve conter um caractere especial!
            A senha deve ter no mínimo 6 caracteres!`);
    } else

    if (!/[a-z]/.test(senha)) {
        setValidacao(elem, false, `A senha deve conter uma letra minúscula! 
            A senha deve conter um número!
            A senha deve conter um caractere especial!
            A senha deve ter no mínimo 6 caracteres!`);
    } else

    if (!/[0-9]/.test(senha)) {
        setValidacao(elem, false, `A senha deve conter um número!
            A senha deve conter um caractere especial!
            A senha deve ter no mínimo 6 caracteres!`);
    } else

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
        setValidacao(elem, false, `A senha deve conter um caractere especial!
            A senha deve ter no mínimo 6 caracteres!`);
    } else 
        
    if (senha.length < 6) {
        setValidacao(elem, false, "A senha deve ter no mínimo 6 caracteres!");
    } else setValidacao(elem, true, "");
}

function validarConfSenha(elem) {
    const confSenha = elem.value;
    const senha = document.getElementById("senha").value;
    if (confSenha !== senha) setValidacao(elem, false, "As senhas não conferem!");
    else setValidacao(elem, true, "");
}   

function validarTelefone(elem) {
    const telefone = elem.value.replace(/\D/g, '');
    if ((telefone.length !== 10 && telefone.length !== 11) || /^(\d)\1+$/.test(telefone))  setValidacao(elem, false, "Informe um Telefone Válido!");
    else setValidacao(elem, true, "");
}

function validarPreenchimento(elem) {
    const valor = elem.value;
    if (valor == "") setValidacao(elem, false, "Este campo é obrigatório!");
    else setValidacao(elem, true, "");
}

// Valida Formulário Inteiro
function validarFormulario() {
    if (event) event.preventDefault();

    let formValido = true;

    const validacoesEspecificas = {
        nome: (el) => validarTexto(el, 2, 'Por favor, digite seu nome e sobrenome completo.'),
        email: (el) => validarEmail(el),
        telefone: (el) => validarTelefone(el),
        dataNascimento: (el) => validarData(el),
        cpf: (el) => validarCPF(el),
        altura: (el) => validarAltura(el),
        cep: (el) => validarCEP(el),
        senha: (el) => validarSenha(el),
        confirmaSenha: (el) => validarConfSenha(el),
        dataInicio: (el) => validarDataInicio(el)
    };

    const camposObrigatorios = document.querySelectorAll('#formCadastro [required]');

    for (const campo of camposObrigatorios) {
        if (campo.value.trim() === '') {
            setValidacao(campo, false, 'Este campo é obrigatório!');
            formValido = false;
        } else {
            if (validacoesEspecificas[campo.id]) {
                validacoesEspecificas[campo.id](campo);
                if (campo.classList.contains('is-invalid')) formValido = false;
            } else setValidacao(campo, true, '');
        }
    }

    // pacote, modalidades (pacote Full) e período: funções em matricula.js
    if (!validarPlano()) formValido = false;

    if (!formValido) {
        const primeiroErro = document.querySelector('#formCadastro .is-invalid');
        if (primeiroErro) {
            if (primeiroErro.focus) primeiroErro.focus();
            primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else abrirPagamento();   // tudo certo: abre o modal de pagamento (sem alert)
}

// Ao corrigir um campo que estava com erro, a mensagem some enquanto a pessoa digita.
// Se ela sumisse só no blur, a página "pularia" no momento do clique seguinte e o clique se perderia.
document.addEventListener('input', function (event) {
    const campo = event.target;
    if (campo.classList && campo.classList.contains('is-invalid') && campo.type !== 'checkbox' && campo.type !== 'radio')
        campo.classList.remove('is-invalid');
});
