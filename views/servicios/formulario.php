<div class="campo">
    <label for="nombre">Nombre</label>
    <input type="text"
    id="nombre"
    placeholder="Nombre del servicio"
    name="nombre"
    value="<?php echo s($servicio->nombre); ?>"
    >
</div>

<div class="campo">
    <label for="precio">Precio</label>
    <input type="number"
    id="precio"
    placeholder="Precio del servicio"
    name="precio"
    value="<?php echo s($servicio->precio); ?>"
    >
</div>