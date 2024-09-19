<?php 

namespace Controllers;

use MVC\Router;

class LoginController{
    public static function login(Router $router){
        $router-> render('auth/login', []);
    }
    public static function logout(){
        echo "desde logout";
    }
    public static function olvide(Router $router){
        $router-> render('auth/olvide-cuenta', []);
    }
    public static function recuperar(){
        echo "recuperado desde tu puta madre";
    }
    public static function crear(Router $router){
        $router-> render('auth/crear-cuenta', []);
    }
}


?>
