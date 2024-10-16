let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita={
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
})

function iniciarApp(){
    mostrarSeccion(); //muestra y oculta las secciones
    tabs(); //cambia la seccion cuando se presionen los tabs
    botonesPaginador(); //agrega o quita los botones del paginador
    paginaAnterior();
    paginaSiguiente();
    consultarAPI(); //consulta la api en el backend php

    idCliente(); //
    nombreCliente(); //añade el nombre del cliente al objeto de cita
    seleccionaFecha(); //añade la fecha de la cita en el objeto
    seleccionaHora(); //añade la hora de la cita en el objeto
    mostrarResumen(); // muestra el resumen de la cita
}

function mostrarSeccion(){
    //ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }
    
    //seleccionar la seccion con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //quita la clase de actual al anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual')
    }


    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`)
    tab.classList.add('actual')

}


function tabs(){
    const botones = document.querySelectorAll('.tabs button')
    
    botones.forEach(boton =>{
        boton.addEventListener('click', function(event){
            paso = parseInt(event.target.dataset.paso );

            mostrarSeccion();
            botonesPaginador();

            
        })
    })
}

function botonesPaginador(){
    const paginaAnterior = document.querySelector('#anterior')
    const paginaSiguiente = document.querySelector('#siguiente')

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }else if(paso === 3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior')
    paginaAnterior.addEventListener('click', function(){
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
    })
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente')
    paginaSiguiente.addEventListener('click', function(){
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
    })
}

async function consultarAPI(){

    try {
        const url = '/api/servicios';
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios)
    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio =>{
        const {id, nombre, precio} = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;

        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
        
    })
}

function seleccionarServicio(servicio){
    const {id} = servicio;
    const {servicios} = cita;

    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`)

    //comprobar si un servicio ya fue agregado o quitarlo
    if(servicios.some(agregado => agregado.id === id )){
        //eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id)
        divServicio.classList.remove('seleccionado')
    }else{
        //agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado')
    }

    
    
    
    //console.log(cita)
}

function nombreCliente(){
    const nombre = document.querySelector('#nombre').value;
    cita.nombre=nombre;

}

function idCliente(){
    const id = document.querySelector('#id').value;
    cita.id=id;

}

function seleccionaFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(event){

        const dia = new Date(event.target.value).getUTCDay();
        
        if([6,0].includes(dia)){
            event.target.value= '';
            mostrarAlerta('Fines de semana no permitidos', 'error', '#paso-2 p');
        }else{
            cita.fecha = event.target.value;
        }
    })
}

function seleccionaHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(event){
        //console.log(event.target.value);

        const horaCita = event.target.value;
        const hora = horaCita.split(":")[0];
        if(hora <10 || hora >18){
            event.target.value= '';
            mostrarAlerta('Horario no valido', 'error', '#paso-2 p');
        }else{
            cita.hora = event.target.value;
            //console.log(cita)
        }
    })
}


function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){
    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        alertaPrevia.remove();
    }

    //scripting para crear la alerta

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece){
         //eliminar la alerta
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }

}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen')

    //limpiar el contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild)
    }
    

    //object values itera en el objeto
    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false)
        return;
    }

    //formatear div de resumen
    const {nombre, fecha, hora, servicios} = cita;

    //HEADING PARA SERVICIOS Y RESUMEN
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = "Resumen de servicios";
    resumen.appendChild(headingServicios);

    //ITERANDO Y MOSTRANDO LOS SERVICIOS

    servicios.forEach(servicio =>{
        const {id, precio, nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio)
    })

    //HEADING PARA SERVICIOS Y RESUMEN
    const headingCita = document.createElement('H3');
    headingCita.textContent = "Resumen de cita";
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:  </span> ${nombre}`;

    //FORMATEAR LA FECHA EN ESPAÑOL
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date (Date.UTC(year, mes, dia));

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones)
    

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:  </span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Horario:  </span> ${hora} horas`;

    //BOTON PARA CREAR UNA CITA
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}

async function reservarCita(){

    const {nombre, fecha, hora, servicios, id} = cita;

    const idServicios = servicios.map(servicio => servicio.id);
    //console.log(idServicios)
    
    
    const datos = new FormData();
    
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    //console.log([...datos])
    

    try {
        const url = '/api/citas'
        const respuesta = await fetch(url,{
            method: 'POST',
            body: datos
            
        });
    
        const resultado = await respuesta.json();
        console.log(resultado.resultado);
    
        if(resultado.resultado){
            Swal.fire({
                icon: "success",
                title: "Cita creada",
                text: "Tu cita ha sido creada con exito",
                button: 'Cerrar'
            }) .then(() =>{
                window.location.reload();
            })
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Hubo un error al guardar la cita",
            
        });
    }
    //peticion hacia la api

    
    
    //opuede servir para verificar si los datos estan enviando bien
    //console.log([...datos])
}