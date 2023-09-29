let languageSetting = {
    RUS:{
        digits:["три", "четыре", "пять", "шесть", "семь", "восемь", "девять"],
        tens:["двадцать","тридцать","сорок","пятьдесят","шестьдесят","семьдесят","восемдесят","девяносто"],
        fromTenToNineteen:["десять","одиннадцать","двенадцать","тринадцать","четырнадцать","пятнадцать","шестнадцать","семнадцать","восемнадцать","девятнадцать"],
        hundred:["сто","двести","триста","четыреста","пятьсот","шестьсот","семьсот","восемсот","девятьсот"],
        thousand:["тысяча","тысячи","тысяч"],
        million:["миллион","миллиона","миллионов"],
        one:["одна","один"],
        two:["две","два"],
        inputANumber:"Введите число",
        chooseCurr:"Выберите валюту",
        warn:"Пожалуйста, удостоверьтесь в том, что вы правильно ввели число",
        Default: ["","","","сотая","сотых","сотых"],
        USD: ["доллар США","доллара США","долларов США","цент","цента","центов"],
        EUR: ["евро","евро","евро","евроцент","евроцента","евроцентов"],
        BYN: ["белорусский рубль","белорусских рубля","белорусских рублей","копейка","копейки","копеек"],
        PLN: ["польский злотый","польских злотых","польских злотых","грош","гроша","грошей"]
    },
    ENG:{
        digits:["three", "four", "five", "six", "seven", "eight", "nine"],
        tens:["twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],
        fromTenToNineteen:["ten","eleven","tvelwe","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],
        hundred:["one hundred","two hundred","three hundred","four hundred","five hundred","six hundred","seven hundred","eight hundred","nine hundred"],
        thousand:["thousand","thousand","thousand"],
        million:["million","million","million"],
        one:["one","one"],
        two:["two","two"],
        inputANumber:"Input a number",
        chooseCurr:"Choose currency",
        warn:"Please, make sure that the number you've entered is right",
        Default: ["point","point","point","","",""],
        USD: ["US dollar","US dollar","US dollar","cent","cent","cent"],
        EUR: ["euro","euro","euro","eurocent","eurocent","eurocent"],
        BYN: ["belarusian ruble","belarusian ruble","belarusian ruble","copeck","copeck","copeck"],
        PLN: ["polish zloty","polish zloty","polish zloty","grosh","grosh","grosh"]
    }
}

var getValue = function(){
    value = document.querySelector('input').value;
    if(!value)return "";
    if(!value.includes('.')){
        if(value.includes(',')){
            value = value.replace(',','.');
        }else{
            value += ".00";
        }
    }else if(value.at(-1) == '.'){
        value += "00";
    }
    return value;
}

var handleCurrency = function(){
    let currency = document.querySelector('select').value;
    let lang = document.getElementById('lang').value;
    let interfaceLanguage = handleLanguage();
    return interfaceLanguage[`${currency}`];
}

var changeInterfaceLanguage = function(){
    let interfaceLanguage = handleLanguage();
    document.getElementById('number').placeholder = interfaceLanguage["inputANumber"];
    document.getElementById('chooseCurr').innerHTML = interfaceLanguage["chooseCurr"];
}

var handleLanguage = function(){
    let lang = document.getElementById('lang').value;
    return languageSetting[`${lang}`];
}


var transform = function(){
    let value = getValue();
    let lang = handleLanguage();
    if(value != "" && isNaN(+value)) {
         document.getElementById('result').innerHTML = lang["warn"];
         return;
    }
    let res = "";
    let digits = lang["digits"];    //represents digits 3-9
    let tens = lang["tens"];    //represents tens 20-90
    let fromTenToNineteen = lang["fromTenToNineteen"];  //represents numbers 10-19
    let hundred = lang["hundred"];  //represents hundred 100-900
    let numCounter = 0;
    let classCounter = 1;
    let pointIndex = value.indexOf(".");
    let currency = handleCurrency();
    for (let i = pointIndex - 1; i >= 0; i--){
        numCounter++;
        let currentDigit = value[i];
        let previousDigit = value[i-1];

        if (numCounter == 1){
            let currentClass = value.substring(i + 1,i - 2);
            if (i == 0 || previousDigit != '1') {
                if (currentDigit == '1') {
                    if(classCounter == 1)res = currency[0] + res;
                    if(classCounter == 2)res = lang["thousand"][0] + res;
                    if(classCounter == 3)res = lang["million"][0] + res;
                }
                if(currentDigit >= '2' && currentDigit <= '4'){
                    if(classCounter == 1)
                        res = currency[1] + res;
                    if(classCounter == 2 && +currentClass != 0)
                        res = lang["thousand"][1] + res;
                    if(classCounter == 3 && +currentClass != 0)
                        res = lang["million"][1] + res;
                }
                if((currentDigit >= '5' && currentDigit <= '9') || currentDigit == '0' || previousDigit == '1'){
                    if(classCounter == 1)
                        res = currency[2] + res;
                    if(classCounter == 2 && +currentClass != 0)
                        res = lang["thousand"][2] + res;
                    if(classCounter == 3 && +currentClass != 0)
                        res = lang["million"][2] + res;
                }
                res = ' ' + res;
                
                switch(currentDigit){
                    case '0':
                        break;
                    case '1':
                        res = (classCounter == 2  ? lang["one"][0] : lang["one"][1]) + res;
                        break;
                    case '2':
                        res = (classCounter == 2  ? lang["two"][0] : lang["one"][1]) + res;
                        break;
                    default:
                        res = digits[currentDigit - '3'] + res;
                        break;
            }
            }else{
                if(classCounter == 1) 
                    res = currency[2] + res;
                if(classCounter == 2)
                    res = lang["thousand"][2] + res;
                if(classCounter == 3)
                    res = lang["million"][2] + res;
                res = ' ' + res;
                res = fromTenToNineteen[currentDigit] + res;
                i--;
                numCounter++;
            }
        }
        else{
            if(numCounter == 2){
                if (currentDigit == '0')
                    continue;
                res = tens[currentDigit - '2'] + res;
            }
            if(numCounter == 3){
                numCounter = 0;
                classCounter++;
                if (currentDigit == '0')
                    continue;
                res = hundred[currentDigit - '1'] + res;
            }
        }
        res = " " + res;
        }

    res += " " + value.substring(pointIndex + 1, pointIndex + 3);
    if(value[pointIndex + 2] == '1' && value[pointIndex + 1] != '1'){
        res += " " + currency[3];
    }else if(value[pointIndex + 2] >= '2' && value[pointIndex + 2] <= '4'){
        res += " " + currency[4];
    }else if(value != ""){
        res += " " + currency[5];
    }
    document.getElementById('result').innerHTML = res;
    return res;
}