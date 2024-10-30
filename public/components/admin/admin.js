document.getElementById('getDoacao').addEventListener('click', function(event) {
    event.preventDefault(); // Evita o redirecionamento da página


    // Envia a requisição para o backend usando fetch
    fetch('http://localhost:3000/getDoacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.text())
    .then(result => {
        $(".headers").html(`
            <span>ID</span>
            <span>CPF</span>
            <span>VALOR</span>
            <span>Meio de pagamento</span>
        `)
        $(".dados").html(``)
        Object.entries(JSON.parse(result)).forEach(([k, v]) => {
            $('.dados').append(`
                <div class="dado">
                    <span>${v.id}</span>
                    <span>${v.cpf}</span>
                    <span>R$${v.valor}</span>
                    <span>${v.tipo}</span>
                </div>
            `)
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});

document.getElementById('getVoluntarios').addEventListener('click', function(event) {
    event.preventDefault(); // Evita o redirecionamento da página


    // Envia a requisição para o backend usando fetch
    fetch('http://localhost:3000/getVoluntarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.text())
    .then(result => {
        $(".headers").html(`
            <span>CPF</span>
            <span>NOME</span>
            <span>EMAIL</span>
            <span>TELEFONE</span>
            <span>DESCRIÇÃO</span>
        `)
        $(".dados").html(``)
        Object.entries(JSON.parse(result)).forEach(([k, v]) => {
            $('.dados').append(`
                <div class="dado">
                    <span>${v.cpf}</span>
                    <span>${v.nome}</span>
                    <span>${v.email}</span>
                    <span>${v.telefone}</span>
                    <span>${v.desc}</span>
                </div>
            `)
        });
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});


document.getElementById('cadastrar').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o redirecionamento da página

    const formData = new FormData(this);
    const data = {
        nome: formData.get('nome'),
        desc: formData.get('desc'),
        idade: formData.get('idade'),
    };
    var caracteristicas = ""
    var options = document.querySelectorAll(".option-checkbox")
    options.forEach(element => {
        if (element.checked) {
            caracteristicas+=" "+element.value
        }
    });
    data.caracteristicas = caracteristicas
    const meuImput = document.getElementById('foto');
    new Compressor(meuImput.files[0], {
        quality: 0.6, // Reduz a qualidade para 60%
        success(result) {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onload = function () {
                data.foto = reader.result
                
                fetch('http://localhost:3000/cadastrarAnimal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.text())
                .then(result => {
                    alert(result);
                    document.getElementById('cadastrar').reset();
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
            };
        }
    })
    
});

document.getElementById('getAdocao').addEventListener('click', function(event) {
    $('.main').hide()
    $('.cadastrarAnimal').show()
});

document.getElementById('getDoacao').addEventListener('click', function(event) {
    $('.main').show()
    $('.cadastrarAnimal').hide()
});

document.getElementById('getVoluntarios').addEventListener('click', function(event) {
    $('.main').show()
    $('.cadastrarAnimal').hide()
});
