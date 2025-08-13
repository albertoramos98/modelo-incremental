// Variável global para as tarefas
let tarefas = [];

// Função para mostrar mensagens na página (se existir o elemento #mensagem)
function mostrarMensagem(texto, cor) {
    const msg = document.getElementById("mensagem");
    if (!msg) return;
    msg.textContent = texto;
    msg.style.color = cor;
    if (texto) {
        setTimeout(() => {
            msg.textContent = "";
        }, 3000);
    }
}

// Cadastro de usuário
function fazerCadastro() {
    let usuario = document.getElementById("cadastroUsuario").value.trim();
    let senha = document.getElementById("cadastroSenha").value.trim();

    if (!usuario || !senha) {
        mostrarMensagem("Preencha todos os campos!", "red");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (usuarios.find(u => u.usuario === usuario)) {
        mostrarMensagem("Usuário já existe!", "red");
        return;
    }

    usuarios.push({ usuario, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    mostrarMensagem("Cadastro realizado com sucesso!", "green");

    // Limpar campos
    document.getElementById("cadastroUsuario").value = "";
    document.getElementById("cadastroSenha").value = "";
}

// Login do usuário
function fazerLogin() {
    let usuario = document.getElementById("loginUsuario").value.trim();
    let senha = document.getElementById("loginSenha").value.trim();

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let encontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);

    if (encontrado) {
        localStorage.setItem("usuarioLogado", usuario);
        mostrarMensagem("Login realizado com sucesso!", "green");
        // Redirecionar para a página de tarefas
        setTimeout(() => {
            window.location.href = "tarefas.html";
        }, 1000);
    } else {
        mostrarMensagem("Usuário ou senha inválidos!", "red");
    }
}

// Carrega tarefas do usuário logado
function carregarTarefas() {
    let usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) return;

    tarefas = JSON.parse(localStorage.getItem(`tarefas_${usuarioLogado}`)) || [];
}

// Salva as tarefas no localStorage do usuário logado
function salvarTarefas() {
    let usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado) return;

    localStorage.setItem(`tarefas_${usuarioLogado}`, JSON.stringify(tarefas));
}

// Exibe tarefas na lista
function exibirTarefas() {
    let lista = document.getElementById("listaTarefas");
    if (!lista) return;

    lista.innerHTML = "";

    tarefas.forEach((tarefa, index) => {
        let li = document.createElement("li");

        // Cria um span para o texto da tarefa para melhor alinhamento
        let textoTarefa = document.createElement("span");
        textoTarefa.textContent = tarefa;

        // Div para agrupar os botões
        let divBotoes = document.createElement("div");

        // Botão editar
        let btnEditar = document.createElement("button");
        btnEditar.innerHTML = '<i class="fas fa-pencil-alt"></i>'; // Ícone de lápis
        btnEditar.classList.add("edit-btn"); // Adiciona classe CSS
        btnEditar.onclick = () => editarTarefa(index);

        // Botão excluir
        let btnExcluir = document.createElement("button");
        btnExcluir.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Ícone de lixeira
        btnExcluir.classList.add("delete-btn"); // Adiciona classe CSS
        btnExcluir.onclick = () => excluirTarefa(index);

        divBotoes.appendChild(btnEditar);
        divBotoes.appendChild(btnExcluir);

        li.appendChild(textoTarefa);
        li.appendChild(divBotoes);

        lista.appendChild(li);
    });

}


// Adiciona nova tarefa
function adicionarTarefa() {
    let inputTarefa = document.getElementById("novaTarefa");
    if (!inputTarefa) return;

    let novaTarefa = inputTarefa.value.trim();
    if (!novaTarefa) {
        alert("Digite uma tarefa!");
        return;
    }

    tarefas.push(novaTarefa);
    salvarTarefas();
    inputTarefa.value = "";
    exibirTarefas();
}

// Edita tarefa
function editarTarefa(index) {
    let novaDescricao = prompt("Edite a tarefa:", tarefas[index]);
    if (novaDescricao !== null && novaDescricao.trim() !== "") {
        tarefas[index] = novaDescricao.trim();
        salvarTarefas();
        exibirTarefas();
    }
}

// Excluir tarefa
function excluirTarefa(index) {
    tarefas.splice(index, 1);
    salvarTarefas();
    exibirTarefas();
}

// Logout
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

// Setup inicial
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname.split("/").pop(); // Pega apenas o nome do arquivo

    // Lógica para as páginas de login e cadastro
    if (path === "login.html" || path === "cadastro.html") {
        const btnLogin = document.getElementById("btnLogin");
        const btnCadastrar = document.getElementById("btnCadastrar");

        // Previne o envio padrão do formulário que recarrega a página
        const form = document.querySelector('form');
        if(form) form.addEventListener('submit', (e) => e.preventDefault());

        if (btnLogin) {
            btnLogin.onclick = fazerLogin;
        }
        if (btnCadastrar) {
            btnCadastrar.onclick = fazerCadastro;
        }

    // Lógica para a página de tarefas
    } else if (path === "tarefas.html") {
        let usuarioLogado = localStorage.getItem("usuarioLogado");
        if (!usuarioLogado) {
            alert("Você precisa estar logado para acessar esta página!");
            window.location.href = "login.html";
            return;
        }

        let usuarioSpan = document.getElementById("usuarioLogado");
        if (usuarioSpan) usuarioSpan.textContent = usuarioLogado;

        carregarTarefas();
        exibirTarefas();

        const btnAdicionar = document.getElementById("btnAdicionar");
        const btnLogout = document.getElementById("btnLogout");

        if (btnAdicionar) btnAdicionar.onclick = adicionarTarefa;
        if (btnLogout) btnLogout.onclick = logout;
    }
});
