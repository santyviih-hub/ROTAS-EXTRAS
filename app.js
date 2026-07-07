function renderizarRotas(rotas) {

    const divRotas =
        document.getElementById("rotas");

    if (!divRotas) {

        console.error(
            "DIV rotas não encontrada"
        );

        return;

    }

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

    rotas.forEach(r => {

        html += `
            <div class="card">

                <h3>${r.bairro}</h3>

                <p>
                    <strong>Cidade:</strong>
                    ${r.cidade}
                </p>

                <p>
                    <strong>Gaiola:</strong>
                    ${r.gaiola}
                </p>

                <button
                    onclick='pegarRota(${JSON.stringify(r)})'
                >
                    Pegar rota
                </button>

            </div>
        `;

    });

    divRotas.innerHTML = html;

}
