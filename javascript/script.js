const STORAGE_KEY = 'dados_json';

const alunosIniciais = [
    { nome : "João Silva", curso: "ADS", semestre : 3, nascimento : 12082002, nota1 : 9, nota2 : 8, media: 8.5, situacao: "aprovado" },
    { nome : "Maria Souza", curso: "Engenharia de Software", semestre : 5, nascimento : 13032001, nota1 : 7, nota2 : 5, media: 6, situacao: "aprovado" },
    { nome : "Carlos Pereira", curso: "Sistemas de Informação", semestre : 1, nascimento : 25042003, nota1 : 4, nota2 : 4, media: 4, situacao: "recuperação" }
];

let objs;
if (localStorage.getItem(STORAGE_KEY)){
    objs = JSON.parse(localStorage.getItem(STORAGE_KEY));
} else{
    objs = [];
}
if (objs.length === 0){
    objs = alunosIniciais;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objs));
}

// Tabela com os alunos cadastrados
function renderizarTabela(){
    const tbody = document.getElementById("AlunosCadastrados");
    if(!tbody) return;

    tbody.innerHTML = ""; 

    const listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || objs;

    listaAlunos.forEach((aluno, index) => {
        let linha = document.createElement('tr');

        let tdNome = document.createElement('td');
        let tdCurso = document.createElement('td');
        let tdSemestre = document.createElement('td');
        let tdMedia = document.createElement('td');
        let tdSituacao = document.createElement('td');
        let tdAcoes = document.createElement('td');

        tdNome.innerText = aluno.nome;
        tdCurso.innerText = aluno.curso;
        tdSemestre.innerText = aluno.semestre;
        tdMedia.innerText = aluno.media !== null ? aluno.media: "-";
        tdSituacao.innerText = aluno.situacao !== null ? aluno.situacao: "Matriculado";

        // chama a função para mudar a cor
        tdSituacao.style.color = obterCorSituacao(aluno.situacao);
        tdSituacao.style.fontWeight = "bold";

        tdAcoes.classList.add('actions-cell');
        tdAcoes.innerHTML = `
            <button class="table-action-btn edit-btn" onclick="editarAluno(${index})">Editar</button>
            <button class="table-action-btn delete-btn" onclick="excluirAluno(${index})">Excluir</button>
        `;

        linha.appendChild(tdNome);
        linha.appendChild(tdCurso);
        linha.appendChild(tdSemestre);
        linha.appendChild(tdMedia);
        linha.appendChild(tdSituacao);
        linha.appendChild(tdAcoes);
        
        tbody.appendChild(linha);
    });
}

// Excluir um aluno
function excluirAluno(index){
    //confirma antes de excluir
    if (confirm("Tem certeza que deseja excluir esse aluno do cadastro?")){
        let listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) ||[];
        listaAlunos.splice(index, 1); // Remove o item a partir da posição clicada
        
        // Atualiza o localStorage
        objs = listaAlunos;     
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAlunos));
        renderizarTabela(); // Recarregha a tabela atualizada
    }
}

//Editar um aluno -> redireciona para a página de cadastro 
function editarAluno(index){
    // Salva o índice do aluno temporariamente
    localStorage.setItem('aluno_editando_index', index);
    
    // Abre a página de cadastro
    window.location.href = './Paginas/cadastro.html';
}

// Salva as informações no localStorage
function saveStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(objs));
  renderizarTabela();
}

//Área de cadastro de Aluno
function CadastrarAluno(){
    let nomeCadastro = document.getElementById('nomeCadastro');
    let cursoCadastroSelect = document.getElementById('cursoCadastro');
    let semestreCadastro = document.getElementById('semestreCadastro');
    let nascimentoCadastro = document.getElementById('nascimentoCadastro');
    
    //valida se está tudo preenchido
    if (cursoCadastroSelect.selectedIndex === 0 || cursoCadastroSelect.value === "default"){
        alert("Por favor, selecione um curso Válido!");
        return;
    }
    if (!nomeCadastro.value || !semestreCadastro.value || !nascimentoCadastro.value){
        alert("Por favor, preencha todos os campos!");
        return;
    }

    let data = nascimentoCadastro.value;
    let parteData = data.split('-');
    let dataString = parteData[2] + parteData[1] + parteData[0];
    let dataNumerica = parseInt(dataString);

    objs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Verifica se há um índice de edição salvo
    const editIndex = localStorage.getItem('aluno_editando_index');

    // Se estiver editando, abre com as informações já preenchidas
    if (editIndex !== null) {
        const idx = parseInt(editIndex);
        objs[idx].nome = nomeCadastro.value;
        objs[idx].curso = cursoCadastroSelect.options[cursoCadastroSelect.selectedIndex].text;
        objs[idx].semestre = parseInt(semestreCadastro.value);
        objs[idx].nascimento = dataNumerica;
        
        alert("Dados do aluno atualizados com sucesso!");
        localStorage.removeItem('aluno_editando_index'); // Remove o estado de edição
    } 
    else {
        // Cria um novo objeto
        let NovoAluno = {
            nome: nomeCadastro.value,
            curso: cursoCadastroSelect.options[cursoCadastroSelect.selectedIndex].text,
            semestre: parseInt(semestreCadastro.value),
            nascimento: dataNumerica,
            nota1: null,
            nota2: null,
            media: null,
            situacao: null
        };
        objs.push(NovoAluno);
        alert("Aluno cadastrado com sucesso!");
    }

    // Salva e retorna à página principal
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objs));
    window.location.href = '../index.html';
}

// Preenche os inputs se estiver editando
function verificarModoEdicao() {
    
    const editIndex = localStorage.getItem('aluno_editando_index');
    // Verifica se está editando, se não para aqui já
    if (editIndex === null) return; 

    let nomeCadastro = document.getElementById('nomeCadastro');
    let cursoCadastroSelect = document.getElementById('cursoCadastro');
    let semestreCadastro = document.getElementById('semestreCadastro');
    let nascimentoCadastro = document.getElementById('nascimentoCadastro');
    let btnCadastrar = document.getElementById('cadastrarAluno');

    // Confirmando se não está na página de cadastro
    if (!nomeCadastro) return;

    const listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const aluno = listaAlunos[parseInt(editIndex)];

    if (aluno) {
        nomeCadastro.value = aluno.nome;
        semestreCadastro.value = aluno.semestre;

        // Varre as opções de curso salvas
        for (let i = 0; i < cursoCadastroSelect.options.length; i++) {
            if (cursoCadastroSelect.options[i].text === aluno.curso) {
                cursoCadastroSelect.selectedIndex = i;
                break;
            }
        }

        // Reconverte a data numérica (DDMMYYYY) de volta para o formato de input (YYYY-MM-DD)
        if (aluno.nascimento) {
            let nStr = aluno.nascimento.toString();
            if (nStr.length === 7) nStr = "0" + nStr; // Corrige o zero à esquerda do dia se houver
            
            const dia = nStr.substring(0, 2);
            const mes = nStr.substring(2, 4);
            const ano = nStr.substring(4, 8);
            nascimentoCadastro.value = `${ano}-${mes}-${dia}`;
        }

        // Muda o texto do botão de cadastro
        if (btnCadastrar) {
            btnCadastrar.innerText = "Salvar Alterações";
        }
    }
}

// Carrega a tabela quando a página inicial carragar 
window.addEventListener('DOMContentLoaded', function() {
    renderizarTabela();
    verificarModoEdicao();
});

// Sincroniza as abas quando um aluno é cadastrado
window.addEventListener('storage', function(event){
    if (event.key === STORAGE_KEY){
        renderizarTabela();
    }
});


function renderizarNotas() {
    const tbody = document.getElementById("TabelaNotas");
    if (!tbody) return;

    tbody.innerHTML = "";

    const listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    listaAlunos.forEach((aluno, index) => {
        let linha = document.createElement('tr');

        let tdNome = document.createElement('td');
        let tdNota1 = document.createElement('td');
        let tdNota2 = document.createElement('td');
        let tdMedia = document.createElement('td');
        let tdSituacao = document.createElement('td');
        let tdAcoes = document.createElement('td');

        tdNome.innerText = aluno.nome;
        // Mostra a nota ou um traço se estiver vazio
        tdNota1.innerText = aluno.nota1 !== null ? aluno.nota1 : "-";
        tdNota2.innerText = aluno.nota2 !== null ? aluno.nota2 : "-";
        tdMedia.innerText = aluno.media !== null ? aluno.media : "-";
        tdSituacao.innerText = aluno.situacao !== null ? aluno.situacao : "Matriculado";
        
        //função para alterar a cor das notas
        tdSituacao.style.color = obterCorSituacao(aluno.situacao);
        tdSituacao.style.fontWeight = "bold";

        tdAcoes.innerHTML = `
            <button onclick="abrirEdicaoNotas(${index})" style="background-color: #007bff; color: white; border: none; padding: 4px 8px; cursor: pointer;">Lançar Notas</button>
        `;

        linha.appendChild(tdNome);
        linha.appendChild(tdNota1);
        linha.appendChild(tdNota2);
        linha.appendChild(tdMedia);
        linha.appendChild(tdSituacao);
        linha.appendChild(tdAcoes);

        tbody.appendChild(linha);
    });
}

// Função que salva qual aluno vai mudar a nota
function abrirEdicaoNotas(index) {
    localStorage.setItem('aluno_notas_index', index);
    window.location.href = './cadastro_notas.html'; 
}

function salvarNotas(index) {
  let listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  let nota1 = parseFloat(document.getElementById(`nota1_${index}`).value);
  let nota2 = parseFloat(document.getElementById(`nota2_${index}`).value);

  if (isNaN(nota1) || isNaN(nota2)) {
    alert("Preencha as duas notas corretamente!");
    return;
  }

  let media = (nota1 + nota2) / 2;
  let situacao = media >= 7 ? "aprovado" : (media >= 5 ? "recuperação" : "reprovado");

  listaAlunos[index].nota1 = nota1;
  listaAlunos[index].nota2 = nota2;
  listaAlunos[index].media = media;
  listaAlunos[index].situacao = situacao;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAlunos));
  alert("Notas atualizadas com sucesso!");
  renderizarNotas();
}

// Preenche o nome do aluno no formulário de notas
function carregarFormularioNotas() {
    const indexStr = localStorage.getItem('aluno_notas_index');
    if (indexStr === null) return;

    const nomeInput = document.getElementById('nomeAlunoNotas');
    if (!nomeInput) return;

    const listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const aluno = listaAlunos[parseInt(indexStr)];

    if (aluno) {
        nomeInput.value = aluno.nome;
        
        document.getElementById('nota1Input').value = aluno.nota1 !== null ? aluno.nota1 : '';
        document.getElementById('nota2Input').value = aluno.nota2 !== null ? aluno.nota2 : '';
    }
}

// Salva as novas notas e calcula a média
function salvarNovasNotas() {
    const indexStr = localStorage.getItem('aluno_notas_index');
    if (indexStr === null) return;

    let materia = document.getElementById('materiaNotas').value;
    let nota1 = parseFloat(document.getElementById('nota1Input').value);
    let nota2 = parseFloat(document.getElementById('nota2Input').value);

    // Validações
    if (materia === "default") {
        alert("Selecione uma matéria válida!");
        return;
    }
    if (isNaN(nota1) || isNaN(nota2) || nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
        alert("Preencha as duas notas corretamente com valores entre 0 e 10!");
        return;
    }

    let listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const idx = parseInt(indexStr);

    let media = (nota1 + nota2) / 2;
    let situacao = "";
    if (media >= 6) {
        situacao = "aprovado";
    } else if (media >= 3) {
        situacao = "recuperação"; // Entre 3 e 5.9
    } else {
        situacao = "reprovado";   // Menor que 3
    }
    // Atualiza os dados do aluno delecionado
    listaAlunos[idx].nota1 = nota1;
    listaAlunos[idx].nota2 = nota2;
    listaAlunos[idx].media = media;
    listaAlunos[idx].situacao = situacao;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAlunos));
    
    alert("Notas atualizadas com sucesso!");
    
    localStorage.removeItem('aluno_notas_index');
    window.location.href = './notas.html';
}

// Função para definir a cor do texto
function obterCorSituacao(situacao) {
    if (!situacao) return '#6c757d'; 

    switch (situacao.toLowerCase()) {
        case 'aprovado':
            return '#28a745';
        case 'recuperação':
            return '#fd7e14';
        case 'reprovado':
            return '#dc3545';
        default:
            return '#6c757d';
    }
}

// Ordenar a Tabela
function configurarOrdenacao() {
    // Seleciona todos os cabeçalhos data-sort
    const headers = document.querySelectorAll('th[data-sort]');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            
            // Pega o campo a ser ordenado
            const campo = this.dataset.sort;
            
            // Verifica a ordem
            const ordemAtual = this.dataset.order || 'asc';
            const novaOrdem = ordemAtual === 'asc' ? 'desc' : 'asc';
            this.dataset.order = novaOrdem; // Salva a nova ordem no dataset

            // Recupera o Array atualizado
            let listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            
            listaAlunos.sort((a, b) => {
                let valorA = a[campo];
                let valorB = b[campo];

                if (campo === 'media') {
                    valorA = valorA !== null ? parseFloat(valorA) : -1; 
                    valorB = valorB !== null ? parseFloat(valorB) : -1;
                }

                if (typeof valorA === 'string' && typeof valorB === 'string') {
                    return novaOrdem === 'asc' 
                        ? valorA.localeCompare(valorB) 
                        : valorB.localeCompare(valorA);
                } else {
                    
                    return novaOrdem === 'asc' 
                        ? valorA - valorB 
                        : valorB - valorA;
                }
            });
            
            objs = listaAlunos;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(listaAlunos));
            
            // 6. Atualiza a tabela visualmente
            renderizarTabela();
        });
    });
}

// Função para calcular e exibir todos os relatórios
function gerarRelatorios() {
    const relGeralTotal = document.getElementById('relGeralTotal');
    if (!relGeralTotal) return;

    const listaAlunos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Separa os alunos que já tem nota lançada dos que não tem
    const alunosComNota = listaAlunos.filter(aluno => aluno.media !== null);

    // Relatório Geral
    relGeralTotal.innerText = listaAlunos.length;
    document.getElementById('relGeralAprovados').innerText = listaAlunos.filter(a => a.situacao === 'aprovado').length;
    document.getElementById('relGeralRecuperacao').innerText = listaAlunos.filter(a => a.situacao === 'recuperação').length;
    document.getElementById('relGeralReprovados').innerText = listaAlunos.filter(a => a.situacao === 'reprovado').length;

    // Relatório de Curso
    document.getElementById('relCursoTotal').innerText = listaAlunos.length;
    
    const contagemCursos = {};
    listaAlunos.forEach(aluno => {
        let cursoNome = aluno.curso;
        if (cursoNome !== "Selecione" && cursoNome !== undefined) {
            contagemCursos[cursoNome] = (contagemCursos[cursoNome] || 0) + 1;
        }
    });

    const divCursos = document.getElementById('relCursoLista');
    divCursos.innerHTML = "";
    for (const [curso, quantidade] of Object.entries(contagemCursos)) {
        divCursos.innerHTML += `<p>Alunos em ${curso}: <strong>${quantidade}</strong></p>`;
    }

    // Relatório Desempenho
    if (alunosComNota.length > 0) {
        // Extrai apenas os números das médias para um array
        const medias = alunosComNota.map(a => parseFloat(a.media));
        
        const maiorMedia = Math.max(...medias);
        const menorMedia = Math.min(...medias);
        const somaMedias = medias.reduce((acumulador, notaAtual) => acumulador + notaAtual, 0);
        const mediaGeral = somaMedias / medias.length;

        document.getElementById('relDesMaiorMedia').innerText = maiorMedia.toFixed(2);
        document.getElementById('relDesMenorMedia').innerText = menorMedia.toFixed(2);
        document.getElementById('relDesMediaGeral').innerText = mediaGeral.toFixed(2);

        document.getElementById('relDesQtdMaior').innerText = alunosComNota.filter(a => parseFloat(a.media) === maiorMedia).length;
        document.getElementById('relDesAcima').innerText = alunosComNota.filter(a => parseFloat(a.media) > mediaGeral).length;
        document.getElementById('relDesAbaixo').innerText = alunosComNota.filter(a => parseFloat(a.media) < mediaGeral).length;
    }

    // Relatório top 5
    const top5 = [...alunosComNota].sort((a, b) => b.media - a.media).slice(0, 5);
    
    const listaTop5 = document.getElementById('relTop5Lista');
    listaTop5.innerHTML = "";
    
    if (top5.length === 0) {
        listaTop5.innerHTML = "<li>Nenhum aluno com nota lançada ainda.</li>";
    } else {
        top5.forEach(aluno => {
            listaTop5.innerHTML += `<li style="margin-bottom: 5px;"><strong>${aluno.nome}</strong> - Média: ${aluno.media} (${aluno.curso})</li>`;
        });
    }
}

// Aciona as funções das páginas
window.addEventListener('DOMContentLoaded', function() {
    renderizarTabela();
    verificarModoEdicao();
    configurarOrdenacao(); 
    renderizarNotas(); 
    carregarFormularioNotas();
    gerarRelatorios();
});
