document.addEventListener("DOMContentLoaded", function() {
    const marcaSelect = document.getElementById("marca");
    const modeloSelect = document.getElementById("modelo");
    const anoSelect = document.getElementById("ano");
    const buscarButton = document.getElementById("buscar");
    const resultadoDiv = document.getElementById("resultado");
    const precoSpan = document.getElementById("preco");

    // Carregar Marcas
    fetch("https://parallelum.com.br/fipe/api/v1/carros/marcas")
        .then(response => response.json())
        .then(data => {
            data.forEach(marca => {
                const option = document.createElement("option");
                option.value = marca.id;
                option.textContent = marca.nome;
                marcaSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Erro ao carregar marcas:", error));

    // Carregar Modelos com base na Marca selecionada
    marcaSelect.addEventListener("change", function() {
        const marcaId = marcaSelect.value;
        if (marcaId) {
            modeloSelect.disabled = false;
            fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos`)
                .then(response => response.json())
                .then(data => {
                    modeloSelect.innerHTML = '<option value="">Selecione um Modelo</option>';
                    data.modelos.forEach(modelo => {
                        const option = document.createElement("option");
                        option.value = modelo.id;
                        option.textContent = modelo.nome;
                        modeloSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Erro ao carregar modelos:", error));
        } else {
            modeloSelect.disabled = true;
            anoSelect.disabled = true;
            anoSelect.innerHTML = '<option value="">Selecione um Ano</option>';
        }
    });

    // Carregar Anos com base no Modelo selecionado
    modeloSelect.addEventListener("change", function() {
        const marcaId = marcaSelect.value;
        const modeloId = modeloSelect.value;
        if (modeloId) {
            anoSelect.disabled = false;
            fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos/${modeloId}/anos`)
                .then(response => response.json())
                .then(data => {
                    anoSelect.innerHTML = '<option value="">Selecione um Ano</option>';
                    data.anos.forEach(ano => {
                        const option = document.createElement("option");
                        option.value = ano.codigo;
                        option.textContent = ano.nome;
                        anoSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Erro ao carregar anos:", error));
        } else {
            anoSelect.disabled = true;
        }
    });

    // Buscar Preço com base no Ano selecionado
    buscarButton.addEventListener("click", function() {
        const marcaId = marcaSelect.value;
        const modeloId = modeloSelect.value;
        const anoId = anoSelect.value;

        if (marcaId && modeloId && anoId) {
            fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaId}/modelos/${modeloId}/anos/${anoId}`)
                .then(response => response.json())
                .then(data => {
                    resultadoDiv.style.display = "block";
                    precoSpan.textContent = `R$ ${data.preco}`;
                })
                .catch(error => console.error("Erro ao buscar preço:", error));
        } else {
            alert("Por favor, selecione todos os campos.");
        }
    });
});
