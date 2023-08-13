let debt = {};
let entryLog = []

// function to determine which accounts exist 
function activeLedger(Payer, Debtor) {
    if (debt.hasOwnProperty(Payer) && debt.hasOwnProperty(Debtor)) {
        return "both"
    }
    else if (debt.hasOwnProperty(Payer)) {
        return "Payer Acc Open"
    }
    else if (debt.hasOwnProperty(Debtor)) {
        return "Debtor Acc Open"
    }
}
// Determine if how the if Payer and Debtor have any correlations and how to proceed if they do or don't
function relations(Payer, Debtor) {
    if (activeLedger(Payer, Debtor) == "both") { // Both accounts exist so we check Does the debtor already owe the payer money 
        if (debt[Payer].hasOwnProperty(Debtor)) { // If Yes then increase his debt if No 
            return "Increase Debtor Debt"
        }
        else if (debt[Debtor].hasOwnProperty(Payer)) { // Then Check if Payer owes Debtor money if Yes balancing begins if not 
            return "Balance"
        }
        else {
            return "Add Debtor to Payer Account" // We add Debtor under the Payers Account
        }
    } else if (activeLedger(Payer, Debtor) == "Payer Acc Open") { // Only Payer Account is Active Check if Debtor owes payer money already
        if (debt[Payer].hasOwnProperty(Debtor)) { // Yes increase the Debtors Debt if No
            return "Increase Debtor Debt"
        }
        else {
            return "Add Debtor to Payer Account" // Add Debtor under Payers Account
        }
    }
    else if (activeLedger(Payer, Debtor) == "Debtor Acc Open") { // If Only Debtor has active account
        if (debt[Debtor].hasOwnProperty(Payer)) { // Balance the accounts directly from his 
            return "Balance"
        } else {
            return "Default" // If Debtor doesn't have Payer create a Payer Account with Debtor under 
        }
    }
}
// function to balance out debts between two people
function balancer(Payer, Debtor, Amount) {
    if (Amount > debt[Debtor][Payer]) { //if the amount owed is greater than what the payer owed the debtor
        if (debt.hasOwnProperty(Payer)) { // the payer account add's debtor with the difference and the Debtor Acc removes Payer as a key
            debt[Payer][Debtor] = Amount - debt[Debtor][Payer]
            delete debt[Debtor][Payer]
        } else { // if the Amount is equal to the debt owed by Payer the debt is balanced key under debtor is removed if debtor had only one key Acc is removed
            debt[Payer] = { [Debtor]: Amount - debt[Debtor][Payer] }
            if (Object.keys(debt[Debtor]).length > 1) {
                delete debt[Debtor][Payer]
            }
            else {
                delete debt[Debtor]
            }
        }
    } else if (Amount < debt[Debtor][Payer]) { // if the amount is less than what is owed. The payers debt to debtor is reduced by the amount 
        debt[Debtor][Payer] -= Amount
    }
    else { // Case in where amount is Equal to the debt owed so it deletes account if it only had that one Payer as the debtor
        console.log(debt[Payer])
        if (Object.keys(debt[Debtor]).length > 1) {
            delete debt[Debtor][Payer]
        }
        else {
            delete debt[Debtor]
        }
    }

}
function increase(param1, param2, Amount) { // handles increases of existing debtors under payers accounts
    debt[param1][param2] += Amount
}

function accountAdd(Payer, Debtor, Amount) { // adds new debtors to payer accounts
    debt[Payer][Debtor] = Amount
}
function caseCheck(Name) { //function to convert the first letter names to Uppercase for Payer
    let nameArray = String(Name).split(" ")
    for (let i = 0; i < nameArray.length; i++) {
        let letterArray = String(nameArray[i]).split("")
        let arrayFirstLetter = letterArray.splice(0, 1)
        letterArray.unshift(String(arrayFirstLetter).toUpperCase())
        nameArray[i] = letterArray.join("")
    }

    return newName = nameArray.join(" ")

}

function debtTracker(/*Payer, Debtor, Amount, Description*/) {
    let Payer = caseCheck(document.querySelector("#Payer").value);
    let Debtor = caseCheck(document.querySelector("#Debtor").value);
    let Amount = Number(document.querySelector("#Amount").value);
    let Description = (document.querySelector("#Description").value);
    if (Payer != "" && Debtor != "" && Payer != Debtor && Amount > 0 && Description != "") {
        let argsRecord = [`${Debtor} owes ${Payer} ${Amount} for ${Description}`]
        entryLog.push(argsRecord)


        switch (relations(Payer, Debtor)) {
            case "Balance":
                console.log("balancing")
                balancer(Payer, Debtor, Amount)
                break;
            case "Increase Debtor Debt":
                increase(Payer, Debtor, Amount)
                console.log("Increasing Debt")
                break;
            // case "Reduce Payers Debt to Debtor":
            //     console.log("Reduce Payers Debt")
            //     break;
            case "Add Debtor to Payer Account":
                accountAdd(Payer, Debtor, Amount)
                console.log("Add Debtor to Payers Acc")
                break;
            default:
                debt[Payer] = { [Debtor]: Amount }
                console.log(`Added ${Payer} Account`)

        }
    } else {
        console.log("Try Again")
    }
}

document.addEventListener("DOMContentLoaded", function () {

    $(document).ready(function () {
        $("#submit").click(function () {
            function logger() {
                let logContainer = document.querySelector("#log")
                logContainer.innerHTML = ""
                for (let i = 0; i < entryLog.length; i++) {
                    let logEntry = document.createElement("p")
                    logEntry.textContent = entryLog[i]
                    logContainer.appendChild(logEntry)
                }
            }

            function results() {
                let logContainer = document.querySelector("#finalDebts");
                logContainer.innerHTML = ""; // Clear the previous content

                for (let payer in debt) {
                    let payerHeader = document.createElement("strong");
                    payerHeader.textContent = `Money Owed to ${payer}:`;
                    logContainer.appendChild(payerHeader);
                    logContainer.appendChild(document.createElement("br"))
                    for (let debtor in debt[payer]) {
                        if (debtor !== "Payer") {
                            let debtorEntry = document.createElement("div");
                            debtorEntry.textContent = `${debtor}: ${debt[payer][debtor]}`;
                            logContainer.appendChild(debtorEntry);
                        }
                    }

                    logContainer.appendChild(document.createElement("br"));
                }
            }
            debtTracker()
            logger()
            results()
        })

        //animations for the info panels
        $("#resultsButton").click(function () {
            $("#finalDebts").toggleClass("slide-out2 slide-in")
        })
        $("#logButton").click(function () {
            $("#log").toggleClass("slide-out slide-in")
        })
    })

})

// debtTracker("Thomas", "Ryan", 500, "hotel")
// debtTracker("Thomas", "Ryan", 500, "hotel")
// debtTracker("Thomas", "Kevin", 500, "hotel")
// debtTracker("Thomas", "Kevin", 500, "hotel")
// debtTracker("Kevin", "Ryan", 500, "hotel")
// debtTracker("Kevin", "Ryan", 500, "hotel")
// debtTracker("Ryan", "Gordon", 500, "hotel")
// debtTracker("Gordon", "Ryan", 500, "hotel")

console.log(debt)