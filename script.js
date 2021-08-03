var DataFrame = dfjs.DataFrame;

let data = fetch("atm_enboi.csv")
  .then((res) => {
    return res.text();
  })
  .then((data) => {
    return Papa.parse(data).data;
  })
  .then((dataParse) => {
    createfilterBtn(dataParse[0]);
    createTable(dataParse.slice(1), dataParse[0]);
    let markers = init_map(dataParse);

    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
    return dataParse;
  })
  .then((dataParse) => {
    df = new DataFrame(dataParse.slice(1), dataParse[0]);
    let btn = document.querySelector("button");
    let searchBtn = document.querySelector("#go");
    let backwardArrow = document.querySelector("#backward");
    let forwardArrow = document.querySelector("#forward");
    let minIndexEL = document.querySelector("#min_index");
    let maxIndexEl = document.querySelector("#max_index");
    minIndexEL.addEventListener("change", (event) => {
      filterTable(df.toArray(), dataParse[0]);
    });
    maxIndexEl.addEventListener("change", (event) => {
      filterTable(df.toArray(), dataParse[0]);
    });
    btn.addEventListener("click", (event) => {
      let inputEl = document.querySelector("input");
      let selectEl = document.querySelector("select");

      let col = selectEl.value;
      let data = inputEl.value;

      let filtered = df.filter((row) => {
        return row.get(col) === data;
      });
      filtered.toArray();
      filterTable(filtered.toArray(), dataParse[0]);
    });
    searchBtn.addEventListener("click", () => {
      let searchField = document.querySelector("#search_field");
      let word = searchField.value;
      let cols = dataParse[0];
      let searchResults = cols.reduce((arrayTwoDim, col) => {
        if (typeof arrayTwoDim == "string") {
          return df.filter((row) => row.get(col) == word).toArray();
        } else {
          return arrayTwoDim.concat(
            df.filter((row) => row.get(col) == word).toArray()
          );
        }
      });
      filterTable(searchResults, dataParse[0]);
    });
    backwardArrow.addEventListener("click", () => {
      let minIndexEL = document.querySelector("#min_index");
      let maxIndexEl = document.querySelector("#max_index");
      let gapPages = Number(maxIndexEl.value) - Number(minIndexEL.value);

      if (Number(minIndexEL.value) - gapPages - 1 >= 1) {
        minIndexEL.value = Number(minIndexEL.value) - gapPages - 1;
        maxIndexEl.value = Number(maxIndexEl.value) - gapPages - 1;
        filterTable(df.toArray(), dataParse[0]);
      } else if (Number(minIndexEL.value) != 1) {
        minIndexEL.value = 1;
        maxIndexEl.value = Number(minIndexEL.value) + Math.abs(gapPages) - 1;
      }
    });
    forwardArrow.addEventListener("click", () => {
      let minIndexEL = document.querySelector("#min_index");
      let maxIndexEl = document.querySelector("#max_index");
      let gapPages = Number(maxIndexEl.value) - Number(minIndexEL.value);

      if (Number(minIndexEL.value) + gapPages + 1 <= df.toArray().length) {
        minIndexEL.value = Number(minIndexEL.value) + gapPages + 1;
        maxIndexEl.value = Number(maxIndexEl.value) + gapPages + 1;
        filterTable(df.toArray(), dataParse[0]);
      } else if (Number(minIndexEL.value) != 1) {
        minIndexEL.value = 1;
        maxIndexEl.value = Number(maxIndexEl.value) - Math.abs(gapPages) - 1;
      }
    });
  });

function createfilterBtn(columns) {
  let filterEl = document.querySelector(".filter");
  filterEl.innerHTML = `<button id = "filter">Filter</button> 
                      <select></select>
                      <input type="text" id="filter_field" placeholder="Filter">
                      <input type="text" id="search_field" placeholder="search">
                      <button id ="go">Go</button>
                      <button id="backward"><<</button>
                      <input type = "text" id ="min_index" value = 1>
                      <span>-</span>
                      <input type = "text" id = "max_index" value = 100>
                      <button id ="forward">>></button>

                      `;
  selectEl = document.querySelector("select");
  selectEl.innerHTML = "";
  columns.forEach((element) => {
    selectEl.innerHTML += `<option value = "${element}">${element}</option>`;
  });
}
google.maps.event.addDomListener(window, "load", init_map);
function init_map(spots) {
  let selectorMapElement = document.querySelector("#gmap_canvas");
  let arrayMarkers = [];
  let googleMapLat = 31.4037193;
  let googleMapLong = 33.9606947;

  const myOptions = {
    zoom: 8,
    center: new google.maps.LatLng(googleMapLat, googleMapLong),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  map = new google.maps.Map(selectorMapElement, myOptions);

  for (let index = 0; index < spots.length; index++) {
    let spot = spots[index];
    if (spot[11] < 34) {
      arrayMarkers[index] = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(spot[11], spot[12]),
      });
    } else {
      arrayMarkers[index] = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(spot[12], spot[11]),
      });
    }

    infowindow = new google.maps.InfoWindow({
      content: `
      <strong>ATM ${spot[0]} 5</strong>
      <br>${spot[6]},${spot[4]}<br>
      `,
    });
    google.maps.event.addListener(arrayMarkers[index], "click", function () {
      infowindow = new google.maps.InfoWindow({
        content: `
        <strong>ATM ${spots[index][0]}</strong>
        <br>${spots[index][6]},${spots[index][4]}<br>
        `,
      });
      infowindow.open(map, arrayMarkers[index]);
    });
  }
  return arrayMarkers;
}

function createTable(data, cols) {
  let tableClass = document.querySelector(".table");
  let tableEl = document.createElement("table");
  let minIndex = document.querySelector("#min_index");
  let maxIndex = document.querySelector("#max_index");
  let maxIterations =
    maxIndex.value > data.length ? data.length : maxIndex.value;

  tableClass.innerHTML = `<table></table>`;

  let trEl = document.createElement("tr");
  for (let j = 0; j < cols.length; j++) {
    trEl.innerHTML += `<th>${cols[j]}</th>`;
  }
  tableEl.appendChild(trEl);
  init_map(data.slice(Number(minIndex.value), maxIterations));

  for (let i = Number(minIndex.value); i < maxIterations; i++) {
    trEl = document.createElement("tr");
    for (let j = 0; j < data[0].length; j++) {
      trEl.innerHTML += `<td>${data[i][j]}</td>`;
    }
    tableEl.appendChild(trEl);
  }
  tableClass.appendChild(tableEl, maxIterations);
}

function filterTable(df, cols) {
  let table = document.querySelector("table");
  table.remove();
  createTable(df, cols);
}
