let ran = "";

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

  console.log(minIndex.value);
  console.log(maxIterations);
  for (let i = Number(minIndex.value); i < maxIterations; i++) {
    trEl = document.createElement("tr");
    for (let j = 0; j < data[0].length; j++) {
      trEl.innerHTML += `<td>${data[i][j]}</td>`;
    }
    tableEl.appendChild(trEl);
  }
  tableClass.appendChild(tableEl);
}

function filterTable(df, cols) {
  let table = document.querySelector("table");
  table.remove();
  createTable(df, cols);
}
