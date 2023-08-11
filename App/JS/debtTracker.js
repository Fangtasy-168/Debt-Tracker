let debt = {};
let entryLog = []


function debtTracker() {
  let Payer = document.getElementById("Payer").value;
  let Debtor = document.getElementById("Debtor").value;
  let Amount = Number(document.getElementById("Amount").value);
  let Description = (document.getElementById("Description").value);
  let pChecked = ""
  let dChecked = ""
  caseCheckPayer(Payer)
  caseCheckDebtor(Debtor)

  function caseCheckPayer(Payer) { //function to convert the first letter names to Uppercase for Payer
    let payerArray = String(Payer).split(" ")
    for (let i = 0; i < payerArray.length; i++) {
      let payerLetterArray = String(payerArray[i]).split("")
      let payerFirstLetter = payerLetterArray.splice(0, 1)
      payerLetterArray.unshift(String(payerFirstLetter).toUpperCase())
      payerArray[i] = payerLetterArray.join("")
    }
    return pChecked = payerArray.join(" ")
  }
  console.log(pChecked)

  function caseCheckDebtor(Debtor) { //function to convert the first letter names to Uppercase for Payer
    let debtorArray = String(Debtor).split(" ")
    for (let i = 0; i < debtorArray.length; i++) {
      let debtorLetterArray = String(debtorArray[i]).split("")
      let debtorFirstLetter = debtorLetterArray.splice(0, 1)
      debtorLetterArray.unshift(String(debtorFirstLetter).toUpperCase())
      debtorArray[i] = debtorLetterArray.join("")
    }
    return dChecked = debtorArray.join(" ")
  }
  console.log(dChecked)

  // to keep a record of user inputs
  if (pChecked != "" && dChecked != "" && Amount > 0 && Description != "") {
    let argsRecord = [`${dChecked} owes ${pChecked} ${Amount} for ${Description}`]
    entryLog.push(argsRecord)
  }


  /* checks to see if it has the pChecked and dChecked as a key already*/
  if (debt.hasOwnProperty(pChecked) &&
    debt.hasOwnProperty(dChecked)) {
    /*Checks to see if both keys have each other as a dChecked */
    if (
      debt[pChecked].hasOwnProperty(dChecked) &&
      debt[dChecked].hasOwnProperty(pChecked)
    ) { /*if it does have check to see if the amount owed to dChecked is greater or equal */
      if (Amount >= debt[dChecked][pChecked].CAmount) {
        debt[pChecked][dChecked].CAmount = Amount - debt[dChecked][pChecked].CAmount;
        debt[dChecked][pChecked].CAmount = 0;
        /* dCheckeds remaining debt is the amount - the pCheckeds debt to dChecked and pChecked debt with dChecked is canceled out */
        console.log("Balanced");
      } else {
        debt[dChecked][pChecked].CAmount = debt[dChecked][pChecked].CAmount - Amount
        debt[pChecked][dChecked] = 0
        /* pCheckeds debt to dChecked is reduced by the amount and dCheckeds Debt is cancelled out */
      }
    } else {
      /* since both keys don't contain one another just add the debt regularly*/
      debt[pChecked][dChecked] = { Debtor_Name: dChecked, CAmount: Amount }
    }
  } else if (debt.hasOwnProperty(dChecked) &&
    debt[dChecked].hasOwnProperty(pChecked)) {
    if (Amount > debt[dChecked][pChecked].CAmount) {
      debt[pChecked] = { Payer: pChecked, [dChecked]: { Debtor_Name: dChecked, CAmount: Amount - debt[dChecked][pChecked].CAmount } }
      delete debt[dChecked][pChecked]
    }
    else if (Amount == debt[dChecked][pChecked].CAmount) {
      if (Object.keys(debt[dChecked]).length > 2) {
        delete debt[dChecked][pChecked]
      }
      else {
        delete debt[dChecked]
      }
    }
    else {
      debt[dChecked][pChecked].CAmount = debt[dChecked][pChecked].CAmount - Amount
    }
    console.log("can be balanced")
    /* Add Amount if pChecked exist and has dChecked key*/
  } else if (debt.hasOwnProperty(pChecked) && debt[pChecked].hasOwnProperty(dChecked)) {
    debt[pChecked][dChecked].CAmount = debt[pChecked][dChecked].CAmount + Amount
    console.log("Added Debt")

  }
  /* If pChecked exist To add dChecked to pChecked if doesn't exist yet*/
  else if (debt.hasOwnProperty(pChecked)) {
    debt[pChecked][dChecked] = { Debtor_Name: dChecked, CAmount: Amount }
    console.log("Added dChecked")
  }
  /* To add pChecked if he doesn't exist yet*/
  else if (pChecked != "" && dChecked != "" && Amount > 0 && Description != "") {
    debt[pChecked] = { Payer: pChecked, [dChecked]: { Debtor_Name: dChecked, CAmount: Amount } };
    console.log("added");

  }
  else {
    return "No Luck!"
  }

}

$(document).ready(function () {
  $("#submit").click(function () {
    console.log("quack")
    function logger() {
      let logContainer = document.getElementById("log")
      logContainer.innerHTML = ""
      for (let i = 0; i < entryLog.length; i++) {
        let logEntry = document.createElement("p")
        logEntry.textContent = entryLog[i]
        logContainer.appendChild(logEntry)
      }
    }

    function results() {
      let logContainer = document.getElementById("finalDebts");
      logContainer.innerHTML = ""; // Clear the previous content

      for (let payer in debt) {
        logContainer.innerHTML += `<strong>Money Owed to ${payer}:</strong><br>`;
        for (let debtor in debt[payer]) {
          if (debtor !== "Payer") {
            let debtorName = debt[payer][debtor].Debtor_Name;
            let amount = debt[payer][debtor].CAmount;
            logContainer.innerHTML += `${debtorName}: ${amount}<br>`;
          }
        }
        logContainer.innerHTML += "<br>";
      }
    }
    debtTracker()
    logger()
    results()

  })





  //animations for the info panels


  $("#resultsButton").click(function () {
    if ($("#finalDebts").hasClass("slide-out2")) {
      $("#finalDebts").removeClass("slide-out2").addClass("slide-in");
    } else if ($("#finalDebts").hasClass("slide-in")) {
      $("#finalDebts").removeClass("slide-in").addClass("slide-out2");
    } else {
      $("#finalDebts").addClass("slide-out2")
    }
  })
  $("#logButton").click(function () {
    if ($("#log").hasClass("slide-out")) {
      $("#log").removeClass("slide-out").addClass("slide-in");
    } else if ($("#log").hasClass("slide-in")) {
      $("#log").removeClass("slide-in").addClass("slide-out");
    } else {
      $("#log").addClass("slide-out")
    }
  })
})