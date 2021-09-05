let unitsDB = {
    'J': [[['kg', 'm', 'm'], ['s', 's']], 1.0],
    'CAL': [[['kg', 'm', 'm'], ['s', 's']], 4.184],
    'BTU': [[['kg', 'm', 'm'], ['s', 's']], 1055.05585262],
    'ERG': [[['kg', 'm', 'm'], ['s', 's']], 1.E-7],
    'M': [[['m'], []], 1.0],
    'CM': [[['m'], []], 0.01],
    'MM': [[['m'], []], 0.001],
    'IN': [[['m'], []], 0.0254],
    'FT': [[['m'], []], 0.3048],
    'M3': [[['m', 'm','m'], []], 1.0],
    'CM3': [[['m', 'm','m'], []], 0.01**3],
    'MM3': [[['m', 'm','m'], []], 0.001**3],
    'FT3': [[['m', 'm','m'], []], 0.3048**3],
    'IN3': [[['m', 'm','m'], []], 0.0254**3],
    'L': [[['m', 'm','m'], []], 0.001],
    'ATM': [[['kg'], ['m', 's', 's']], 101325.],
    'PA': [[['kg'], ['m', 's', 's']], 1.0],
    'BAR': [[['kg'], ['m', 's', 's']], 100000.],
    'TORR': [[['kg'], ['m', 's', 's']], 133.3223684211],
    'PSI': [[['kg'], ['m', 's', 's']], 6894.7572931783],
    'INH2O': [[['kg'], ['m', 's', 's']], 249.08890833333],
    'MOL': [[['mol'], []], 1.0],
    'GMOL': [[['mol'], []], 1.0],
    'KMOL': [[['mol'], []], 1000.],
    'KGMOL': [[['mol'], []], 1000.],
    'LBMOL': [[['mol'], []], 453.59237],
    'K': [[['K'], []], 1.0],
    'R': [[['K'], []], 5/9]
}

function setup() {
    // create canvas
    createCanvas(400, 300);
    background(255);
    frameRate(5);

    noStroke();
    input = createInput('J / mol K');
    input.position(20, 10, 'fixed');
    input.size(200);
    input.style('text-size', 36);
    input.style('text-align', 'center');

    displayValue = createElement('h2', '8.31446261815324');
    displayValue.position(20, 18);

    textAlign(CENTER);
}

function draw() {
    const usrInput = input.value();
    let units = getUnits(usrInput);
    let newValue = calc(units);
    displayValue.html(newValue);
}

function calc(units) {
    let mult = 1;
    let R = 8.31446261815324; // J / mol K
    let newNum = [];
    let newDen = [];
    let checkNum = ['kg', 'm', 'm'];
    let checkDen = ['s', 's', 'K', 'mol'];

    for (let unit of units[0]) { // iterates numerator
        if (unit.toUpperCase() in unitsDB) {
            mult *= unitsDB[unit.toUpperCase()][1];
            newNum = newNum.concat(unitsDB[unit.toUpperCase()][0][0]);
            newDen = newDen.concat(unitsDB[unit.toUpperCase()][0][1]);
        }
    }
    for (let unit of units[1]) { // iterates denominator
        if (unit.toUpperCase() in unitsDB) {
            mult /= unitsDB[unit.toUpperCase()][1];
            newNum = newNum.concat(unitsDB[unit.toUpperCase()][0][1]);
            newDen = newDen.concat(unitsDB[unit.toUpperCase()][0][0]);
        }
    }
    newUnits = cleanUnits(newNum, newDen);
    newNum = newUnits[0];
    newDen = newUnits[1];
    newNum.sort();
    newDen.sort();
    checkNum.sort();
    checkDen.sort();
    console.log(newNum, checkNum);
    if (arraysEqual(newNum, checkNum) && arraysEqual(newDen, checkDen)) {
        return (R / mult);
    } else {
        return ('Check Units');
    }
}

function cleanUnits(num, den) {
    for (let i = 0; i < num.length; i++) {
        for (let j = 0; j < den.length; j++) {
            if (i < num.length && j < den.length) {
                if (den[j] === num[i]) {
                    num.splice(i, 1);
                    den.splice(j, 1);
                    cleanUnits(num, den);
                }
            }
        }
    }
    return [num, den];
}

function getUnits(usrInput) {
    let str = usrInput.replaceAll(/\(/g, '')
    str = str.replaceAll(/\)/g, '');
    str = str.replaceAll('^', '');
    str = str.replaceAll('-', '');

    const num = [];
    const den = [];
    let hasPassedSlash = false;
    for (let unit of str.split(' ')) {
        if (unit === '/') {
            hasPassedSlash = true;
        }
        if (hasPassedSlash && unit != '/') {
            den.push(unit);
        } else if (unit != '/') {
            num.push(unit);
        }
    }

    return [num, den];
}

function arraysEqual(a, b) {
    if (a.length != b.length) {
        return false;
    }

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
}