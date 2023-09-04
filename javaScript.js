$(document).ready(function() {
    let estadosObj;

    let statesModal = new bootstrap.Modal($("#statesModal"));
    let citiesModal = new bootstrap.Modal($("#citiesModal"));

    var settings = {
        url: "https://brasilapi.com.br/api/ibge/uf/v1/",
        method: "GET",
        timeout: 0,
    };

    fetch(settings.url, {
        method: settings.method
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Erro na requisição de rede');
        }
        return response.json();
    })
    .then(function(response) {
        console.log(response);
        estadosObj = response;
    })
    
    $(".btn-states").on("click", function(event) {
        let siglaRegion = $(event.target).attr("region");
        let estados = estadosObj.filter(estado => estado.regiao.sigla == siglaRegion);
        let countTitleText = estados.length + " States Found";
        $("#countTitle").html(countTitleText);
        let regionTitleText = $(event.target).parent().find("h5").html();
        $("#regionTitle").html(regionTitleText);
        $("#state-modal-body").html("");

        for(let i = 0; i < estados.length; i++){
            let card = $("#cloneCard").clone();
            card.removeAttr("id");
            card.find(".btn-cities").attr("state", estados[i].sigla);
            card.find(".card-title").html(estados[i].nome);
            $("#state-modal-body").append(card);
        }

        $(".btn-cities").on("click", function(event){
            let siglaState = $(event.target).attr("state");
            let stateTitleText = $(event.target).parent().find("h5").html();

            var settings = {
                url: "https://brasilapi.com.br/api/ibge/municipios/v1/" + siglaState + "?providers=dados-abertos-br,gov,wikipedia",
                method: "GET",
                timeout: 0,
            };

            fetch(settings.url, {
                method: settings.method
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Erro na requisição de rede');
                }
                return response.json();
            })
            .then(function(response) {
                let citiesObj = response;
                let countTitleTextCities = citiesObj.length + " Cities Found";
                $("#count-city-title").html(countTitleTextCities);
                $("#state-title").html(stateTitleText);
                $("#city-modal-body").html("");

                for(let i = 0; i < citiesObj.length; i++){
                    let link = $("#clone-link").clone();
                    link.removeAttr("id");
                    let hrefLink = "https://www.google.com/search?q=" + citiesObj[i].nome;
                    let htmlLink = citiesObj[i].nome + " - " + citiesObj[i].codigo_ibge;
                    link.attr("href", hrefLink);
                    link.html(htmlLink);
                    $("#city-modal-body").append(link);
                }

                statesModal.hide();
                citiesModal.show();
            })
            
        });

        statesModal.show();
    });
});
