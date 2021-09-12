//VARIABLES-CONSTANTES
const cards = document.getElementById('cards'); //DIV CONTAINER DE LA CARD
const footer = document.getElementById('footer'); // FOOTER CARRITO VACIO
const items = document.getElementById('items'); //ELEMENTOS DEL CARRITO

const templateCard = document.getElementById('template-card').content; //LA CARD
const templateCarrito = document.getElementById('template-carrito').content; // CARRITO 
const templateFooter = document.getElementById('template-footer').content; // FOOTER CARRITO

const fragment = document.createDocumentFragment(); //CREAN ESPACIO DONDE IRA LA CARD
let carrito = {}; //ARRAY VACIO DONDE SE AGREGARAN LOS PRODUCTOS AL CARRITO

let comprar = document.getElementById('comprar'); // BOTON COMPRAR

//CONTADOR DEL CARRITO
const btnAdd = document.getElementsByClassName('btnAdd');
let contador = document.getElementById('contador');
let contadorContenido = Number(document.getElementById('contador').innerText);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MI ARRAY DE OBJETOS (PRODUCTOS EN VENTA)
class Producto {

    constructor(item){
        this.id = item.id;
        this.titulo = item.titulo;
        this.imagen = item.imagen;
        this.precio = item.precio;
    }

};

const PRODUCTOS = [
    new Producto ({id: "1", titulo: "Rodillo", imagen: "media/rodillo.jpg" ,precio: "100",}),
    new Producto ({id: "2", titulo: "Pelota", imagen: "media/pelota.jpg" ,precio: "150",}),
    new Producto ({id: "3", titulo: "Hueso", imagen: "media/hueso.jpg" , precio: "200",}),
    new Producto ({id: "4", titulo: "Pelota Verde", imagen: "media/pelotaverde_2.jpg" , precio: "250",}),
    new Producto ({id: "5", titulo: "Pelota Pinchos", imagen: "media/pinchos_3.jpg" , precio: "300",}),
    new Producto ({id: "6", titulo: "Hueso", imagen: "media/huesor_3.jpg" , precio: "350",}),
    new Producto ({id: "7", titulo: "Soga", imagen: "media/soga.jpg" , precio: "400",}),
    new Producto ({id: "8", titulo: "Collar", imagen: "media/collar_3.jpg" , precio: "450",}),
    new Producto ({id: "9", titulo: "Pollo", imagen: "media/pollo_2.jpg" , precio: "500",}),
    new Producto ({id: "10", titulo: "Hueso de Goma", imagen: "media/huesov_2.jpg" , precio: "550",}),
    new Producto ({id: "11", titulo: "Soga", imagen: "media/sogap.jpg" , precio: "600",}),
    new Producto ({id: "12", titulo: "Hueso", imagen: "media/huesob.jpg" , precio: "650",}),
];

//VERIFICANDO DATOS EN LOCALSTORAGE
//CONTADOR 
document.addEventListener('DOMContentLoaded' , () => {
    if(localStorage.length == ''){
        contador.innerText = contadorContenido;
    
    }else{
        contador.innerText = localStorage.getItem('datos');  
        contadorContenido = Number(document.getElementById('contador').innerText);
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CREANDO CARDS
PRODUCTOS.forEach((item) => {
    templateCard.querySelector('h5').textContent = item.titulo;
    templateCard.querySelector('span').textContent = item.precio;
    templateCard.querySelector('img').setAttribute("src", item.imagen)
    templateCard.querySelector('button').dataset.id = item.id;

    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
});

//PINTANDO CARDS EN DOM
cards.appendChild(fragment); 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//AGREGANDO AL CARRITO LOS PRODUCTOS
cards.addEventListener('click' , evento => {

    if(evento.target.classList.contains('btn-primary')){
        setCarrito(evento.target.parentElement);

        sweetAlert(
            'Buen trabajo!',
            'Producto agregado con éxito',
            'success',
          );

    };
    // evento.stopPropagation();
});

items.addEventListener('click', evento => {
    btnAccion(evento);
})

const setCarrito = objeto => {
    const productoAdd = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        titulo: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('span').textContent,
        cantidad: 1
    };

    if(carrito.hasOwnProperty(productoAdd.id)){
        productoAdd.cantidad = carrito[productoAdd.id].cantidad + 1
    };

    carrito[productoAdd.id] = {...productoAdd};
    pintarCarrito();
};

const pintarCarrito = () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(productoAdd => {
        templateCarrito.querySelector('th').textContent = productoAdd.id
        templateCarrito.querySelectorAll('td')[0].textContent = productoAdd.titulo
        templateCarrito.querySelectorAll('td')[1].textContent = productoAdd.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = productoAdd.id
        templateCarrito.querySelector('.btn-danger').dataset.id = productoAdd.id
        templateCarrito.querySelector('span').textContent = productoAdd.cantidad * productoAdd.precio

        const clone = templateCarrito.cloneNode(true);
        
        fragment.appendChild(clone);
    });
    
    items.appendChild(fragment);

    pintarFooter();

    localStorage.setItem('carrito' , JSON.stringify(carrito));
}

const pintarFooter = () => {
    footer.innerHTML = "";

    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

        return
    }

    const nCantidad = Object.values(carrito).reduce( (acc , {cantidad}) => acc + cantidad, 0);

    const nPrecio = Object.values(carrito).reduce( (acc , {cantidad,precio}) => acc + cantidad * precio, 0);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;
    contador.textContent = nCantidad

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);

    footer.appendChild(fragment);

    localStorage.setItem('datos' , contadorContenido); 

    const btnVaciar = document.getElementById('vaciar-carrito');
    btnVaciar.addEventListener('click' , () => {
        carrito = {};
        contador.textContent = 0;
        pintarCarrito();
        pintarFooter();
    });
};

const btnAccion = evento => {
    if (evento.target.classList.contains('btn-info')){

        const productoI = carrito[evento.target.dataset.id];
        productoI.cantidad++ ;

        carrito[evento.target.dataset.id] = {...productoI}
        pintarCarrito();
    }

    if(evento.target.classList.contains('btn-danger')){
        const productoD = carrito[evento.target.dataset.id];
        productoD.cantidad--;

        if(productoD.cantidad === 0){
            delete carrito[evento.target.dataset.id]
        }        
        pintarCarrito();
    }
}

comprar.addEventListener('click' , () => {
    sweetAlert(
        'Compra finalizada',
        '',
        'success',
      );

      carrito = {};
      contador.textContent = 0;
      pintarCarrito();
      pintarFooter();
})









