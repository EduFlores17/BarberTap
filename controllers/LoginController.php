<?php 

namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

class LoginController{
    public static function login(Router $router){

        $alertas= [];

        if($_SERVER['REQUEST_METHOD']=== 'POST'){
            $auth = new Usuario($_POST);
            $alertas = $auth-> validarLogin();

            if(empty($alertas)){
                //comprobar que exista el usuario
                $usuario = Usuario::where('email', $auth->email);
                if($usuario){
                    //verificar contraseña
                    if($usuario->comprobarPasswordAndVerificado($auth->password)){
                        //autenticar el usuario
                        if(!isset($_SESSION)) {
                            session_start();
                        };

                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre .  " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        //redireccionamiento
                        if($usuario->admin === '1'){
                            $_SESSION['admin'] = $usuario->admin ?? null;
                            header ('Location: /admin');
                            
                        }else{
                            header ('Location: /cita');
                        }
                    

                    }
                }else{
                    Usuario::setAlerta('error', 'El usuario no existe');
                }
            }

        }

        $alertas = Usuario::getAlertas();

        $router-> render('auth/login', [
            'alertas' => $alertas
        ]);
    }
    public static function logout(){
        session_start();
        
        $_SESSION = [];
        header('Location: /');
        
    }


    public static function olvide(Router $router){
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $auth = new Usuario($_POST);
            $alertas= $auth->validarEmail();

            if(empty($alertas)){
                $usuario = Usuario::where('email', $auth->email);
                
                if($usuario && $usuario->confirmado === '1'){
                    //generar un token
                    $usuario->crearToken();
                    $usuario->guardar();

                    // enviar el email
                    $email = new Email($usuario->nombre, $usuario->apellido, $usuario->email, $usuario->token);
                    $email->enviarInstrucciones();

                    //alerta
                    Usuario::setAlerta('exito', 'Revisa tu correo');

                }else{
                    Usuario::setAlerta('error', 'El usuario no existe o no esta confirmado');
                    
                }
                $alertas = Usuario::getAlertas();
            }
            
        }

        $router-> render('auth/olvide-cuenta', [
            'alertas' => $alertas
        ]);
    }


    public static function recuperar(Router $router){
        $alertas=[];
        $error = false;

        $token = s($_GET['token']);
        
        //buscar usuario por su token
        $usuario = Usuario::where('token', $token);
        if(empty($usuario)){
            Usuario::setAlerta('error', 'token no valido');
            $error = true;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            //leer el nuevo password y guardarlo
            $password = new Usuario($_POST);
            $alertas = $password->validarPassword();

            if(empty($alertas)){
                $usuario->password = '';
                $usuario->password = $password->password;
                $usuario-> hashPassoword();
                $usuario->token = '';
                $resultado = $usuario->guardar();

                if($resultado){
                    header ('Location: /');
                }
            }
        }
        
       // debuguear($usuario);

        $alertas= Usuario::getAlertas();
        $router->render('auth/recuperar-password', [
            'alertas' => $alertas,
            'error' => $error
        ]);
    }
    public static function crear(Router $router){

        $usuario = new Usuario;

        //alertas vacias

        $alertas=[];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validadNuevaCuenta();
            
            //revisar que alerta este vacio
            if(empty($alertas)){
                //verificar que el usuario no este registrado
                $resultado =  $usuario->existeUsuario();

                if($resultado -> num_rows){
                    $alertas = Usuario::getAlertas();
                }else{

                    //hashear el password
                    $usuario->hashPassoword();

                    //GENERAR UN TOKEN UNICO
                    $usuario->crearToken();
                    //enviarl el email
                    $email = new Email($usuario->nombre, $usuario->apellido, $usuario->email, $usuario->token);
                    
                    $email->enviarConfirmacion();

                    //debuguear($usuario);
                    
                    //crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado){
                        header ('Location: /mensaje');
                    }
                }
                
            }
        }


        $router-> render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas,
            
        ]);
    }

    public static function mensaje (Router $router){
        $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router){
        $alertas = [];

        $token = s($_GET['token']);
        
        $usuario = Usuario::where('token', $token);

        if(empty($usuario) || $usuario->token === ''){
            //mostrar mensaje de error
            Usuario::setAlerta('error', 'Token no válido');
        }else{
            //modificar a usuario confirmado
            
            $usuario->confirmado = "1";
            $usuario->token = '';
            $usuario->guardar();
            $usuario->setAlerta('exito', 'Cuenta comprobada correctamente');
        }

        $alertas = Usuario::getAlertas();
        
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas
        ]);
    }
}


?>
