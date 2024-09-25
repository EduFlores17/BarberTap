let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita={
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
    nombreCliente(); //añade el nombre del cliente al objeto de cita
    seleccionaFecha(); //añade la fecha de la cita en el objeto
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
        const url = 'http://localhost:3000/api/servicios';
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

    
    
    
    console.log(cita)
}

function nombreCliente(){
    const nombre = document.querySelector('#nombre').value;
    cita.nombre=nombre;

}

function seleccionaFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(event){

        const dia = new Date(event.target.value).getUTCDay();
        
        if([6,0].includes(dia)){
            event.target.value= '';
            mostrarAlerta('Fines de semana no permitidos', 'error');
        }else{
            cita.fecha = event.target.value;
        }
    })
}


function mostrarAlerta(mensaje, tipo){
    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) return;

    //scripting para crear la alerta

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    
    const formulario = document.querySelector('#paso-2 p');
    formulario.appendChild(alerta);

    //eliminar la alerta
    setTimeout(() => {
        alerta.remove()
    }, 3000);
}