let taxaCanvi = null;
const selectCiutat = document.getElementById("selectorCiutat");
const cardResum = document.getElementById("cardResum");
const imagenCiudadSection = document.getElementById("imagenCiudad");
const nomCiutatSection = document.getElementById("tituloCiudad");

/* Informació meteorològica */
const infoMeteorologicSection = document.getElementById("infoMeteorologic");
const tempActual = document.getElementById("tempActual");
const tempIcon = document.getElementById("tempIcon");
const tempText = document.getElementById("tempText");

/*Conversió moneda*/
const convMoneda = document.getElementById("convMoneda");
const monedaOrigen = document.getElementById("currency-first");
const quantitatIntro = document.getElementById("quantitatIntro");
const monedaDesti = document.getElementById("currency-second"); 
const quantitatIntroSegona = document.getElementById("quantitatIntroSegona");
const canviTaxa = document.getElementById("exchange-rate");

/* Missatge de viatge */
const MsgViatge = document.getElementById("MsgViatge");
const msgPantallaP = document.querySelector(".msgPantalla");

//Slider
const sliderContainer = document.querySelector('.slider-container');

const nomCiutat = document.querySelector("#tituloCiudad h1");
const nomPais = document.querySelector("#tituloCiudad h3");

const imagenCiudad = document.querySelector("#imagenCiudad > img");


selectCiutat.addEventListener("change", () => {
    const ciutatSeleccionada = selectCiutat.value;
    if (ciutatSeleccionada === "") { // Si no se selecciona ninguna ciudad, se oculta la sección de resumen y se muestra un mensaje de bienvenida
        return;
    }
    updateSlider(ciutatSeleccionada);
    imagenCiudad.src = paisos[ciutatSeleccionada].img;
    nomCiutat.textContent = paisos[ciutatSeleccionada].nom;
    nomPais.textContent = paisos[ciutatSeleccionada].pais;
    const latitud = paisos[ciutatSeleccionada].latitud;
    const longitud = paisos[ciutatSeleccionada].longitud;
    ciutatMeteoro(latitud, longitud);
});

/* Informació meteorològica */
//Si el informacio metrologica no funciona torna a posar https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability
async function ciutatMeteoro(lat, lon) {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability`);
    //control de errores
    const data = await res.json();
    console.log(data);

    const horaActual = data.current_weather.time;
    const indexHora = data.hourly.time.indexOf(horaActual);
    const temperatura = Math.round(data.current_weather.temperature);
    const precipitacio = data.hourly.precipitation_probability[indexHora] ?? 0; // el[indexHora] ?? 0 es para evitar que si el valor de precipitació es undefined, se asigne un valor de 0 en su lugar, lo que garantiza que siempre haya un valor numérico para trabajar en el resto del código.
    console.log(precipitacio);

    document.getElementById("tempActual").textContent = `${temperatura}°C`;
    if (precipitacio < 20) {
        tempIcon.textContent = `☀️`;
        tempText.textContent = `Probabilitat de precipitació: ${precipitacio}%`;
    } else if (precipitacio >= 20 && precipitacio < 50) {
        tempIcon.textContent = `🌦️`;
        tempText.textContent = `Probabilitat de precipitació: ${precipitacio}%`;
    } else if (precipitacio >= 50) {
        tempIcon.textContent = `🌧️`;
        tempText.textContent = `Probabilitat de precipitació: ${precipitacio}%`;
    }
    // Mostra un missatge de sol o pluja segons la precipitació i la ciutat seleccionada
    // Sense aixo no mostra res 
    msgOpcions(precipitacio, selectCiutat.value);
}

taxaActualitzacio();

/*Conversió moneda*/
function taxaActualitzacio() {
    console.log("hellooooo");
    fetch(`https://v6.exchangerate-api.com/v6/26c7854d8e9b49b10d7b5a58/latest/${monedaOrigen.value}`
    ).then((res) => res.json()).then((data) => {
        const tasa = data.conversion_rates[monedaDesti.value]; //aqui lu que fem es agafar la taxa de canvi de la moneda desti que hem seleccionat, i la guardem en una variable
        console.log(tasa);
        canviTaxa.innerText = `1 ${monedaOrigen.value} = ${tasa + " " + monedaDesti.value}`; // el 1 es la quantitat de moneda origen que volem convertir, i el resultat es la quantitat de moneda desti que obtindrem amb aquesta conversió
        const resultat = quantitatIntro.value * tasa;
        quantitatIntroSegona.value = Math.floor(resultat * 100) / 100;
    });
}
monedaOrigen.addEventListener("change", taxaActualitzacio);
monedaDesti.addEventListener("change", taxaActualitzacio);
quantitatIntro.addEventListener("input", taxaActualitzacio);

/* Missatge de viatge */
function msgOpcions(precipitacio, ciutatSeleccionada) {
    const msgSol = paisos[ciutatSeleccionada].msg.sol;
    const msgPluja = paisos[ciutatSeleccionada].msg.pluja;

    if (precipitacio < 20) {
        const msgAleatoriSol = msgSol[Math.floor(Math.random() * msgSol.length)]; //el Math.floor(Math.random() * msgSol.length ens serveix per generar un numero aleatori entre 0 i la longitud del array de missatges de sol, i d'aquesta manera mostrar un missatge diferent cada vegada que es selecciona una ciutat amb sol
        msgPantallaP.textContent = msgAleatoriSol;
    } else {
        const msgAleatoriPluja = msgPluja[Math.floor(Math.random() * msgPluja.length)];
        msgPantallaP.textContent = msgAleatoriPluja;
    }
};

const paisos = {
    "1": {
        nom: "Barcelona",
        pais: "Espanya",
        latitud: "41.3874",
        longitud: "2.1686",
        moneda_local: "EUR",
        img: "/img/pexels-yademidov-36768090.jpg",
        color: "blue",
        imgSlider: [
            {
                nomP: "Parc Güell",
                img: "/img/img-PARQUE-GuELL.jpg",
                title: "Free tour pel Parc Güell",
                link: "https://www.civitatis.com/es/barcelona/free-tour-parque-guell/?ttdsrc=tpa&currency=EUR&aid=117&cmp=all_TTD&cmpint=_TTD_Espa%C3%B1a_Barcelona&gad_source=1&gad_campaignid=20837154927&gbraid=0AAAAADSEWH05WDuBFPsqcNjXhwRKJGl3p&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-VzrRV4iqvwdnU39qFZp6ZlGtbBHSLdc_lmU1tueXh7PM3ptpUxpRBoCtyYQAvD_BwE"
            },
            {
                nomP: "Sagrada Família",
                img: "/img/img-sagradafamilia.jpg",
                title: "Tiquet d'accés a la Sagrada Família amb audioguia",
                link: "https://www.getyourguide.com/es-es/barcelona-l45/sagrada-familia-ticket-de-entrada-sin-colas-t50027/?ranking_uuid=5bd43c2e-da72-47d1-a1f0-6be819b16086"
            },
            {
                nomP: "Casa Batlló",
                img: "/img/img-casa-batllo.jpg",
                title: "Visita guiada per la Casa Batlló",
                link: "https://www.civitatis.com/es/barcelona/visita-guiada-casa-batllo/?srsltid=AfmBOopfPqMC8AIJF-fNH9Lz4VYoekKOb49o2asMzPvt7oMDJnQhPZ7Y"
            },
            {
                nomP: "Barri Gòtic",
                img: "/img/img-Barrio_Gotico.jpg",
                title: "Visita guiada per la Casa Batlló",
                link: "https://www.civitatis.com/es/barcelona/visita-guiada-casa-batllo/?srsltid=AfmBOopfPqMC8AIJF-fNH9Lz4VYoekKOb49o2asMzPvt7oMDJnQhPZ7Y"
            },
        ],
        msg: {
            pluja: [
                "La pluja acompanya per fer un pla cobert com visitar La Pedrera",
                "Recorda agafar el paraigua! Si vols un pla cobert, pots aprofitar per descobrir el Museu Nacional d’Art de Catalunya",
                "Recorda que avui plou! Si vols un pla cobert, pots refugiar‑te en una cafeteria típica del Born"
            ],
            sol: [
                "Amb aquest sol, és perfecte per gaudir d’unes vistes increïbles des del Parc Güell",
                "Avui és un dia ideal per descobrir el Barri Gòtic",
                "Aprofita el bon temps per passejar pel Port Olímpic"
            ]
        }
    },
    "2": {
        nom: "London",
        pais: "Regne Unit",
        latitud: "51.3026",
        longitud: "-0.12574",
        moneda_local: "GBP",
        img: "/img/photo-1675518482021-19ad136762d4.jpeg",
        imgSlider: [
            {
                nomP: "Camden Lock",
                img: "/img/img-camden-lock.jpg",
                title: "Londres: Tour a peu per Camden",
                link: "https://www.getyourguide.com/es-es/londres-l57/londres-tour-a-pie-por-camden-t609682/?ranking_uuid=043c3376-1a91-4e12-b751-6ae0830e0c21"
            },
            {
                nomP: "Notting Hill",
                img: "/img/img-nottinghill.jpg",
                title: "Free tour per Notting Hill",
                link: "https://www.civitatis.com/es/londres/free-tour-notting-hill/?srsltid=AfmBOoqmZjn5FBsILddhF-hvrGT1W7U9m56x4Qb_yUAWJGP8hLwNf3TY"
            },
            {
                nomP: "Museu d'Història Natural",
                img: "/img/img-museo_de_historia_natural.jpg",
                title: "Visita guiada pel Museu d´Història Natural",
                link: "https://www.civitatis.com/es/londres/visita-guiada-museo-historia-natural/?aid=100&cmp=es_ES_Nonbrand&cmpint=_ActividadesINTL_Londres_RSA_217466&gclsrc=aw.ds&gad_source=1&gad_campaignid=393227600&gbraid=0AAAAADSEWH3Pw-QkO8yzbXBeQz95FzRmM&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-de1rUjOkKomlVKeE7O-vc5n3SKqXGeAZYPCSXTHODtHFEOKHr71PxoCj6QQAvD_BwE"
            },
            {
                nomP: "Big Ben",
                img: "/img/img-Big_Ben.jpg",
                title: "Visites guiades al Big Ben",
                link: "https://www.parliament.uk/visiting/visiting-and-tours/big-ben-tour/"
            },
        ],
        msg: {
            pluja: [
                "Recorda agafar el paraigua! Si vols un pla cobert, és un bon moment per anar de compres per Camden Lock",
                "Recorda agafar el paraigua! Si vols un pla cobert, és un bon moment per visitar el Natural History Museum",
                "Recorda que avui plou! Si vols un pla cobert, pots refugiar‑te en una cafeteria típica i gaudir d’una estona tranquil·la"
            ],
            sol: [
                "Avui fa un dia esplèndid per passejar pel barri de Notting Hill",
                "Avui és un dia perfecte per visitar el mercat de Portobello Road",
                "Avui és un dia ideal per fer un pícnic al Hyde Park"
            ]
        }
    },
    "3": {
        nom: "Paris",
        pais: "França",
        latitud: "48.85341",
        longitud: "2.3488",
        moneda_local: "EUR",
        img: "/img/photo-1591289009723-aef0a1a8a211.jpeg",
        imgSlider: [
            {
                nomP: "Museu del Louvre",
                img: "/img/Louvre.jpg",
                title: "Visita guiada pel Museu del Louvre",
                link: "https://www.civitatis.com/es/paris/visita-guiada-museo-louvre/?aid=100&cmp=es_ES_Nonbrand&cmpint=_ActividadesINTL_Paris_RSA_237&gclsrc=aw.ds&gad_source=1&gad_campaignid=963895890&gbraid=0AAAAADSEWH2dCPnOZ4_fIh46ZqI98vCNT&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-dQsrAFq9-ZecT-KmA3gIHSJi6AteiAqu9dpFrf1tJI5aeYO73yeLhoCcfkQAvD_BwE"
            },
            {
                nomP: "Galerías Lafayette",
                img: "/img/img-Galeries_Lafayette.jpg",
                title: "Galerías Lafayette",
                //link: "https://www.civitatis.com/es/paris/visita-guiada-museo-louvre/?aid=100&cmp=es_ES_Nonbrand&cmpint=_ActividadesINTL_Paris_RSA_237&gclsrc=aw.ds&gad_source=1&gad_campaignid=963895890&gbraid=0AAAAADSEWH2dCPnOZ4_fIh46ZqI98vCNT&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-dQsrAFq9-ZecT-KmA3gIHSJi6AteiAqu9dpFrf1tJI5aeYO73yeLhoCcfkQAvD_BwE"
            },
            {
                nomP: "Torre Eiffel",
                img: "/img/img-Torre_Eiffel.jpg",
                title: "Preparació tour torre eiffel",
                link: "https://www.toureiffel.paris/es"
            },
            {
                nomP: "Río Sena",
                img: "/img/img-rioSena.jpg",
                title: "Passeig amb vaixell pel Sena",
                link: "https://www.civitatis.com/es/paris/paseo-barco-sena/?aid=100&cmp=es_ES_Nonbrand&cmpint=_ActividadesINTL_Paris_RSA_813&gclsrc=aw.ds&gad_source=1&gad_campaignid=14375358685&gbraid=0AAAAADSEWH35_5q6yXGdI36prKg088xjR&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-bY4-_yINBs4ScUTzYGyjTK6vY_nG4MGkoHGk_lvHQQPGaE6wf-jzxoCExEQAvD_BwE"
            },
        ],
        msg: {
            pluja: [
                "Recorda agafar el paraigua! Si vols un pla cobert, és un bon moment per visitar el Louvre",
                "Refugia’t en una cafeteria típica i gaudeix de l’ambient parisenc",
                "Recorda que avui plou! Si vols un pla cobert, pots refugiar‑te en una cafeteria típica i gaudir d’una estona tranquil·la"
            ],
            sol: [
                "Avui és un bon dia per passejar per la riba del Sena",
                "Avui és un dia perfecte per visitar la Torre Eiffel",
                "Avui és un dia ideal per fer un pícnic al Jardí de les Tuileries"
            ]
        }
    },
    "4": {
        nom: "New York",
        pais: "Estats Units",
        latitud: "40.71427",
        longitud: "-74.00597",
        moneda_local: "USD",
        img: "/img/photo-1492217072584-7ff26c10eb75.jpeg",
        imgSlider: [
            {
                nomP: "Central Park",
                img: "/img/img-Central_Park.jpg",
                title: "Visita gratuïta per Central Park",
                link: "https://www.civitatis.com/es/nueva-york/tour-central-park/?ttdsrc=tpa&currency=EUR&aid=117&cmp=all_TTD&cmpint=_TTD_USA_NuevaYork&gad_source=1&gad_campaignid=20843461103&gbraid=0AAAAADSEWH1Lz4mtvGrjIIiPuYKan6IeP&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-YFpFbKqDbnjawPWPxvpx1BmZamYEWMiL9rCvhwlMewqLycYSxXUgxoCQhIQAvD_BwE"
            },
            {
                nomP: "Museo Americano de Historia Natural",
                img: "/img/img-Museo_Americano_de_Historia_Natural.jpg",
                title: "Ciutat de Nova York Entrada al Museu Americano d'Història Natural",
                link: "https://www.getyourguide.com/es-es/nueva-york-l59/entrada-super-saver-al-museo-americano-de-historia-natural-t25757/?ranking_uuid=cb39275a-91fc-45fa-82e6-aed90319b1ab"
            },
            {
                nomP: "Estatua de la Libertad",
                img: "/img/img-estatua_de_la_libertad.jpeg",
                title: "Passeig amb vaixell per l'Estàtua de la Llibertat",
                link: "https://www.civitatis.com/es/nueva-york/paseo-barco-estatua-libertad/?aid=100&cmp=es_ES_Nonbrand&cmpint=_ActividadesINTL_NuevaYork_DSA&gclsrc=aw.ds&gad_source=1&gad_campaignid=393680720&gbraid=0AAAAADSEWH2PatUepYj8uQz5tRl68oYqC&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-bpp9gKs1rrsSHZbQFmUPWLZK-PCnaq6Us_NU9df4vwlxub20NmpSxoC6hcQAvD_BwE"
            },
            {
                nomP: "Times Square",
                img: "/img/img-Times_Square.jpeg",
                title: "Times Square",
                //link: "https://www.getyourguide.com/es-es/nueva-york-l59/entrada-super-saver-al-museo-americano-de-historia-natural-t25757/?ranking_uuid=cb39275a-91fc-45fa-82e6-aed90319b1ab"
            },
        ],
        msg: {
            pluja: [
                "Recorda agafar el paraigua! Si vols un pla cobert, és un bon moment per visitar el Museu d’Art Modern (MoMA)",
                "Recorda agafar el paraigua! Si vols un pla cobert, és un bon moment per visitar el Museo Americano de Historia Natural",
                "Recorda que avui plou! Si vols un pla cobert, pots refugiar‑te en una cafeteria típica i gaudir d’una estona tranquil·la"
            ],
            sol: [
                "Avui és un dia ideal per visitar Central Park",
                "Avui és un dia perfecte per visitar la Estatua de la Libertad",
                "Avui és un dia esplèndid per passejar per Times Square"
            ]
        }
    },
    "5": {
        nom: "Tokyo",
        pais: "Japó",
        latitud: "35.6895",
        longitud: "139.69171",
        moneda_local: "JPY",
        img: "/img/imgTokyo.jpeg",
        imgSlider: [
            {
                nomP: "Museo Nacional de Tokio",
                img: "/img/img-Museo_Nacional_de_Tokio.jpg",
                title: "Visita guiada pel Museu Nacional de Tòquio",
                link: "https://www.civitatis.com/es/tokio/visita-guiada-museo-nacional-tokio/?srsltid=AfmBOoq2DrWQqWdiEZLiHcvo-bJlxt2A7AqeVOpdS9XnFLMYdPOt0Ae9"
            },
            {
                nomP: "Santuario Meiji",
                img: "/img/img-Santuari_Meiji.jpg",
                title: "Free tour pel Santuari Meiji i el Parc Yoyogi",
                link: "https://www.civitatis.com/es/tokio/free-tour-santuario-meiji-parque-yoyogi/?aid=100&cmp=es_ES_Nonbrand&cmpint=_FreeToursINTL_Global_DSA&gclsrc=aw.ds&gad_source=1&gad_campaignid=14306546091&gbraid=0AAAAADSEWH39M5SGq7OcJ4YrxwwMx3Unf&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-QQtDbjUAFzPx5GnSQIJypPqF6pGoJ-qMY5Nti2EcBq-5rF-909kdhoCB9oQAvD_BwE"
            },
            {
                nomP: "Shinjuku",
                img: "/img/img-Shinjukuu.jpg",
                title: "Free tour per Shinjuku",
                link: "https://www.civitatis.com/es/tokio/free-tour-shinjuku/?aid=100&cmp=es_ES_Nonbrand&cmpint=_FreeToursINTL_Global_DSA&gclsrc=aw.ds&gad_source=1&gad_campaignid=14306546091&gbraid=0AAAAADSEWH39M5SGq7OcJ4YrxwwMx3Unf&gclid=CjwKCAjw4ufOBhBkEiwAfuC7-aDtsbtFRrE0WH-KEtjdkWE16J8hjC5lYyhvp9Qx_OEV_vAajgeWBBoC8AIQAvD_BwE"
            },
            {
                nomP: "Torre de Tokio",
                img: "/img/img-Torre_de_Tokio.jpg",
                title: "Entrada a l'observatori de la Torre de Tokio",
                link: "https://www.civitatis.com/es/tokio/entrada-torre-tokio/?srsltid=AfmBOoraveQZWXWd7qkLF0uFWCVrtT-2wNq1wdCxV5_JJC7JwOS5sFFq"
            },
        ],
        msg: {
            pluja: [
                "Recorda agafar el paraigua! Si vols un pla cobert, és un bon moment per visitar el Museu de Tokio",
                "Recorda que avui plou! Si vols un pla cobert, pots refugiar‑te en una cafeteria típica i gaudir d’una estona tranquil·la",
                "Recorda agafar el paraigua! Si vols un pla cobert, és un bon moment per visitar el Museu d’Art Contemporani de Tokio"
            ],
            sol: [
                "Avui és un dia ideal per visitar el Parc de Shinjuku Gyoen",
                "Avui és un dia perfecte per visitar el Santuari Meiji",
                "Avui és un dia esplèndid per passejar pel barri de Shibuya"
            ]
        }
    }
};