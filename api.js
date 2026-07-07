async function buscarDrivers() {

    try {

        const resposta = await fetch(
            API_URL + "?acao=drivers"
        );

        return await resposta.json();

    } catch (erro) {

        console.error("Erro Drivers:", erro);

        return [];

    }

}

async function buscarAgencias() {

    try {

        const resposta = await fetch(
            API_URL + "?acao=agencias"
        );

        return await resposta.json();

    } catch (erro) {

        console.error("Erro Agências:", erro);

        return [];

    }

}

async function buscarRotas() {

    try {

        const resposta = await fetch(
            API_URL + "?acao=rotas"
        );

        return await resposta.json();

    } catch (erro) {

        console.error("Erro Rotas:", erro);

        return [];

    }

}

async function reservarRota(dados) {

    try {

        const formData = new FormData();

        formData.append(
            "dados",
            JSON.stringify(dados)
        );

        const resposta = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        return await resposta.json();

    } catch (erro) {

        console.error("Erro Reserva:", erro);

        return {
            sucesso: false,
            mensagem: "Falha na comunicação com o servidor"
        };

    }

}
