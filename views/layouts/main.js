let socket = io.connect();
let { normalize, schema, denormalize } = require('normalizr');

// VISTA DE PRODUCTOS

socket.on("productos", (data) => {
  if (data) {
    document.getElementById("vistaContainer").innerHTML = `
        <div class="table-responsive">
            <table class="table table-dark">
                <tr class="text-white fw-bold"> 
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                </tr>
                ${data.map(
                  (prod) =>
                    `<tr>
                        <td class="align-middle">${prod.id}</td>
                        <td class="align-middle">${prod.title}</td>
                        <td class="align-middle">$${prod.price}</td>
                        <td class="align-middle">
                            <img src=${prod.thumbnail} style="width: 80px">
                        </td>
                    </tr>`
                )}
            </table>
        </div>`
  } else {
    document.getElementById("vistaContainer").innerHTML =
      '<h3 class="alert alert-danger">No se encontraron productos</h3>';
  }
});

function AddProducto(e) {
  const productoN = {
    title: document.getElementById("nombre").value,
    price: document.getElementById("Precio").value,
    thumbnail: document.getElementById("URLImagen").value,
  };
  socket.emit("nuevo-producto", productoN);
  return false;
}

// CENTRO DE MENSAJES

socket.on("mensajes", (data) => {

  console.log(`Data normalizada con normalizr:`);
  console.log(data);
  console.log('Data desnomalizada con normalizr:');
  const DesnormalizedData = Desnormalizacion(data)
  console.log(DesnormalizedData);
  
  document.getElementById("contenedorMsj").innerHTML = 
    DesnormalizedData.mensajes.map(
      (msj) =>
        `<span class="text-primary"><strong>${msj.author.id}</strong></span>
        <span class="text-danger">[ ${msj.fyh} ]</span>: 
        <span class="text-success fst-italic">${msj.text}</span>
        <span class="text-success fst-italic"><img style="width: 4%" class="ml-2" src="${msj.author.avatar}" alt="${msj.author.name} avatar"></span>`

    )
    .join("<br>");
});


function Desnormalizacion(data) {
  const messages = {id: "mensajesData", mensajes: data}
  const authorSchema = new schema.Entity('author');
  const normalizedData = normalize(messages, authorSchema);
  const denormalizedBlogpost = denormalize(normalizedData.result, authorSchema, normalizedData.entities);
  return denormalizedBlogpost
}


function AddMensaje(e) {
  const mensaje = {
    author: {
      id: document.getElementById("enviarEmail").value,
      nombre: document.getElementById("enviarNombre").value,
      apellido: document.getElementById("enviarApellido").value,
      edad: document.getElementById("enviarEdad").value,
      alias: document.getElementById("enviarAlias").value,
      avatar: document.getElementById("enviarAvatar").value
    },
    fyh: new Date().toLocaleString(),
    text: document.getElementById("enviarMsj").value,
  };
  socket.emit("nuevo-mensaje", mensaje);
  return false;
}