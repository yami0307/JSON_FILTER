const fileObj = document.getElementById("file-selector");
let result = undefined;
let result_copy = undefined;

fileObj.addEventListener("change", function () {
  let fr = new FileReader();
  fr.onload = function () {
    result = fr.result;
  };

  fr.readAsText(this.files[0]);
});

const viewFile = async () => {
  const makeTable = new Promise((resolve, error) => {
    document.getElementById("table").innerHTML = "";

    const resultObj = JSON.parse(result);

    // Validations

    // TABLE
    let table = document.createElement("table");
    table.setAttribute("class", "table-class");

    // HEADERS
    let tableHead = document.createElement("thead");
    let tr = document.createElement("tr");
    resultObj.headers.forEach((el) => {
      const th = document.createElement("td");
      th.innerHTML = el;
      tr.appendChild(th);
    });
    tableHead.appendChild(tr);
    table.appendChild(tableHead);

    // VALUES
    let tableBody = document.createElement("tbody");
    resultObj.values.forEach((row) => {
      let tr = document.createElement("tr");
      row.forEach((el) => {
        const td = document.createElement("td");
        td.innerHTML = el !== null ? el : "NA";
        tr.appendChild(td);
      });

      tableBody.appendChild(tr);
    });

    table.appendChild(tableBody);

    // add the newly created element and its content into the DOM
    document.getElementById("table").appendChild(table);
    document.getElementById("filter_section").removeAttribute("hidden");
    document.getElementById("button_section").removeAttribute("hidden");

    resolve(true);
  });

  makeTable.then(() => {
    $(".table-class").DataTable();
  });
};

const resetFilter = async () => {
  if (result_copy) {
    result = result_copy;

    // remove table
    $(".table-class").remove();

    // make table again
    await viewFile();
  }
};

const filter = async () => {
  await resetFilter();

  let ps_filter = document.getElementById("select_ps").value;
  let at_filter = document.getElementById("select_at").value;
  console.log(ps_filter, at_filter);

  if (!result) {
    alert("Choose and submit JSON file first");
    return;
  }

  result_copy = result;
  let parsed_json = JSON.parse(result);

  if (ps_filter) {
    parsed_json.values = parsed_json.values.filter((el) => el[3] === ps_filter);
  }

  if (at_filter) {
    parsed_json.values = parsed_json.values.filter((el) => el[8] === at_filter);
  }

  result = JSON.stringify(parsed_json);

  // remove table
  $(".table-class").remove();

  // make table again
  await viewFile();
};
