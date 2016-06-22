angular.module('AppModals', ['ngEkathuwa'])
    .service('MoviModals', ['$ekathuwa', function ($ekathuwa) {
        return {
            mostrarModal: function (params) {
                if (!params)
                    return;
                //Asignacion de parametros
                var idModal = (params.idModal) ? params.idModal : 'modalId';
                var titulo = (params.titulo) ? params.titulo : '';
                var subtitulo = (params.subtitulo) ? params.subtitulo : '';
                var mensaje = (params.mensaje) ? params.mensaje : '';
                var ocultarPie = (params.ocultarPie) ? params.ocultarPie : false;
                var ocultarTitulo = (params.ocultarTitulo) ? params.ocultarTitulo : false;
                var ocultarCerrar = (params.ocultarCerrar) ? params.ocultarCerrar : false;
                var paramBackdrop = true;
                var paramKeyboard = true;
                if (params.bloquearCerrar) {
                    paramBackdrop = 'static';
                    paramKeyboard = false;
                    ocultarCerrar = true;
                }
                //var bloquearFondo = (params.bloquearFondo) ? params.bloquearFondo : true;
                var botones = (params.botones) ? params.botones : [{ tipo: 'aceptar', lbl: 'Aceptar' }];
                var img64 = (params.img64) ?
                '<div class="text-center"><img alt="" data-ng-src="data:image/JPEG;base64,' + params.img64 + '" /></div>' : '';
                var htmlModal = '<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" class="modal fade" id="[IDMODAL]">';
                htmlModal += '<div class="modal-dialog">';
                htmlModal += '<div class="modal-content">';
                htmlModal += '<div data-ng-hide="' + ocultarTitulo + '" class="modal-header">';
                htmlModal += '<button aria-hidden="true" data-dismiss="modal" data-ng-hide="' + ocultarCerrar + '" class="close" type="button"><i class="fa fa-lg fa-times text-danger"></i></button>';
                htmlModal += '<h4 id="myModalLabel" class="modal-title">[TITULO]</h4>';
                htmlModal += '</div>';
                htmlModal += '<div class="modal-body">';
                htmlModal += '<h4>[SUBTITULO]</h4>';
                htmlModal += '<p>[MENSAJE]</p>';
                htmlModal += img64;
                htmlModal += '</div>';
                htmlModal += '<div data-ng-hide="' + ocultarPie + '" class="modal-footer">';
                htmlModal += '[BOTONES]';
                htmlModal += '</div>';
                htmlModal += '</div>';
                htmlModal += '</div>';
                htmlModal += '</div>';
                //Botones para el Pie del modal
                var htmlBotones = '';
                var eventoBoton = '';
                var claseBoton = '';
                angular.forEach(botones, function (value, key) {
                    switch (value.tipo) {
                        case 'cancelar':
                            claseBoton = (FrontEnds.Habilitado != 'Pichincha') ? 'btn btn-danger' : 'btn btn-primary';
                            break;
                        case 'aceptar':
                            claseBoton = 'btn btn-primary';
                        default:
                            break;
                    }
                    eventoBoton = (value.click) ? 'ng-click="' + value.click + '"' : '';
                    htmlBotones += '<button data-dismiss="modal" ' + eventoBoton + ' class="' + claseBoton + '" type="button">' + value.lbl + '</button>'
                });

                //Reemplazamos
                htmlModal = htmlModal.replace('[IDMODAL]', idModal);
                htmlModal = htmlModal.replace('[TITULO]', titulo);
                htmlModal = htmlModal.replace('[SUBTITULO]', subtitulo);
                htmlModal = htmlModal.replace('[MENSAJE]', mensaje);
                htmlModal = htmlModal.replace('[BOTONES]', htmlBotones);

                $ekathuwa.modal({
                    id: idModal,
                    templateHTML: htmlModal,
                    controller: 'ModalCtrl',
                    backdrop: paramBackdrop,
                    keyboard: paramKeyboard
                });

            },
            mostrarPopUp: function (params) {
                if (!params)
                    return;
                //Asignacion de parametros
                var idModal = (params.idModal) ? params.idModal : 'modalId';
                var titulo = (params.titulo) ? params.titulo : '';
                var subtitulo = (params.subtitulo) ? params.subtitulo : '';
                var mensaje = (params.mensaje) ? params.mensaje : '';
                var urlInclude = (params.urlInclude) ? params.urlInclude : '';
                var ocultarPie = (params.ocultarPie) ? params.ocultarPie : false;
                var ocultarTitulo = (params.ocultarTitulo) ? params.ocultarTitulo : false;
                var botones = (params.botones) ? params.botones : [{ tipo: 'aceptar', lbl: 'Aceptar' }];
                var img64 = (params.img64) ?
                '<div class="text-center"><img alt="" data-ng-src="data:image/JPEG;base64,' + params.img64 + '" /></div>' : '';

                var htmlModal = '<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" class="modal fade" id="[IDMODAL]">';
                htmlModal += '<div class="modal-dialog">';
                htmlModal += '<div class="modal-content">';
                htmlModal += '<div data-ng-hide="' + ocultarTitulo + '" class="modal-header">';
                htmlModal += '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="fa fa-lg fa-times text-danger"></i></button>';
                htmlModal += '<h4 id="myModalLabel" class="modal-title">[TITULO]</h4>';
                htmlModal += '</div>';
                htmlModal += '<div class="modal-body">';
                htmlModal += '<div data-ng-include="\''+ params.urlInclude +'\'"></div>';
                htmlModal += '</div>';
                htmlModal += '<div data-ng-hide="' + ocultarPie + '" class="modal-footer">';
                htmlModal += '[BOTONES]';
                htmlModal += '</div>';
                htmlModal += '</div>';
                htmlModal += '</div>';
                htmlModal += '</div>';
                htmlModal += '</div>';
                //Botones para el Pie del modal
                var htmlBotones = '';
                var eventoBoton = '';
                var claseBoton = '';
                angular.forEach(botones, function (value, key) {
                    switch (value.tipo) {
                        case 'cancelar':
                            claseBoton = (FrontEnds.Habilitado != 'Pichincha') ? 'btn btn-danger' : 'btn btn-primary';
                            break;
                        case 'aceptar':
                            claseBoton = 'btn btn-primary';
                        default:
                            break;
                    }
                    eventoBoton = (value.click) ? 'ng-click="' + value.click + '"' : '';
                    htmlBotones += '<button data-dismiss="modal" ' + eventoBoton + ' class="' + claseBoton + '" type="button">' + value.lbl + '</button>'
                });

                //Reemplazamos
                htmlModal = htmlModal.replace('[IDMODAL]', idModal);
                htmlModal = htmlModal.replace('[TITULO]', titulo);
                htmlModal = htmlModal.replace('[SUBTITULO]', subtitulo);
                htmlModal = htmlModal.replace('[MENSAJE]', mensaje);
                htmlModal = htmlModal.replace('[BOTONES]', htmlBotones);

                $ekathuwa.modal({
                    id: idModal,
                    templateHTML: htmlModal,
                    controller: 'ModalCtrl'
                });

            },
            mostrarToastr: function (params) {
                toastr.options.closeButton = true;

                /*
                 * position configuration
                 * toast-top-left - Top Right - No ponerla es por defecto esta posicion
                 * toast-top-left - Top Left
                 * toast-bottom-right - Bottom Right
                 * toast-bottom-left - Bottom Left
                 */

                if (params.positionClass)
                    toastr.options.positionClass = params.positionClass;

                toastr.options.timeOut = (params.tiempo != undefined) ? params.tiempo : 5000;
                switch (params.tipo) {
                    case 'success':
                        toastr.success(params.mensaje);
                        break;
                    case 'error':
                        toastr.error(params.mensaje);
                        break;
                    case 'warning':
                        toastr.warning(params.mensaje);
                        break;
                    case 'info':
                    default:
                        toastr.info(params.mensaje);
                        break;
                }
            },
            mostrarNoticias: function (params) {
                var htmlModal = '<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" class="modal fade">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div data-ng-hide="false" class="modal-header text-center">' +
                    '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="fa fa-lg fa-times text-danger"></i></button>' +
                    '<h4 id="myModalLabel" class="modal-title">[[titulo]]</h4>' +
                    '</div>' +
                    '<div class="modal-body">';
                angular.forEach(params.mensajes, function (value, key) {
                    htmlModal += '<div class="row">';
                    htmlModal += '<div class="col-sm-12">';
                    htmlModal += '<i class="fa fa-info-circle fa-lg"></i>';
                    htmlModal += '<label> ' + '&nbsp;' + value.Titulo + '</label></br>';
                    htmlModal += '<span>' + value.Mensaje + '</span>';
                    htmlModal += '</div>';
                    htmlModal += '</div><hr>';
                });
                htmlModal += '</div>' +
                '<div class="modal-footer text-center" style="text-align:center">' +
                '<a data-dismiss="modal" class="btn btn-default">Aceptar</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
                htmlModal = htmlModal.replace('[[titulo]]', params.titulo);
                $ekathuwa.modal({
                    templateHTML: htmlModal
                });

            },
            mostrarEvaluacionFormGadget: function (params) {
                var htmlModal = '<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" class="modal fade">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content" data-ng-controller="CtrlEasyGadget">' +
                    '<div data-ng-hide="false" class="modal-header text-center">' +
                    '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="fa fa-lg fa-times text-danger"></i></button>' +
                    '<h4 id="myModalLabel" class="modal-title">{{ etiquetas.evaluacionNoticia }}</h4>' +
                    '</div>' +
                    '<div class="modal-body" style="padding: 0!important;">' +
                    '<div class="container">' +
                    '<div class="col-xs-12 col-md-6">' +
                    '<form role="form">' +
                    '<div class="form-group">' +
                    '<label>{{ etiquetas.titulo}}: </label>' + '&nbsp;' + params.titulo +
                    '</div>' +
                    '<div class="form-group">' +
                    '<label>{{ etiquetas.evaluacionSeleccionada }}: </label>' + '&nbsp;' + '<span id="evaluacion"></span>'  + ' Estrella(s)' +
                    '</div>' +
                    '<div class="form-group" id="noticia">' +

                    '</div>' +
                    '<div class="form-group">' +
                    '<label for="pwd">{{ etiquetas.descripcion }}:</label>' +
                    '<input type="text" class="form-control" id="pwd" placeholder="Entre una descripcion">' +
                    '</div>' +
                    '</form>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer text-center" style="text-align:center">' +
                    '<a data-dismiss="modal" class="btn btn-default" data-ng-click="enviarEvaluacion()">Aceptar</a>' +
                    '<a data-dismiss="modal" class="btn btn-default">Cancelar</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                htmlModal = htmlModal.replace('[[titulo]]', 'Esta noticia de prueba');
                $ekathuwa.modal({
                    templateHTML: htmlModal
                });

            },
            mostrarNoticiaCompletaGadget: function(params) {
                var htmlModal = '<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" class="modal fade">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div data-ng-hide="false" class="modal-header text-center">' +
                    '<button aria-hidden="true" data-dismiss="modal" class="close" type="button"><i class="fa fa-lg fa-times text-danger"></i></button>' +
                    '<h4 id="myModalLabel" class="modal-title">NOTICIA</h4>' +
                    '</div>' +
                    '<div class="modal-body" style="padding: 0!important;">' +
                    '<table class="table table-striped" style="margin: 0;">' +
                    '<tbody>';

                htmlModal += '<tr>';
                htmlModal += '<td>';
                htmlModal += '<a class="pull-left" href="#" style="padding-right: 10px;">';
                htmlModal += '<img class="media-object" src=' + params.img + '>';
                htmlModal += '</a>';
                htmlModal += '<i class="fa fa-info-circle fa-lg"></i>&nbsp;' + params.titulo + '<br><br>';
                htmlModal += '<span>' + params.texto + '</span>';
                htmlModal += '</td>';
                htmlModal += '</tr>';

                htmlModal += '       </tbody>' +
                '</table>' +
                '</div>' +
                '<div class="modal-footer text-center" style="text-align:center">' +
                '<a data-dismiss="modal" class="btn btn-default">Aceptar</a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
                htmlModal = htmlModal.replace('[[titulo]]', params.titulo);
                $ekathuwa.modal({
                    templateHTML: htmlModal
                });

            }
        }
    }])
    .controller('ModalCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        //Botones Modal
        $scope.botonesModal = {
            Aceptar: function (params) {
                if (EsNuloVacio(params))
                    $rootScope.$broadcast('AceptarModal', params);
                else
                    $rootScope.$broadcast(params, params);
            },
            Cancelar: function (params) {
                if (EsNuloVacio(params))
                    $rootScope.$broadcast('CancelarModal', params);
                else
                    $rootScope.$broadcast(params, params);
            }
        };
    }]);