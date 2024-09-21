<?php


namespace Classes;

use PHPMailer\PHPMailer\PHPMailer;

class Email{

    public $email;
    public $nombre;
    public $apellido;
    public $token;

    public function __construct($nombre, $apellido, $email, $token){
        $this->email = $email;
        $this->nombre = $nombre;
        $this->apellido = $apellido;
        $this->token = $token;
    }

    public function enviarConfirmacion(){
        //crear el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '37324c5588d0e1';
        $mail->Password = 'e754b0ad25637b';

        $mail->setFrom('cuentas@barbertap.com');
        $mail->addAddress('cuentas@barbertap.com');
        $mail->Subject = 'Confirma tu cuenta'; 

        //setHTML
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong> Hola ". $this->nombre .  " " . $this->apellido. "</strong> Has creado a tu cuenta en BarberTap,
        solo deberás confirmarla presionando el siguiente enlace</p>";
        $contenido .= "<p> Presiona aquí  <a href='http://localhost:3000/confirmar-cuenta?token=" 
        . $this->token . "'>Confirmar cuenta</a></p>";
        $contenido .= "<p> Si tu no solicitaste este cuenta, puedes ignorar el mensaje </p>";
        $contenido .= "<html></html>";

        $mail ->Body = $contenido;

        //ENVIAR EL EMAIL
        $mail->send();
    }

    public function enviarInstrucciones(){
        //crear el objeto de email
        $mail = new PHPMailer();
        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '37324c5588d0e1';
        $mail->Password = 'e754b0ad25637b';

        $mail->setFrom('cuentas@barbertap.com');
        $mail->addAddress('cuentas@barbertap.com');
        $mail->Subject = 'Reestablece tu contraseña'; 

        //setHTML
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        $contenido = "<html>";
        $contenido .= "<p><strong> Hola ". $this->nombre .  " " . $this->apellido. "</strong> Has solicitado reestablecer
        tu contraseña a tu cuenta en BarberTap, solo debes presionar el siguiente enlace para hacerlo</p>";
        $contenido .= "<p> Presiona aquí  <a href='http://localhost:3000/recuperar?token=" 
        . $this->token . "'>Reestablecer contraseña</a></p>";
        $contenido .= "<p> Si tu no solicitaste este cuenta, puedes ignorar el mensaje </p>";
        $contenido .= "<html></html>";

        $mail ->Body = $contenido;

        //ENVIAR EL EMAIL
        $mail->send();
    }
}

?>