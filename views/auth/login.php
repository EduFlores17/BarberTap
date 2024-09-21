<h1 class="nombre-pagina">Login de inicio</h1>
<p class="descripcion-pagina">Inicia sesión con tus datos</p>

<?php 
include_once __DIR__. '/../templates/alertas.php';
?>

<form class="formulario" method="POST" action="/">
    <div class="campo">
        <label for="email">Correo electronico</label>
        <input 
        type="email"
        id="email"
        placeholder="Tu correo electronico"
        name="email"
        
        />
    </div>

    <div class="campo">
        <label for="password">Contraseña</label>
        <input 
        type="password"
        id="password"
        placeholder="Tu contraseña"
        name="password"
        
        />
    </div>

    <input type="submit" value="Iniciar Sesion" class="boton">
</form>

<div class="acciones">
    <a href="/crear-cuenta">Crea tu cuenta</a>
    <a href="/olvide">¿Olvidaste tu password?</a>
</div>