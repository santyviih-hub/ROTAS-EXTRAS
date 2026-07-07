document.addEventListener("DOMContentLoaded", carregar);

async function carregar() {

    try {

        const drivers = await buscarDrivers();
        const agencias = await buscarAgencias();
        const rotas = await buscarRotas();

        console.log("Drivers:", drivers);
        console.log("Agencias:", agencias);
        console.log("Rotas:", rotas);

        // MOTORISTAS
        const selectDriver = document.getElementById("driver");
        selectDriver.innerHTML = "";

        drivers.forEach(driver => {

            const option = document.createElement("option");

            option.value = driver.id;
            option.textContent = driver.nome;

            selectDriver.appendChild(option);

        });

        // AGÊNCIAS
        const selectAgencia = document.getElementById("agencia");
        selectAgencia.innerHTML = "";

        agencias.forEach(agencia => {

            const option = document.createElement("option");

            option.value = agencia.agencia;
            option.textContent = agencia.agencia;

            selectAgencia.appendChild(option);

        });

        // ROTAS
        renderizarRotas(rotas);

    } catch (erro) {

        console.error("Erro ao carregar:", erro);

        alert("Erro ao carregar dados da API.");

    }

}

function renderizarRotas(rotas) {

    const divRotas = document.getElementById("rotas");

    divRotas.innerHTML = "";

    if (!rotas || rotas.length === 0) {

        divRotas.innerHTML = `
            <div class="card">
                <h3>Nenhuma rota disponível</h3>
            </div>
        `;

        return;

    }

    rotas.forEach((rota, index) => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${rota.bairro}</h3>

            <p>
                <strong>Cidade:</strong>
                ${rota.cidade}
            </p>

            <p>
                <strong>Gaiola:</strong>
                ${rota.gaiola}
            </p>

            <button id="rota-${index}">
                Pegar rota
            </button>
        `;

        divRotas.appendChild(card);

        const botao = document.getElementById(`rota-${index}`);

        botao.addEventListener("click", () => {

            pegarRota(rota);

        });

    });

}

async function pegarRota(rota) {

    try {

        const driverSelect = document.getElementById("driver");
        const agenciaSelect = document.getElementById("agencia");

        const driverId = driverSelect.value;

        const drivers = await buscarDrivers();

        const driver = drivers.find(d => d.id == driverId);

        if (!driver) {

            alert("Selecione um motorista.");

            return;

        }

        const confirmar = confirm(
            `Confirmar rota?\n\n` +
            `Bairro: ${rota.bairro}\n` +
            `Cidade: ${rota.cidade}\n` +
            `Gaiola: ${rota.gaiola}`
        );

        if (!confirmar) return;

        const dados = {

            idDriver: driver.id,
            nome: driver.nome,
            telefone: driver.telefone,

            agencia: agenciaSelect.value,

            cidade: rota.cidade,
            bairro: rota.bairro,
            gaiola: rota.gaiola

        };

        const resultado = await reservarRota(dados);

        if (resultado.sucesso) {

            alert("✅ Rota reservada com sucesso!");

            const rotasAtualizadas = await buscarRotas();

            renderizarRotas(rotasAtualizadas);

        } else {

            alert("❌ " + resultado.mensagem);

        }

    } catch (erro) {

        console.error("Erro ao reservar rota:", erro);

        alert("❌ Falha na comunicação com o servidor.");

    }

}

window.pegarRota = pegarRota;
window.carregar = carregar;
