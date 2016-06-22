/*
 Nombre: funcionesGenerales.js
 Descripcion: JS que contiene todas las funciones de tipo utilidad que se usa en todo el sitio. Tambien contiene prototipos
 */

//Prevent Safari opening links when viewing as a Mobile App
(function (a, b, c) {
    if(c in b && b[c]) {
        var d, e = a.location,
            f = /^(a|html)$/i;
        a.addEventListener("click", function (a) {
            d = a.target;
            while(!f.test(d.nodeName)) d = d.parentNode;
            "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
        }, !1)
    }
})(document, window.navigator, "standalone");


(function($){$.fn.priceFormat=function(options){var defaults={prefix:'US$ ',suffix:'',centsSeparator:'.',thousandsSeparator:',',limit:false,centsLimit:2,clearPrefix:false,clearSufix:false,allowNegative:false,insertPlusSign:false};var options=$.extend(defaults,options);return this.each(function(){var obj=$(this);var is_number=/[0-9]/;var prefix=options.prefix;var suffix=options.suffix;var centsSeparator=options.centsSeparator;var thousandsSeparator=options.thousandsSeparator;var limit=options.limit;var centsLimit=options.centsLimit;var clearPrefix=options.clearPrefix;var clearSuffix=options.clearSuffix;var allowNegative=options.allowNegative;var insertPlusSign=options.insertPlusSign;if(insertPlusSign)allowNegative=true;function to_numbers(str){var formatted='';for(var i=0;i<(str.length);i++){char_=str.charAt(i);if(formatted.length==0&&char_==0)char_=false;if(char_&&char_.match(is_number)){if(limit){if(formatted.length<limit)formatted=formatted+char_}else{formatted=formatted+char_}}}return formatted}function fill_with_zeroes(str){while(str.length<(centsLimit+1))str='0'+str;return str}function price_format(str){var formatted=fill_with_zeroes(to_numbers(str));var thousandsFormatted='';var thousandsCount=0;if(centsLimit==0){centsSeparator="";centsVal=""}var centsVal=formatted.substr(formatted.length-centsLimit,centsLimit);var integerVal=formatted.substr(0,formatted.length-centsLimit);formatted=(centsLimit==0)?integerVal:integerVal+centsSeparator+centsVal;if(thousandsSeparator||$.trim(thousandsSeparator)!=""){for(var j=integerVal.length;j>0;j--){char_=integerVal.substr(j-1,1);thousandsCount++;if(thousandsCount%3==0)char_=thousandsSeparator+char_;thousandsFormatted=char_+thousandsFormatted}if(thousandsFormatted.substr(0,1)==thousandsSeparator)thousandsFormatted=thousandsFormatted.substring(1,thousandsFormatted.length);formatted=(centsLimit==0)?thousandsFormatted:thousandsFormatted+centsSeparator+centsVal}if(allowNegative&&(integerVal!=0||centsVal!=0)){if(str.indexOf('-')!=-1&&str.indexOf('+')<str.indexOf('-')){formatted='-'+formatted}else{if(!insertPlusSign)formatted=''+formatted;else formatted='+'+formatted}}if(prefix)formatted=prefix+formatted;if(suffix)formatted=formatted+suffix;return formatted}function key_check(e){var code=(e.keyCode?e.keyCode:e.which);var typed=String.fromCharCode(code);var functional=false;var str=obj.val();var newValue=price_format(str+typed);if((code>=48&&code<=57)||(code>=96&&code<=105))functional=true;if(code==8)functional=true;if(code==9)functional=true;if(code==13)functional=true;if(code==46)functional=true;if(code==37)functional=true;if(code==39)functional=true;if(allowNegative&&(code==189||code==109))functional=true;if(insertPlusSign&&(code==187||code==107))functional=true;if(!functional){e.preventDefault();e.stopPropagation();if(str!=newValue)obj.val(newValue)}}function price_it(){var str=obj.val();var price=price_format(str);if(str!=price)obj.val(price)}function add_prefix(){var val=obj.val();obj.val(prefix+val)}function add_suffix(){var val=obj.val();obj.val(val+suffix)}function clear_prefix(){if($.trim(prefix)!=''&&clearPrefix){var array=obj.val().split(prefix);obj.val(array[1])}}function clear_suffix(){if($.trim(suffix)!=''&&clearSuffix){var array=obj.val().split(suffix);obj.val(array[0])}}$(this).bind('keydown.price_format',key_check);$(this).bind('keyup.price_format',price_it);$(this).bind('focusout.price_format',price_it);if(clearPrefix){$(this).bind('focusout.price_format',function(){clear_prefix()});$(this).bind('focusin.price_format',function(){add_prefix()})}if(clearSuffix){$(this).bind('focusout.price_format',function(){clear_suffix()});$(this).bind('focusin.price_format',function(){add_suffix()})}if($(this).val().length>0){price_it();clear_prefix();clear_suffix()}})};$.fn.unpriceFormat=function(){return $(this).unbind(".price_format")};$.fn.unmask=function(){var field=$(this).val();var result="";for(var f in field){if(!isNaN(field[f])||field[f]=="-")result+=field[f]}return result}})(jQuery);

function ObtenerItemDeArregloJson(arreglo, propiedadJson, valorBuscado) {
    if (!arreglo)
        return;

    for (var i = 0; i < arreglo.length; i++) {
        var item = arreglo[i];
        if (item[propiedadJson] == valorBuscado) {
            return item;
        }
    }
    return undefined;
}

function EsNuloVacio(value) {
    if (value === null || value === undefined || value === '')
        return true;
    else
        return false;
}

function FormatearDatosVaciosAPI(obj) {

    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] == "object") {
                FormatearDatosVaciosAPI(obj[property]);
            }
            else {
                if (EsNuloVacio(obj[property]))
                    obj[property] = '!';
            }
        }
    }
}

//Encuentra conincidencias en una cadena de texto
function ContieneTexto(haystack, needle) {
    if (!haystack)
        return false;

    if (!needle) {
        return true;
    }
    return haystack.toString().toLowerCase().indexOf(needle.toString().toLowerCase()) !== -1;
}
//Metodos para guardar en localStorage del browser
function SetLocalStorage(key, value) {
    amplify.store( key, null);
    amplify.store( key, value);
}

function GetLocalStorage(value) {
    return amplify.store(value);
}

function GetValueFromJsonArray(array, property, findValue) {
    var retorno = {};

    if (!array || array.length<=0 || !property || !findValue)
        return retorno;

    var fila;
    for (var i = 0; i <= array.length - 1; i++) {
        fila = array[i];
        if (fila && fila[property] == findValue) {
            retorno = fila;
            break;
        }
    }
    return retorno;

}

function GetIndexFromJsonArray(array, property, findValue) {
    if (!array || array.length <= 0 || !property || !findValue)
        return -1;

    var retorno = -1;
    var fila;
    for (var i = 0; i <= array.length - 1; i++) {
        fila = array[i];
        if (fila && fila[property] == findValue) {
            retorno = i;
            break;
        }
    }
    return retorno;

}

function GetIndexFromArray(array, findValue) {
    if (!array || !findValue)
        return -1;

    var retorno = -1;
    for (var i = 0; i <= array.length - 1; i++) {
        if (array[i] == findValue) {
            retorno = i;
            break;
        }
    }
    return retorno;
}

//Padleft para Number, devuelve un string. nr:number, n:posiciones, str:char pad (opcional, coge el 0 si no se envia)
function NumberPadLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

//********* PROTOTYPES *****************//
String.prototype.format = function (args) {
    //Similar a String.Format de .NET
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
String.prototype.padLeft = function (l, c) {
    if (l < this.length)
        return this;
    else
        return Array(l - this.length + 1).join(c || " ") + this
};
Number.prototype.formatMoney = function () {
    return this.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");


};

//FUNCION SOLO TEXTO
function soloTexto(e) {

    k = (document.all) ? e.keyCode : e.which;

    if (k==8 || k==0) return true;

    patron = /^[a-zA-Z\s]*$/;

    n = String.fromCharCode(k);

    return patron.test(n);
}

//FUNCION NUMERICA
function soloNum(e) {

    k = (document.all) ? e.keyCode : e.which;

    if (k==8 || k==0) return true;

    patron = /^\d*$/;

    n = String.fromCharCode(k);

    return patron.test(n);
}

//FUNCION ALFANUMERICA
function soloAlfaNum(e) {

    k = (document.all) ? e.keyCode : e.which;

    if (k==8 || k==0) return true;

    patron = /^[a-zA-Z0-9]*$/;

    n = String.fromCharCode(k);

    return patron.test(n);
}

//FUNCION ALFANUMERICAES
function soloAlfaNumEs(e) {

    k = (document.all) ? e.keyCode : e.which;

    if (k==8 || k==0) return true;

    patron = /^[a-zA-Z0-9\s]*$/;

    n = String.fromCharCode(k);

    retorno = patron.test(n);

    return retorno;
}

//FUNCION EMAIL
function soloEmail(e) {

    k = (document.all) ? e.keyCode : e.which;

    if (k == 8 || k == 0) return true;

    patron = /^[a-zA-Z0-9]*$/;

    n = String.fromCharCode(k);

    if (n == "@" || n == "." || n == "_" || n == "-")
        return true;

    return patron.test(n);
}

// Funcion elimina ceros a la izquierda
function trimStart(character, string) {
    var startIndex = 0;

    while (string[startIndex] === character) {
        startIndex++;
    }
    return string.substr(startIndex);
}

function eliminarAcentos(str) {

    var defaultDiacriticsRemovalMap = [
        {
            'base': 'A',
            'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
        },
        {'base': 'AA', 'letters': /[\uA732]/g},
        {'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g},
        {'base': 'AO', 'letters': /[\uA734]/g},
        {'base': 'AU', 'letters': /[\uA736]/g},
        {'base': 'AV', 'letters': /[\uA738\uA73A]/g},
        {'base': 'AY', 'letters': /[\uA73C]/g},
        {'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
        {'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
        {
            'base': 'D',
            'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
        },
        {'base': 'DZ', 'letters': /[\u01F1\u01C4]/g},
        {'base': 'Dz', 'letters': /[\u01F2\u01C5]/g},
        {
            'base': 'E',
            'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
        },
        {'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
        {
            'base': 'G',
            'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
        },
        {
            'base': 'H',
            'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
        },
        {
            'base': 'I',
            'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
        },
        {'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g},
        {
            'base': 'K',
            'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
        },
        {
            'base': 'L',
            'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
        },
        {'base': 'LJ', 'letters': /[\u01C7]/g},
        {'base': 'Lj', 'letters': /[\u01C8]/g},
        {'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
        {
            'base': 'N',
            'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
        },
        {'base': 'NJ', 'letters': /[\u01CA]/g},
        {'base': 'Nj', 'letters': /[\u01CB]/g},
        {
            'base': 'O',
            'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
        },
        {'base': 'OI', 'letters': /[\u01A2]/g},
        {'base': 'OO', 'letters': /[\uA74E]/g},
        {'base': 'OU', 'letters': /[\u0222]/g},
        {'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
        {'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
        {
            'base': 'R',
            'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
        },
        {
            'base': 'S',
            'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
        },
        {
            'base': 'T',
            'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
        },
        {'base': 'TZ', 'letters': /[\uA728]/g},
        {
            'base': 'U',
            'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
        },
        {'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
        {'base': 'VY', 'letters': /[\uA760]/g},
        {'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
        {'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
        {
            'base': 'Y',
            'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
        },
        {
            'base': 'Z',
            'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
        },
        {
            'base': 'a',
            'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
        },
        {'base': 'aa', 'letters': /[\uA733]/g},
        {'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g},
        {'base': 'ao', 'letters': /[\uA735]/g},
        {'base': 'au', 'letters': /[\uA737]/g},
        {'base': 'av', 'letters': /[\uA739\uA73B]/g},
        {'base': 'ay', 'letters': /[\uA73D]/g},
        {'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
        {'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
        {
            'base': 'd',
            'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
        },
        {'base': 'dz', 'letters': /[\u01F3\u01C6]/g},
        {
            'base': 'e',
            'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
        },
        {'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
        {
            'base': 'g',
            'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
        },
        {
            'base': 'h',
            'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
        },
        {'base': 'hv', 'letters': /[\u0195]/g},
        {
            'base': 'i',
            'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
        },
        {'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
        {
            'base': 'k',
            'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
        },
        {
            'base': 'l',
            'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
        },
        {'base': 'lj', 'letters': /[\u01C9]/g},
        {'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
        {
            'base': 'n',
            'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
        },
        {'base': 'nj', 'letters': /[\u01CC]/g},
        {
            'base': 'o',
            'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
        },
        {'base': 'oi', 'letters': /[\u01A3]/g},
        {'base': 'ou', 'letters': /[\u0223]/g},
        {'base': 'oo', 'letters': /[\uA74F]/g},
        {'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
        {'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
        {
            'base': 'r',
            'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
        },
        {
            'base': 's',
            'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
        },
        {
            'base': 't',
            'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
        },
        {'base': 'tz', 'letters': /[\uA729]/g},
        {
            'base': 'u',
            'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
        },
        {'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
        {'base': 'vy', 'letters': /[\uA761]/g},
        {'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
        {'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
        {
            'base': 'y',
            'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
        },
        {
            'base': 'z',
            'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
        }
    ];

    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
    }

    return str;

}

function f5(that, val) {
    if (val) {
        that.on('keydown', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 116 || code == 117) { e.preventDefault(); }
        })
    }
    else {
        that.off('keydown');
    }
}

function HabilitarContextualMenu(flag){
    return flag;
}

$(document).ready(function () {

        //f5($(document), true);
        //document.oncontextmenu = function () {
        //    return Implantacion.AmbienteActivo.permitirMenuContextual;
        //};
        //
    }
);

//convertir xml a json
function xml2json(xml) {
    try {
        var obj = {};
        if (xml.children.length > 0) {
            for (var i = 0; i < xml.children.length; i++) {
                var item = xml.children.item(i);
                var nodeName = item.nodeName;

                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xml2json(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];

                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xml2json(item));
                }
            }
        } else {
            obj = xml.textContent;
        }
        return obj;
    } catch (e) {
        console.log(e.message);
    }
}


function setCaretPosition(elem, caretPos) {
    if (elem != null) {
        if (elem.createTextRange != undefined) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}


function getCaretPosition(input) {
    var poscursor = 0;
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        poscursor = input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        poscursor = sel.text.length - selLen;
    }
    return poscursor;
}


function ordenarPropiedad(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
};

function formatearFecha(fecha, idioma, conHora){
    if(!fecha || fecha == null)
        return undefined;

    var dd = fecha.getDate();
    var mm = fecha.getMonth() + 1;//January is 0!
    var yyyy = fecha.getFullYear();
    var hh = fecha.getHours();
    var mn = fecha.getMinutes();
    var ss = fecha.getSeconds();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    var fechaResult = undefined;
    switch(idioma){
        case 'ES' : fechaResult = dd + '/' + mm + '/' + yyyy;
            break;
        case 'EN' : fechaResult = mm + '/' + dd + '/' + yyyy;
            break;
        default : fechaResult = dd + '/' + mm + '/' + yyyy;
    };



    if (conHora)
        fechaResult = fechaResult + ' ' + hh + ':' + mn + ':' + ss;

    return fechaResult;
};

var Mydates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp)
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
                d.constructor === Date ? d :
                        d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                                d.constructor === Number ? new Date(d) :
                                        d.constructor === String ? new Date(d) :
                                                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                                                        NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
                isFinite(a=this.convert(a).valueOf()) &&
                isFinite(b=this.convert(b).valueOf()) ?
                (a>b)-(a<b) :
                        NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
                isFinite(d=this.convert(d).valueOf()) &&
                isFinite(start=this.convert(start).valueOf()) &&
                isFinite(end=this.convert(end).valueOf()) ?
                start <= d && d <= end :
                        NaN
        );
    }
}

var ServicioFecha = {

    validar : function(fechaDesde, fechaHasta , modo){
        var resultado = undefined;
        var validez = undefined;

        var fechaDesdeMayorQueHasta = false;
        var fechaDesdeMenorQueActual = false;

        resultado = Mydates.compare(fechaDesde,fechaHasta);

        if (resultado == NaN)
            return undefined;

        //si la primera regla es correcta
        if (resultado != 1){
            fechaDesdeMayorQueHasta = false;
            switch (modo){
                case 'INGRESO':
                    var today = MyDate();//new Date();
                        var x = Mydates.compare(fechaDesde, today);
                    fechaDesdeMenorQueActual =  (x == -1);
                    break;
                default :
                    validez = 1;
                    break;
            }
        }
        else{
            fechaDesdeMayorQueHasta = true;
        }

        return {
            fechaDesdeMayorQueHasta : fechaDesdeMayorQueHasta,
            fechaDesdeMenorQueActual: fechaDesdeMenorQueActual
        };
    }
};

function crearFechaHoy(conHora) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;//January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mn = today.getMinutes();
    var ss = today.getSeconds();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy;

    if (conHora)
        today = today + ' ' + hh + ':' + mn + ':' + ss;

    return today;
}

function MyDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth();//January is 0!
    var yyyy = today.getFullYear();
    return new Date(yyyy, mm, dd);
};


//Esta funcion convierte un objeto a string
function objToString(obj, ndeep) {
    if(obj == null){ return String(obj); }
    switch(typeof obj){
        case "string": return '"'+obj+'"';
        case "function": return obj.name || obj.toString();
        case "object":
            var indent = Array(ndeep||1).join('\t'), isArray = Array.isArray(obj);
            return '{['[+isArray] + Object.keys(obj).map(function(key){
                        return '\n\t' + indent + key + ': ' + objToString(obj[key], (ndeep||1)+1);
                    }).join(',') + '\n' + indent + '}]'[+isArray];
        default: return obj.toString();
    }
}

