angular.module('AppServices', ['ngResource', 'ngRoute', 'AppModals'])
    .factory("GlobalSvc", ['$resource', '$timeout', '$q', '$window', '$http', '$routeParams', 'MoviModals',
        function ($resource, $timeout, $q, $window, $http, $routeParams, MoviModals) {

            return {
                RedireccionarPaginaError: function ($scope, tipoError, mensaje, extras) {
                    var trans = AppConfigSettings.Transacciones.PaginaError.split('|');
                    var transaccion = {cod_aplicacion: trans[0], cod_modulo: trans[1], cod_transaccion: trans[2]};
                    params = {
                        trans: transaccion,
                        params: {
                            tipoError: tipoError,
                            Mensaje: mensaje,
                            extras: extras
                        }
                    }
                    $scope.$emit('cargarOpcion', params);
                },

                RedireccionarAccesoNoAutorizado: function (tipoError) {
                    var tipoFinal = (tipoError == undefined) ? 'NOAUTORIZADO' : tipoError;
                    $window.location.assign('../' + AppConfigSettings.Urls.AccesoNoAutorizado + '#?TIPO=' + tipoFinal);
                },

                VerificarBusquedaEmpresaHabilitada: function () {
                    var Usuario = GetLocalStorage("Usuario");
                    if (Usuario != undefined && (Usuario.Perfil_Tipo == AppConfigSettings.TiposPerfiles.Seguridad || Usuario.Perfil_Tipo == AppConfigSettings.TiposPerfiles.Banco)) {
                        return true;
                    }
                    return false;
                },

                CargarComboCuentas: function (Pagina) {
                    var usuario = GetLocalStorage('Usuario');
                    var cuentas = GetLocalStorage('CuentasUsuario');
                    var tipoCuenta;
                    var numeroCuenta;
                    var descripcionCuenta;
                    var descripcionTipoCuenta;
                    var tipoFirma;
                    var nombreTitular;
                    angular.forEach(cuentas, function (value, key) {
                        if (value.Estado_Cuenta == 'ACTIVO') {
                            tipoCuenta = value.Tipo_Cuenta.trim();
                            numeroCuenta = value.Numero_Cuenta.trim();
                            descripcionCuenta = value.Descripcion_Cuenta.trim().split('-');
                            descripcionTipoCuenta = value.Descripcion_TipoCuenta.trim();
                            tipoFirma = descripcionCuenta[0].split(':');
                            nombreTitular = descripcionCuenta[1];

                            switch (tipoFirma[0].trim()) {
                                case "TITULAR":
                                    tipoFirma[0] = "TIT";
                                    break;
                                case "FIRMA AUTORIZADA":
                                    tipoFirma[0] = "F/A";
                                    break;
                                case "REPRESENTANTE LEGAL":
                                    tipoFirma[0] = "REP";
                                    break;
                            }

                            if (tipoFirma[0] == "TIT" || nombreTitular == "F/A" || nombreTitular == "REP") {
                                nombreTitular = usuario.NombreUsuario;
                            }

                            //
                            if (tipoCuenta == "AHO" || tipoCuenta == "CTE" || tipoCuenta == "EFE") {
                                switch (Pagina) {
                                    case "Servicios":
                                        if (numeroCuenta != null && (tipoFirma[0] == "TIT" || tipoFirma[0] == "REP")) {
                                            DescCuenta = numeroCuenta + "-" + tipoCuenta;
                                            value.comboText = DescCuenta;
                                            value.comboValue = DescCuenta;
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }); //Fin foreach
                    return cuentas;
                },

                FormateoTextoComboCuentas: function (cuentas) {
                    angular.forEach(cuentas, function (value, index) {
                        value.texto = value.NB + ',' + value.TC + ',' + value.NC;
                    });
                    return cuentas;
                },

                TraducirTipoCuenta: function (tipoCuenta) {
                    switch (tipoCuenta) {
                        case 'CC':
                            return 'CTE';
                            break;
                        case 'AH':
                            return 'AHO';
                            break;
                        case "AHO":
                            return "A";
                            break;
                        case "EFE": //Si es PAGO EFECTIVO o ROL ELECTRONICO que son sinonimos
                        case "RE":
                        case "CTE":
                            return "C";
                            break;
                        case "AX":
                        case "A":
                        case "MC":
                        case "M":
                        case "VI":
                        case "V":
                            return "T";
                        default:
                            return '';
                    }
                },

                LeerPlantillas: function (nombrePlantilla) {
                    var urlPlantilla = nombrePlantilla;
                    return $http({method: 'GET', url: urlPlantilla});
                },

                ObtenerDescripcionTipoCuenta: function (tipoCuenta) {
                    switch (tipoCuenta) {
                        case "AHO":
                            return "AHORROS";
                            break;
                        case "CTE":
                            return "CORRIENTE";
                            break;
                        case "EFE":
                        case "RE":
                            return "PAGO EFECTIVO";
                            break;
                        case "A":
                        case "AX":
                            return "AMERICAN EXPRESS";
                            break;
                        case "V":
                        case "VI":
                            return "VISA";
                            break;
                        case "M":
                        case "MC":
                            return "MASTERCARD";
                            break;
                        default:
                            return tipoCuenta;
                            break;
                    }
                },

                /*CargarArchivo: function (archivo, parametros) {

                 var urlFinal = AppConfigServices.General.UrlApiEmpresas + AppConfigServices.General.Cargas.CargaArchivo;
                 if (parametros != undefined) {
                 //URL
                 urlFinal = (parametros.url != undefined) ? parametros.url : urlFinal;
                 }

                 return $upload.upload({
                 url: urlFinal,
                 method: 'POST',
                 headers: {
                 'Content-Type': 'application/text'
                 },
                 withCredential: true,
                 file: archivo
                 })
                 },*/

                VerificarAplicacionHabilitada: function (aplicacion) {
                    //return true: aplicacion habilitada, false: aplicacion inhabilitada
                    if (!AppConfigSettings.Aplicacion.AplicacionesHabilitadas)
                        return false;

                    var habilitado = false;
                    angular.forEach(AppConfigSettings.Aplicacion.AplicacionesHabilitadas.split('|'), function (value, key) {
                        if (aplicacion == value)
                            habilitado = true;
                    });
                    return habilitado;
                },


                SalidaSegura: function () {
                    var Usuario = GetLocalStorage('Usuario');

                    if (Usuario == undefined || Usuario.NombreCorto == undefined) {
                        SetLocalStorage('Usuario', null);
                        $window.localStorage.clear();
                        return;
                    }

                },


                cambiarVista: function (grupoVenta, $scope) {
                    var formularioPanel = '';
                    angular.forEach($scope.serviciosTransaccion.Paneles, function (value2, key2) {
                        for (var objeto in $scope) {
                            var elemento = objeto;
                            var segmento;
                            var frm = elemento.search('frm')
                            if (frm >= 0)
                                segmento = 'frm';
                            else
                                segmento = 'partial';
                            if (segmento + value2.Nombre == elemento) {
                                if (value2.TipoPanel) {
                                    formularioPanel = segmento + value2.Nombre;
                                    $scope[formularioPanel].ocultar = (value2.Grupo_Ventana != grupoVenta)
                                }
                            }
                        }
                    })
                },

                mostrarVista: function (grupoVenta, ocultar, $scope) {
                    var formularioPanel = '';
                    angular.forEach($scope.serviciosTransaccion.Paneles, function (value2, key2) {
                        for (var objeto in $scope) {
                            var elemento = objeto;
                            var segmento;
                            var frm = elemento.search('frm')
                            if (frm >= 0)
                                segmento = 'frm';
                            else
                                segmento = 'partial';
                            if (segmento + value2.Nombre == elemento) {
                                var panel = $scope[elemento];
                                formularioPanel = segmento + value2.Nombre;
                                if (value2.Grupo_Ventana == grupoVenta && value2.ParentId == panel.parentId)
                                    $scope[formularioPanel].ocultar = ocultar;
                            }
                        }
                    })
                },

                muestraMensaje: function (titulo, mensaje) {
                    MoviModals.mostrarModal({
                        titulo: titulo,
                        mensaje: mensaje
                    });
                },

                muestraMensajeTemporal: function (tipo, mensaje) {
                    MoviModals.mostrarToastr({
                        tipo: tipo,
                        mensaje: mensaje
                    });
                },

                obtenerFecha: function (param) {
                    var agregarDias = 0;
                    var fechaInicial = new Date();
                    if (param != undefined) {
                        if (param.agregarDias != undefined)
                            agregarDias = param.agregarDias;

                        if (param.fechaInicio != undefined)
                            fechaInicial = Date.parseExact(param.fechaInicio, 'dd/MM/yyyy');
                    }


                    var laFecha = fechaInicial.addDays(agregarDias);
                    var mes = (laFecha.getMonth() + 1)
                    if (mes <= 9)
                        mes = '0' + mes;

                    var dia = laFecha.getDate()
                    if (dia <= 9)
                        dia = '0' + dia;

                    return (dia + "/" + mes + "/" + laFecha.getFullYear());
                },

                obtenerHora: function () {
                    var laFecha = new Date();
                    return (laFecha.getHours() + ':' + laFecha.getMinutes());
                },

                validarRangoFechas: function (params) {

                    var retorno = {
                        valido: true,
                        mensaje: ''
                    }

                    if (EsNuloVacio(params.fechaDesde) || EsNuloVacio(params.fechaHasta)) {
                        retorno.valido = false;
                        retorno.mensaje = EtiquetasGlobal.Etiquetas.fechasVacias;
                        return retorno;
                    }

                    var desde = params.fechaDesde.clearTime();
                    var hasta = params.fechaHasta.clearTime();
                    var rango = ((hasta - desde) / (60 * 60 * 24 * 1000));

                    if (params.rango != undefined && rango > params.rango) {
                        retorno.valido = false;
                        retorno.mensaje = EtiquetasGlobal.Etiquetas.rangoFechaSuperada.replace('[N]', params.rango.toString());
                        return retorno;
                    }

                    if (rango < 0) {
                        retorno.valido = false;
                        retorno.mensaje = EtiquetasGlobal.Etiquetas.rangoFechaInvalida;
                        return retorno;
                    }

                    return retorno;
                },

                ExportarReportes: function (reporte, data2, tipo) {
                    var deferred = $q.defer();
                    var formato = tipo;
                    //if (tipo == "pdf") {
                    //    tipo = "application/x-pdf";
                    //}
                    //else {
                    //    tipo = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    //}
                    switch (tipo) {
                        case 'pdf':
                            tipo = "application/x-pdf";
                            break;
                        case 'xlsx':
                            tipo = "application/vnd.ms-excel";
                            break;
                        case 'txt':
                            tipo = "application/text/plain";
                            break;
                        default:
                            tipo = "application/octet-stream";
                            break;
                    }

                    return $http({
                        url: '',//AppConfigServices.General.UrlApiEmpresas + reporte,
                        method: 'POST',
                        data: data2,
                        headers: {
                            'Content-type': 'application/json',
                            'Content-Disposition': 'attachment;filename=nombreArchivo.xls'
                        },
                        responseType: 'arraybuffer'
                    }).success(function (data, status, headers, config) {
                        var blob = new Blob([data], {type: tipo});
                        var objectUrl = URL.createObjectURL(blob);
                        ////window.open(objectUrl, 'Reporte', 'width=500,height=400');
                        window.location.href = objectUrl;

                        //var hiddenElement = document.createElement('a');
                        //hiddenElement.href = objectUrl;
                        //hiddenElement.target = '_blank';
                        //hiddenElement.download = reporte + formato;
                        //hiddenElement.click();

                        deferred.resolve();
                    }).error(function (data, status, headers, config) {
                        //upload failed
                        deferred.resolve();
                    });

                    return deferred.promise;
                },


                obtenerParametrosUrl: function () {
                    var vars = [], hash;
                    var hashes = window.location.href.slice(
                        window.location.href.indexOf('?') + 1).split('&');
                    for (var i = 0; i < hashes.length; i++) {
                        hash = hashes[i].split('=');
                        vars.push(hash[0]);
                        vars[hash[0]] = hash[1];
                    }
                    return vars;
                },

                obtenerParametroUrl: function (name) {
                    return this.obtenerParametrosUrl()[name];
                },

                implode: function (elemento, coleccion) {
                    //funcion similar a la existente en php para rellenar con un string intercalado entre los elementos de un arraglo
                    //   ejemplo 1: implode(' ', ['Luis', 'Ernesto', 'Saballo']);
                    //   returns 1: 'Luis Ernesto Saballo'
                    //   ejemplo 2: implode(' ', {first:'Luis', last: 'Ernesto Saballo'});
                    //   returns 2: 'Luis Ernesto Saballo'

                    var i = '',
                        retVal = '',
                        tElem = '';

                    if (arguments.length === 1) {
                        coleccion = elemento;
                        elemento = '';
                    }

                    if (typeof coleccion === 'object') {
                        if (Object.prototype.toString.call(coleccion) === '[object Array]') {
                            return coleccion.join(elemento);
                        }
                        for (i in coleccion) {
                            retVal += tElem + coleccion[i];
                            tElem = elemento;
                        }
                        return retVal;
                    }
                    return coleccion;
                },

                obtenerContexto: function () {
                    var str = AppConfigSettings.Aplicacion.UrlLogin;
                    var pos = str.indexOf("/Aplicaciones");
                    if (pos != -1)
                        str = str.substring(0, pos);
                    return str;
                },

                DescargarLink: function (params) {
                    var link = document.createElement("a");
                    link.href = params.url;
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    delete link;
                },

                EnmascararNumeros: function (numeroEnmascarar, tipoCuenta) {
                    if (tipoCuenta == "TAR") {
                        var Mascara = AppConfigSettings.General.MascaraTarjeta;
                    } else {
                        var Mascara = AppConfigSettings.General.MascaraCuenta;
                    }

                    var numeroFinal = '';
                    if (Mascara.toString() != '' || Mascara.toString() != null) {
                        for (var j = 0; j < numeroEnmascarar.length; j++) {
                            //Si la longitud del numero es menor o igual a la longitud de la mascara
                            if (j < Mascara.length) {
                                //Si se reemplaza por la mascara
                                if (Mascara[j] != '#') {
                                    numeroFinal += Mascara[j];
                                } else {
                                    //Si no se reemplaza por la mascara
                                    numeroFinal += numeroEnmascarar[j];
                                }
                            }
                            else {
                                //Si el numero tiene mayor longitud que la mascara, se completa con numeros
                                numeroFinal += numeroEnmascarar[j];
                            }

                        }
                    }
                    return numeroFinal;
                },

                CargarScript: function (param) {
                    var bsa = document.createElement('script');
                    bsa.type = 'text/javascript';
                    bsa.async = true;
                    bsa.id = param.id;
                    bsa.src = param.url;
                    document.head.appendChild(bsa);
                },

                ExportarDatos: function (params) {
                    //Funcion para exportar datos
                    /*params: {
                     tipo: excel, texto, imagen,
                     nombreArchivo: nombre del archivo sin extension. El catalogo de posibles valores esta en AppConfigSettings.ExportacionesGenericas.Tipos
                     plantilla: plantilla a utilizar para la exportacion. El catalogo de posibles valores esta en AppConfigSettings.ExportacionesGenericas.Plantillas
                     datosCabecera: arreglo de textos con los valores a presentar como cabecera de la exportacion
                     datosDetalle: arreglo de objetos que contiene muestra el detalle de la exportacion
                     datosPie: arreglo de textos con los valores a preesntar en el pie
                     }
                     */
                    var myScope = this;
                    var deferred = $q.defer();

                    //Parametros de exportacion
                    var tipoExportacion = AppConfigSettings.ExportacionesGenericas.Tipos[params.tipo];

                    //Si no existe el tipo de exportacion solicitado
                    if (tipoExportacion == undefined) {
                        $timeout(function () {
                            deferred.resolve(false);
                        });
                        return deferred.promise;
                    }

                    var nombreArchivo = params.nombreArchivo + "." + tipoExportacion.extension;
                    var paramsFinal = {
                        Tipo: tipoExportacion.formato,
                        Extension: tipoExportacion.extension,
                        NombreArchivo: nombreArchivo,
                        NombreReporte: params.NombreReporte
                    };

                    //Exportacion de Imagenes
                    if (tipoExportacion.formato == AppConfigSettings.ExportacionesGenericas.Tipos.imagen.formato) {
                        paramsFinal["Imagen"] = params.datosImagen;
                    } else { //Exportacion de Textos
                        paramsFinal["Plantilla"] = params.plantilla;
                        paramsFinal["Cabecera"] = params.datosCabecera;
                        paramsFinal["Detalle"] = params.datosDetalle;
                        paramsFinal["Pie"] = params.datosPie;
                    }

                    //Eliminar Acentos
                    if (paramsFinal["Detalle"] != undefined) {
                        var str = JSON.stringify(paramsFinal["Detalle"]);
                        str = eliminarAcentos(str);
                        paramsFinal["Detalle"] = JSON.parse(str);
                    }
                    if (paramsFinal["Cabecera"] != undefined) {
                        angular.forEach(paramsFinal["Cabecera"], function (v, k) {
                            if (!EsNuloVacio(v) && isNaN(v))
                                v = eliminarAcentos(v);
                        })
                    }
                    if (paramsFinal["Pie"] != undefined) {
                        angular.forEach(paramsFinal["Pie"], function (v, k) {
                            if (!EsNuloVacio(v) && isNaN(v))
                                v = eliminarAcentos(v);
                        })
                    }
                    if (params.Tramas != undefined) {
                        var TramasMC = [];
                        angular.forEach(params.Tramas, function (v, k) {
                            var TramaMC = myScope.CrearTramaEnvio(v);
                            var TramaMCString = objToString(TramaMC);
                            TramaMCString = TramaMCString.replace(/(?:\r\n|\r|\n|\t)/g, '');
                            TramaMCString = TramaMCString.replace(/"/g, '\\"');
                            TramasMC.push(TramaMCString);
                        });
                        paramsFinal['Tramas'] = TramasMC;
                        //paramsFinal['Tramas'].push('{"Transaccion":{"Cabecera":{"Operador":"pichi","Aplicacion":"CM","Canal":"BVI","CodigoBanco":"0010","IdEmpresa":"43591","Sucursal":"QUITO","Agencia":"270","CodigoCaja":"005","Usuario":"rlugmania","Codigo":"OBTENER_ESTADO_CUENTA_BLOQUES","IdTransaccion":"4206"},"Detalle":{"FuenteInformacion":"BANCAELECTRONICA","FuenteRegistrador":"WEBAPI","TramaREST":{"Action":"ObtenerEstadoCuentaBloques","Parameters":{},"Data":{"TipoPersona":"E","Ip":"127.0.0.1","IdContrato":81,"Identificacion":"0991159509001","Llamada":"TELLER","TipoConsulta":"D","CodServicio":"TT","NumCuenta":"2100023922","FechaDesde":"","FechaHasta":""}},"Id_Contrato":81}}}';);
                        //paramsFinal['Tramas'].push('{"Transaccion":{"Cabecera":{"Operador":"pichi","Aplicacion":"CM","Canal":"BVI","CodigoBanco":"0010","IdEmpresa":"43591","Sucursal":"QUITO","Agencia":"270","CodigoCaja":"005","Usuario":"rlugmania","Codigo":"OBTENER_MOVIMIENTOS","IdTransaccion":"4206"},"Detalle":{"FuenteInformacion":"BANCAELECTRONICA","FuenteRegistrador":"WEBAPI","TramaREST":{"Action":"ObtenerMovimientos","Parameters":{},"Data":{"TipoPersona":"E","Ip":"127.0.0.1","IdContrato":81,"User":"rlugmania","Identificacion":"0991159509001","Llamada":"TELLER","TipoConsulta":"D","CodServicio":"TT","NumCuenta":"2100023922","FechaDesde":"20150727","FechaHasta":"20150827"}},"Id_Contrato":81}}}';);
                    }


                    //Url de exportacion
                    var urlExportar = '';
                    if (params.tipoReporte != '' && params.tipoReporte != undefined)
                        urlExportar = ''//AppConfigServices.General.UrlExportaciones + '/' + params.tipoReporte;
                    else
                        urlExportar = ''//AppConfigServices.General.UrlExportaciones;

                    var configPost = {
                        url: urlExportar,
                        method: 'POST',
                        data: paramsFinal,
                        headers: {
                            'Content-type': 'application/json'
                        },
                        responseType: 'arraybuffer'
                    }
                    //Llamada para exportar
                    $http(configPost)
                        .success(function (data, status, headers, config) {
                            var blob = new Blob([data], {type: tipoExportacion.tipo});
                            saveAs(blob, nombreArchivo);

                            deferred.resolve(true);
                        }).
                        error(function (data, status, headers, config) {
                            deferred.resolve(false);
                        });
                    return deferred.promise;
                },

                ImprimirContenido: function (params) {
                    var imprimir = document.getElementById(AppConfigSettings.General.PrintableDivId);
                    var comprobante = document.getElementById(params.idContenido);
                    imprimir.innerHTML = comprobante.innerHTML;
                    window.print();
                    imprimir.innerHTML = '';
                },

            }
        }])