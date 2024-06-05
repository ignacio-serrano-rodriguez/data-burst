<?php

/**
 * This file has been auto-generated
 * by the Symfony Routing Component.
 */

return [
    false, // $matchHost
    [ // $staticRoutes
    ],
    [ // $regexpList
        0 => '{^(?'
                .'|/api(?'
                    .'|/(?'
                        .'|\\.well\\-known/genid/([^/]++)(*:46)'
                        .'|errors(?:/(\\d+))?(*:70)'
                        .'|validation_errors/([^/]++)(*:103)'
                    .')'
                    .'|(?:/(index)(?:\\.([^/]++))?)?(*:140)'
                    .'|/(?'
                        .'|docs(?:\\.([^/]++))?(*:171)'
                        .'|contexts/([^.]+)(?:\\.(jsonld))?(*:210)'
                        .'|validation_errors/([^/]++)(?'
                            .'|(*:247)'
                        .')'
                        .'|elementos(?'
                            .'|/([^/\\.]++)(?:\\.([^/]++))?(*:294)'
                            .'|(?:\\.([^/]++))?(?'
                                .'|(*:320)'
                            .')'
                            .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                .'|(*:358)'
                            .')'
                        .')'
                        .'|lista(?'
                            .'|s(?'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:406)'
                                .'|(?:\\.([^/]++))?(?'
                                    .'|(*:432)'
                                .')'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:470)'
                                .')'
                            .')'
                            .'|_contiene_elementos(?'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:528)'
                                .'|(?:\\.([^/]++))?(?'
                                    .'|(*:554)'
                                .')'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:592)'
                                .')'
                            .')'
                        .')'
                        .'|usuario(?'
                            .'|s(?'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(*:643)'
                                .'|(?:\\.([^/]++))?(?'
                                    .'|(*:669)'
                                .')'
                                .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                    .'|(*:707)'
                                .')'
                            .')'
                            .'|_(?'
                                .'|agrega_usuarios(?'
                                    .'|/([^/\\.]++)(?:\\.([^/]++))?(*:765)'
                                    .'|(?:\\.([^/]++))?(?'
                                        .'|(*:791)'
                                    .')'
                                    .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                        .'|(*:829)'
                                    .')'
                                .')'
                                .'|gestiona_(?'
                                    .'|elementos(?'
                                        .'|/([^/\\.]++)(?:\\.([^/]++))?(*:889)'
                                        .'|(?:\\.([^/]++))?(?'
                                            .'|(*:915)'
                                        .')'
                                        .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                            .'|(*:953)'
                                        .')'
                                    .')'
                                    .'|usuarios(?'
                                        .'|/([^/\\.]++)(?:\\.([^/]++))?(*:1000)'
                                        .'|(?:\\.([^/]++))?(?'
                                            .'|(*:1027)'
                                        .')'
                                        .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                            .'|(*:1066)'
                                        .')'
                                    .')'
                                .')'
                                .'|manipula_listas(?'
                                    .'|/([^/\\.]++)(?:\\.([^/]++))?(*:1122)'
                                    .'|(?:\\.([^/]++))?(?'
                                        .'|(*:1149)'
                                    .')'
                                    .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                        .'|(*:1188)'
                                    .')'
                                .')'
                                .'|reporta_elementos(?'
                                    .'|/([^/\\.]++)(?:\\.([^/]++))?(*:1245)'
                                    .'|(?:\\.([^/]++))?(?'
                                        .'|(*:1272)'
                                    .')'
                                    .'|/([^/\\.]++)(?:\\.([^/]++))?(?'
                                        .'|(*:1311)'
                                    .')'
                                .')'
                            .')'
                        .')'
                    .')'
                .')'
                .'|/_error/(\\d+)(?:\\.([^/]++))?(*:1354)'
            .')/?$}sDu',
    ],
    [ // $dynamicRoutes
        46 => [[['_route' => 'api_genid', '_controller' => 'api_platform.action.not_exposed', '_api_respond' => 'true'], ['id'], null, null, false, true, null]],
        70 => [[['_route' => 'api_errors', '_controller' => 'api_platform.action.not_exposed', 'status' => '500'], ['status'], null, null, false, true, null]],
        103 => [[['_route' => 'api_validation_errors', '_controller' => 'api_platform.action.not_exposed'], ['id'], null, null, false, true, null]],
        140 => [[['_route' => 'api_entrypoint', '_controller' => 'api_platform.action.entrypoint', '_format' => '', '_api_respond' => 'true', 'index' => 'index'], ['index', '_format'], null, null, false, true, null]],
        171 => [[['_route' => 'api_doc', '_controller' => 'api_platform.action.documentation', '_format' => '', '_api_respond' => 'true'], ['_format'], null, null, false, true, null]],
        210 => [[['_route' => 'api_jsonld_context', '_controller' => 'api_platform.jsonld.action.context', '_format' => 'jsonld', '_api_respond' => 'true'], ['shortName', '_format'], null, null, false, true, null]],
        247 => [
            [['_route' => '_api_validation_errors_problem', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'ApiPlatform\\Validator\\Exception\\ValidationException', '_api_operation_name' => '_api_validation_errors_problem'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_validation_errors_hydra', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'ApiPlatform\\Validator\\Exception\\ValidationException', '_api_operation_name' => '_api_validation_errors_hydra'], ['id'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_validation_errors_jsonapi', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'ApiPlatform\\Validator\\Exception\\ValidationException', '_api_operation_name' => '_api_validation_errors_jsonapi'], ['id'], ['GET' => 0], null, false, true, null],
        ],
        294 => [[['_route' => '_api_/elementos/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Elemento', '_api_operation_name' => '_api_/elementos/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        320 => [
            [['_route' => '_api_/elementos{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Elemento', '_api_operation_name' => '_api_/elementos{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/elementos{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Elemento', '_api_operation_name' => '_api_/elementos{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        358 => [
            [['_route' => '_api_/elementos/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Elemento', '_api_operation_name' => '_api_/elementos/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/elementos/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Elemento', '_api_operation_name' => '_api_/elementos/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/elementos/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Elemento', '_api_operation_name' => '_api_/elementos/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        406 => [[['_route' => '_api_/listas/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Lista', '_api_operation_name' => '_api_/listas/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        432 => [
            [['_route' => '_api_/listas{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Lista', '_api_operation_name' => '_api_/listas{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/listas{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Lista', '_api_operation_name' => '_api_/listas{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        470 => [
            [['_route' => '_api_/listas/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Lista', '_api_operation_name' => '_api_/listas/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/listas/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Lista', '_api_operation_name' => '_api_/listas/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/listas/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Lista', '_api_operation_name' => '_api_/listas/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        528 => [[['_route' => '_api_/lista_contiene_elementos/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\ListaContieneElemento', '_api_operation_name' => '_api_/lista_contiene_elementos/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        554 => [
            [['_route' => '_api_/lista_contiene_elementos{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\ListaContieneElemento', '_api_operation_name' => '_api_/lista_contiene_elementos{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/lista_contiene_elementos{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\ListaContieneElemento', '_api_operation_name' => '_api_/lista_contiene_elementos{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        592 => [
            [['_route' => '_api_/lista_contiene_elementos/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\ListaContieneElemento', '_api_operation_name' => '_api_/lista_contiene_elementos/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/lista_contiene_elementos/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\ListaContieneElemento', '_api_operation_name' => '_api_/lista_contiene_elementos/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/lista_contiene_elementos/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\ListaContieneElemento', '_api_operation_name' => '_api_/lista_contiene_elementos/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        643 => [[['_route' => '_api_/usuarios/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Usuario', '_api_operation_name' => '_api_/usuarios/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        669 => [
            [['_route' => '_api_/usuarios{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Usuario', '_api_operation_name' => '_api_/usuarios{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/usuarios{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Usuario', '_api_operation_name' => '_api_/usuarios{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        707 => [
            [['_route' => '_api_/usuarios/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Usuario', '_api_operation_name' => '_api_/usuarios/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/usuarios/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Usuario', '_api_operation_name' => '_api_/usuarios/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/usuarios/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\Usuario', '_api_operation_name' => '_api_/usuarios/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        765 => [[['_route' => '_api_/usuario_agrega_usuarios/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioAgregaUsuario', '_api_operation_name' => '_api_/usuario_agrega_usuarios/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        791 => [
            [['_route' => '_api_/usuario_agrega_usuarios{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioAgregaUsuario', '_api_operation_name' => '_api_/usuario_agrega_usuarios{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_agrega_usuarios{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioAgregaUsuario', '_api_operation_name' => '_api_/usuario_agrega_usuarios{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        829 => [
            [['_route' => '_api_/usuario_agrega_usuarios/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioAgregaUsuario', '_api_operation_name' => '_api_/usuario_agrega_usuarios/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_agrega_usuarios/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioAgregaUsuario', '_api_operation_name' => '_api_/usuario_agrega_usuarios/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_agrega_usuarios/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioAgregaUsuario', '_api_operation_name' => '_api_/usuario_agrega_usuarios/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        889 => [[['_route' => '_api_/usuario_gestiona_elementos/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaElemento', '_api_operation_name' => '_api_/usuario_gestiona_elementos/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        915 => [
            [['_route' => '_api_/usuario_gestiona_elementos{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaElemento', '_api_operation_name' => '_api_/usuario_gestiona_elementos{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_gestiona_elementos{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaElemento', '_api_operation_name' => '_api_/usuario_gestiona_elementos{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        953 => [
            [['_route' => '_api_/usuario_gestiona_elementos/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaElemento', '_api_operation_name' => '_api_/usuario_gestiona_elementos/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_gestiona_elementos/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaElemento', '_api_operation_name' => '_api_/usuario_gestiona_elementos/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_gestiona_elementos/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaElemento', '_api_operation_name' => '_api_/usuario_gestiona_elementos/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        1000 => [[['_route' => '_api_/usuario_gestiona_usuarios/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaUsuario', '_api_operation_name' => '_api_/usuario_gestiona_usuarios/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        1027 => [
            [['_route' => '_api_/usuario_gestiona_usuarios{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaUsuario', '_api_operation_name' => '_api_/usuario_gestiona_usuarios{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_gestiona_usuarios{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaUsuario', '_api_operation_name' => '_api_/usuario_gestiona_usuarios{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        1066 => [
            [['_route' => '_api_/usuario_gestiona_usuarios/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaUsuario', '_api_operation_name' => '_api_/usuario_gestiona_usuarios/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_gestiona_usuarios/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaUsuario', '_api_operation_name' => '_api_/usuario_gestiona_usuarios/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_gestiona_usuarios/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioGestionaUsuario', '_api_operation_name' => '_api_/usuario_gestiona_usuarios/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        1122 => [[['_route' => '_api_/usuario_manipula_listas/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioManipulaLista', '_api_operation_name' => '_api_/usuario_manipula_listas/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        1149 => [
            [['_route' => '_api_/usuario_manipula_listas{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioManipulaLista', '_api_operation_name' => '_api_/usuario_manipula_listas{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_manipula_listas{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioManipulaLista', '_api_operation_name' => '_api_/usuario_manipula_listas{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        1188 => [
            [['_route' => '_api_/usuario_manipula_listas/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioManipulaLista', '_api_operation_name' => '_api_/usuario_manipula_listas/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_manipula_listas/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioManipulaLista', '_api_operation_name' => '_api_/usuario_manipula_listas/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_manipula_listas/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioManipulaLista', '_api_operation_name' => '_api_/usuario_manipula_listas/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        1245 => [[['_route' => '_api_/usuario_reporta_elementos/{id}{._format}_get', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioReportaElemento', '_api_operation_name' => '_api_/usuario_reporta_elementos/{id}{._format}_get'], ['id', '_format'], ['GET' => 0], null, false, true, null]],
        1272 => [
            [['_route' => '_api_/usuario_reporta_elementos{._format}_get_collection', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioReportaElemento', '_api_operation_name' => '_api_/usuario_reporta_elementos{._format}_get_collection'], ['_format'], ['GET' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_reporta_elementos{._format}_post', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioReportaElemento', '_api_operation_name' => '_api_/usuario_reporta_elementos{._format}_post'], ['_format'], ['POST' => 0], null, false, true, null],
        ],
        1311 => [
            [['_route' => '_api_/usuario_reporta_elementos/{id}{._format}_put', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioReportaElemento', '_api_operation_name' => '_api_/usuario_reporta_elementos/{id}{._format}_put'], ['id', '_format'], ['PUT' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_reporta_elementos/{id}{._format}_patch', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioReportaElemento', '_api_operation_name' => '_api_/usuario_reporta_elementos/{id}{._format}_patch'], ['id', '_format'], ['PATCH' => 0], null, false, true, null],
            [['_route' => '_api_/usuario_reporta_elementos/{id}{._format}_delete', '_controller' => 'api_platform.action.placeholder', '_format' => null, '_stateless' => true, '_api_resource_class' => 'App\\Entity\\UsuarioReportaElemento', '_api_operation_name' => '_api_/usuario_reporta_elementos/{id}{._format}_delete'], ['id', '_format'], ['DELETE' => 0], null, false, true, null],
        ],
        1354 => [
            [['_route' => '_preview_error', '_controller' => 'error_controller::preview', '_format' => 'html'], ['code', '_format'], null, null, false, true, null],
            [null, null, null, null, false, false, 0],
        ],
    ],
    null, // $checkCondition
];
