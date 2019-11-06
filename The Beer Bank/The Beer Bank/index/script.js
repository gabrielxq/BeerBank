const endpoint = "https://api.punkapi.com/v2/beers?page=1&per_page=80";

// beers by strength
$.getJSON(endpoint, function (data) {

  // Filtrar as Informações
  let weakBeers = data.filter(beer => beer.abv <= 4.5);
  let medBeers = data.filter(beer => beer.abv);
  let strongBeers = data.filter(beer => beer.abv > 7.5 && beer.abv <= 50);

  // Mostrar informação e classe filtrada
  function Display(range, percent) {
    // Construir um HTML com a informação obtida
    let beerHtml = range.map(
      item =>
        `
          <div class = 'beer-wrapper'>
          <div class = "beer ${percent}">
            <i class="fa fa-star-o" id="estrela" aria-hidden="true"></i>
            <img class ="beer_img" src = "${item.image_url}">
            <h3 class="beer_name">${item.name}</h3>
            <h4 class ="beer_tagline">${item.tagline}</h4>
            
           
           </div>
           <div class ="pop-up">
            <button type"submit" class="window-close bg-button" aria-hidden="true">X</button>
            <img class ="beer_img" src = "${item.image_url}">
            <div class="edita-pop">
              <h3 class ="title">Description</h3>
              <p>${item.description}</p>
              <h3 class ="title">Food Pairing</h3>
                <ul>
                 ${item.food_pairing
          .map(ingredient => `<li>${ingredient}</li>`)
          .join("")}
  
                </ul>
                </div>
            </div>
          </div>
         
              `
    );

    $(".beers").append(beerHtml);
  }
  // Chamar o HTML filtrado com as classes diferentes
  Display(weakBeers, "weak");
  Display(medBeers, "medium");
  Display(strongBeers, "strong");


  // Pop up - Informações extras da cerveja
  $(".beer img").on("click", function () {
    $(this)
      .closest(".beer-wrapper")
      .find(".pop-up")
      .fadeIn();
    $(".bg").fadeIn();
  });

  $(".window-close").on("click", function () {
    $(".pop-up").fadeOut();
    $(".bg").fadeOut();
  });

  /*-------------Função Estrela Favorito-------------*/
  const estrela = document.querySelectorAll('#estrela');
  function ativaFunc(event) {
    event.currentTarget.classList.toggle('ativa_estrela');
  }
  estrela.forEach((link) => {
    link.addEventListener('click', ativaFunc);
  });
});



class BeerAPI {
  constructor() {
    this.apiUrl = 'https://api.punkapi.com/v2/beers'
  }

  searchByName(name, callback) {
    const url = this.apiUrl
    const params = {
      'beer_name': name
    }

    $.getJSON(url, params)
      .done((data) => {
        callback(data)
      })
      .fail((response) => {
        callback(null)
      })
  }
}

class BeerSearch {
  constructor() {
    this.BeerAPI = new BeerAPI()
    this.elements = {
      'form': $('#search-form'),
      'input': $('#search-input'),
      'results': $('#results')
    }

    this.registerEvents()
  }


  registerEvents() {
    this.elements.form.on('submit', (e) => {
      e.preventDefault()
      const userInput = this.elements.input.val().trim()

      this.BeerAPI.searchByName(
        userInput, (data) => {
          this.showResults(data)
          console.log(data)
        }
      )
    })

  }

  showResults(data) {
    this.elements.results.html('')

    if (data.length === 0) {
      this.showError('This beer was found in the database')
    } else {
      $('#error').remove()
      data.forEach((item) => {
        this.elements.results.append(`


          <div class = 'beer-wrapper' id="modal-wrapper">
            <i class="fa fa-star-o" id="estrela"></i>
            <img class ="beer_img" src = "${item.image_url}">
            <h3 class="beer_name">${item.name}</h3>
            <h4 class ="beer_tagline">${item.tagline}</h4>
            </div>

            
            <div class = 'up meumodal'>
            <button type"submit" class="window-close bg-button">X</button>
            <img class ="beer_img" src = "${item.image_url}">
            <div class="edita-pop">
            
              <h3 class ="title">Description</h3>
              <p>${item.description}</p>
              <h3 class ="title">Food Pairing</h3>
                <ul>
                ${item.food_pairing
            .map(ingredient => `<li>${ingredient}</li>`)
            .join("")}
          
                  </ul>
            </div>
          </div>
          <div id="modal-id" class="modal-container"></div>
            
          `)
          
          
      })


    }

    /*--------------Função estrela-------------------*/
    const estrela = document.querySelectorAll('#estrela');

    function ativaFunc(event) {
      event.currentTarget.classList.toggle('ativa_estrela');
    }
    estrela.forEach((link) => {
      link.addEventListener('click', ativaFunc);
    });

    /*------------Fim da função estrela----------------*/


  }


  showError(message) {
    let alert = $('#error')

    if (alert.length === 0) {
      this.elements.form.before('<div class="alert alert-danger" id="error"></div>')
      alert = $('#error')
    }

    alert.text(message)

  }


}


const beerForm = new BeerSearch()




document.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    let tiraclass = document.querySelector('.beers');
    while (tiraclass == 'null') {
      console.log(tiraclass);
    } if (tiraclass !== 'null') {
      tiraclass.classList.add('esconde');
    }
  }
});





