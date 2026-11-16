/* fonte: https://github.com/FlavioALeal/MascaraJS

Parametros da função mascara
A função máscara tem 3 parametros.

1º - o Modelo da máscara utilizado no input, como explicado acima, informe sempre a máscara entre aspas simples ou aspas duplas, parametro obrigatório
2º - não mude, sempre deve ser this, parametro obrigatório
3º - não mude, sempre deve ser event, parametro obrigatório */
function mascara(m,t,e){
    var cursor = t.selectionStart;
    var texto = t.value;
    texto = texto.replace(/\D/g,'');
    var l = texto.length;
    var lm = m.length;

    if(window.event) { id = e.keyCode; } 
    else if(e.which){ id = e.which; }

    cursorfixo=false;
    if(cursor < l)cursorfixo=true;
    var livre = false;
    if(id == 16 || id == 19 || (id >= 33 && id <= 40))livre = true;
    ii=0;
    mm=0;
    if(!livre) {
        if(id!=8){
            t.value="";
            j=0;
            for(i=0;i<lm;i++){
                if(m.substr(i,1)=="#"){
                    t.value+=texto.substr(j,1);
                    j++;
                }else if(m.substr(i,1)!="#"){ t.value+=m.substr(i,1); }
                if(id!=8 && !cursorfixo)cursor++;
                if((j)==l+1)break;    
            } 	
        }
    }
    if(cursorfixo && !livre) cursor--;
    t.setSelectionRange(cursor, cursor);
}

// Outras Mascaras
function mAltura(input) {
    const valorLimpo = input.value.replace(/\D/g, '');

    if (valorLimpo.length >= 3) {
        input.value = valorLimpo.replace(/(\d)(\d{2})$/, '$1.$2');
    } else { input.value = valorLimpo; }
}