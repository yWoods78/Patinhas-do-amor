$modal = document.getElementById('login')


$(".cpf").mask("000.000.000-00");
$(".telefone").mask("(00) 0 0000-0000");

// Função para fazer fade out na seção e mostrar o conteúdo de outra
function fadeOut(sectionId) {
    // Seleciona a seção que será exibida
    const section = document.getElementById(sectionId);
    // Remove a classe visible para começar o fade out
    document.querySelectorAll('section').forEach(sec => sec.style.display = "none");
    // Adiciona a classe visible para fazer o fade in da seção
    section.style.display = 'flex';
}

// Função para fazer o fade-in inicial das seções
// window.onload = function () {
//     document.querySelectorAll('section').forEach(sec => sec.style.display = "none");
// };

let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Rolando para baixo, esconde a nav-bar
        navbar.classList.add("hidden");
    } else {
        // Rolando para cima ou no topo da página, mostra a nav-bar
        navbar.classList.remove("hidden");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Impede valores negativos
});


let appliedFilters = [];

const adoptionFilters = document.getElementsByClassName("adoption-filter");
const adoptions = document.getElementsByClassName("adoption");

function updateAdoptionVisibility() {
    Array.from(adoptions).forEach(function(adoption) {
        const dataInfos = adoption.getAttribute('data-infos');
        const shouldShow = appliedFilters.every(filter => dataInfos.includes(filter));
        
        if (shouldShow || appliedFilters.length === 0) {
            adoption.style.display = 'flex';
        } else {
            adoption.style.display = 'none';
        }
    });
}

Array.from(adoptionFilters).forEach(function(filter) {
    filter.addEventListener('change', function() {
        if (this.checked) {
            appliedFilters.push(this.value);
        } else {
            appliedFilters = appliedFilters.filter(f => f !== this.value);
        }
        updateAdoptionVisibility();
    });
});



document.getElementById('adotar').addEventListener('click', function () {
    fetch('http://localhost:3000/animais')
        .then(response => response.json())
        .then(data => {
            
            const lista = document.getElementById('listaAnimais');
            lista.innerHTML = ''; 

            
            data.forEach(animal => {
                $("#listaAnimais").append(`
                    <li class="adoption" data-infos="${animal.caracteristicas}">
                        <a href="#">
                            <div class="informacoes">
                                <span>Nome: ${animal.nome}</span>
                                <span>Idade: ${animal.idade}</span>
                                <span>Descrição: ${animal.descricao}</span>
                            </div>
                            <img src="${animal.foto}" alt="Foto de um animal para adoção">
                        </a>
                        <button>Adotar</button>
                    </li>
                `)
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados: ', error);
        });
});


document.getElementById('cadastroFuncionario').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o redirecionamento da página

    // Coleta os dados do formulário
    const formData = new FormData(this);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        mensagem: formData.get('mensagem'),
        cpf: formData.get('cpf'),
    };

    // Envia a requisição para o backend usando fetch
    fetch('http://localhost:3000/cadastroFuncionario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Converte os dados do formulário para JSON
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        document.getElementById('cadastroFuncionario').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

document.getElementById('cadastroDoacao').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o redirecionamento da página

    // Coleta os dados do formulário
    const formData = new FormData(this);
    const data = {
        cpf: formData.get('cpf'),
        valor: formData.get('valor'),
        tipo: formData.get('doacao'),
    };

    // Envia a requisição para o backend usando fetch
    fetch('http://localhost:3000/cadastroDoacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Converte os dados do formulário para JSON
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        document.getElementById('cadastroFuncionario').reset();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});


document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o redirecionamento da página

    // Coleta os dados do formulário
    const formData = new FormData(this);
    const data = {
        usuario: formData.get('usuario'),
        senha: formData.get('senha'),
    };

    // Envia a requisição para o backend usando fetch
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Converte os dados do formulário para JSON
    })
    .then(response => response.text())
    .then(result => {
        window.location.href = './components/admin/admin.html';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

var emailSending = false

document.getElementById('sentContact').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o redirecionamento da página
    if (emailSending) return;
    // Coleta os dados do formulário
    const formData = new FormData(this);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        mensagem: formData.get('mensagem'),
    };
    emailSending = true
    // Envia a requisição para o backend usando fetch
    fetch('http://localhost:3000/sentEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Converte os dados do formulário para JSON
    })
    .then(response => response.text())
    .then(result => {
        alert(result);
        document.getElementById('cadastroFuncionario').reset();
        emailSending = false;
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

document.getElementById('modal-close').addEventListener('click', function () {
    $modal.style.display = 'none';
});

document.getElementById('open-modal').addEventListener('click', function () {
    $modal.style.display = 'block';
});

const swiper = new Swiper('.swiper-container', {
    // Configurações do carrossel
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
});