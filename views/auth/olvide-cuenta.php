<h1 class="nombre-pagina">Olvide mi cuenta</h1>
<p class="descripcion-pagina">Reestablece tu contraseña escribiendo tu correo electronico</p>

<?php 
include_once __DIR__. '/../templates/alertas.php';
?>

<form class="formulario" method="POST" action="/olvide">
    <div class="campo">
        <label for="email">Correo electronico</label>
        <input 
        type="email"
        id="email"
        placeholder="Tu correo electronico"
        name="email"
        
        />
    </div>
    
    <input type="submit" value="Enviar instrucciones" class="boton">
</form>

<div class="acciones">
    <a href="/crear-cuenta">Crea tu cuenta</a>
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
</div>