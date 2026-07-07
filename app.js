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

        const selectAgencia =
            document.getElementById("agencia");

        if (!selectAgencia) {

            console.error("Elemento agencia não encontrado");
            return;

        }

        selectAgencia.innerHTML = `
            <option value="">
                Selecione uma agência
            </option>
        `;

        agencias.forEach(a => {

            selectAgencia.innerHTML += `
                <option value="${a.agencia}">
                    ${a.agencia}
                </option>
            `;

        });

        renderizarRotas(rotas);

    } catch (erro) {

        console.error(
            "Erro ao carregar:",
            erro
        );

        alert(
            "Erro ao carregar dados da API."
        );

    }

}

function preencherMotoristas(drivers) {

    const lista =
        document.getElementById("motoristas");

    if (!lista) return;

    lista.innerHTML = drivers
        .map(driver =>
            `<option value="${driver.nome}">`
        )
        .join("");

}

function renderizarRotas(rotas) {

    const divRotas =
        document.getElementById("rotas");

    if (!divRotas) return;

    divRotas.innerHTML = "";

    const titulo =
        document.getElementById("tituloRotas");

    if (titulo) {

        titulo.innerHTML =
            `📦 Rotas Disponíveis (${rotas ? rotas.length : 0})`;

    }

    if (!rotas || rotas.length === 0) {

        divRotas.innerHTML = `
            <div class="card">
                <h3>Nenhuma rota disponível</h3>
            </div>
        `;

        return;

    }

    let html = "";

    rotas.forEach(rota => {

        html += `
            <div class="card">

                <h3>${rota.bairro}</h3>

                <p>
                    <strong>Cidade:</strong>
                    ${rota.cidade}
                </p>

                <p>
                    <strong>Gaiola:</strong>
                    ${rota.gaiola}
                </p>

                <button
                    onclick='pegarRota(${JSON.stringify(rota)})'
                >
                    Pegar rota
                </button>

            </div>
        `;

    });

    divRotas.innerHTML = html;

}

async function pegarRota(rota) {

    try {

        const nomeDigitado =
            document.getElementById(
                "buscarMotorista"
            ).value.trim();

        const agencia =
            document.getElementById(
                "agencia"
            ).value;

        if (!nomeDigitado) {

            alert(
                "Digite o nome do motorista."
            );

            return;

        }

        if (!agencia) {

            alert(
                "Selecione uma agência."
            );

            return;

        }

        const driver =
            listaDrivers.find(
                d => d.nome === nomeDigitado
            );

        if (!driver) {

            alert(
                "Selecione um motorista válido."
            );

            return;

        }

        const confirmar = confirm(
            `CONFIRMAR ROTA\n\n` +
            `Motorista: ${driver.nome}\n` +
            `Agência: ${agencia}\n` +
            `Bairro: ${rota.bairro}\n` +
            `Cidade: ${rota.cidade}\n` +
            `Gaiola: ${rota.gaiola}`
        );

        if (!confirmar) return;

        const dados = {

            idDriver: driver.id,
            nome: driver.nome,
            telefone: driver.telefone || "",

            agencia: agencia,

            cidade: rota.cidade,
            bairro: rota.bairro,
            gaiola: rota.gaiola

        };

        const resultado =
            await reservarRota(dados);

        if (resultado.sucesso) {

            alert(
                "✅ Rota reservada com sucesso!"
            );

            document.getElementById(
                "buscarMotorista"
            ).value = "";

            document.getElementById(
                "agencia"
            ).selectedIndex = 0;

            const rotasAtualizadas =
                await buscarRotas();

            renderizarRotas(
                rotasAtualizadas
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } else {

            alert(
                "❌ " +
                resultado.mensagem
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao reservar rota:",
            erro
        );

        alert(
            "Erro ao reservar rota."
        );

    }

}

window.pegarRota = pegarRota;
