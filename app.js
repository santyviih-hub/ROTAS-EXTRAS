let listaDrivers = [];

document.addEventListener("DOMContentLoaded", carregar);

async function carregar() {

    try {

        const drivers = await buscarDrivers();
        const agencias = await buscarAgencias();
        const rotas = await buscarRotas();

        listaDrivers = drivers;

        console.log("Drivers:", drivers);
        console.log("Agencias:", agencias);
        console.log("Rotas:", rotas);

        preencherMotoristas(drivers);

        const selectAgencia = document.getElementById("agencia");

        selectAgencia.innerHTML = "";

        agencias.forEach(a => {

            selectAgencia.innerHTML += `
                <option value="${a.agencia}">
                    ${a.agencia}
                </option>
            `;

        });

        renderizarRotas(rotas);

    } catch (erro) {

        console.error("Erro ao carregar:", erro);

        alert("Erro ao carregar dados da API.");

    }

}

function preencherMotoristas(drivers) {

    const lista = document.getElementById("motoristas");

    lista.innerHTML = "";

    drivers.forEach(driver => {

        lista.innerHTML += `
            <option value="${driver.nome}">
        `;

    });

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

    rotas.forEach(r => {

        divRotas.innerHTML += `
            <div class="card">

                <h3>${r.bairro}</h3>

                <p><strong>Cidade:</strong> ${r.cidade}</p>

                <p><strong>Gaiola:</strong> ${r.gaiola}</p>

                <button onclick='pegarRota(${JSON.stringify(r)})'>
                    Pegar rota
                </button>

            </div>
        `;

    });

}

async function pegarRota(rota) {

    try {

        const nomeDigitado =
            document.getElementById("buscarMotorista").value;

        const agencia =
            document.getElementById("agencia").value;

        const driver = listaDrivers.find(d =>
            d.nome === nomeDigitado
        );

        if (!driver) {

            alert("Selecione um motorista válido.");

            return;

        }

        const confirmar = confirm(
            `Confirmar rota?\n\n` +
            `Motorista: ${driver.nome}\n` +
            `Bairro: ${rota.bairro}\n` +
            `Cidade: ${rota.cidade}\n` +
            `Gaiola: ${rota.gaiola}`
        );

        if (!confirmar) return;

        const dados = {

            idDriver: driver.id,
            nome: driver.nome,
            telefone: driver.telefone,

            agencia: agencia,

            cidade: rota.cidade,
            bairro: rota.bairro,
            gaiola: rota.gaiola

        };

        const resultado = await reservarRota(dados);

        if (resultado.sucesso) {

            alert("✅ Rota reservada com sucesso!");

            const rotasAtualizadas =
                await buscarRotas();

            renderizarRotas(rotasAtualizadas);

        } else {

            alert("❌ " + resultado.mensagem);

        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao reservar rota.");

    }

}

window.pegarRota = pegarRota;
