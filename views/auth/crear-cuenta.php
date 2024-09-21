<h1 class="nombre-pagina">Crea tu cuenta</h1>
<p class="descripcion-pagina">Llena el siguiente formulario para crear una cuenta</p>

<?php 
include_once __DIR__. '/../templates/alertas.php';
?>

<form class="formulario" method="POST" action="/crear-cuenta">

    <div class="campo">
        <label for="nombre">Nombre</label>
        <input 
        type="text"
        id="nombre"
        placeholder="Tu nombre"
        name="nombre"
        value="<?php echo s($usuario->nombre); ?>"
        
        />
    </div>

    <div class="campo">
        <label for="apellido">Apellido</label>
        <input 
        type="text"
        id="apellido"
        placeholder="Tu apellido"
        name="apellido"
        value="<?php echo s($usuario->apellido); ?>"
        
        />
    </div>

    <div class="campo">
        <label for="telefono">Telefono</label>
        <input 
        type="tel"
        id="telefono"
        placeholder="Tu telefono"
        name="telefono"
        value="<?php echo s($usuario->telefono); ?>"
        
        />
    </div>

    <div class="campo">
        <label for="email">Correo electronico</label>
        <input 
        type="email"
        id="email"
        placeholder="Tu correo electronico"
        name="email"
        value="<?php echo s($usuario->email); ?>"
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

    <input type="submit" value="Crear Cuenta" class="boton">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
    <a href="/olvide">¿Olvidaste tu password?</a>
</div>