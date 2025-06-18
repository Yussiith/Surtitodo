let productos = JSON.parse(localStorage.getItem("productos")) || [
  {
    nombre: "Camiseta Estampada",
    categoria: "convencional",
    descripcion: "Camiseta moderna y cómoda",
    precio: "₡15,000",
    imagen: "images/camiseta.jpg",
    whatsapp: "https://wa.me/50661631200?text=Quiero%20comprar%20Camiseta%20Estampada"
  },
  {
    nombre: "Zapatillas Deportivas",
    categoria: "ortopedico",
    descripcion: "Zapatillas para correr",
    precio: "₡40,000",
    imagen: "images/zapatillas.jpg",
    whatsapp: "https://wa.me/50661631200?text=Quiero%20comprar%20Zapatillas%20Deportivas"
  }
];

let esAdmin = false;

function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function mostrarSeccion(id) {
  // Oculta todas las secciones excepto header y footer
  document.querySelectorAll("main > section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  
  // Si es modal, muestra el modal y no los otros sections
  if(id === "adminLogin") {
    document.getElementById("adminLogin").classList.remove("hidden");
  } else {
    document.getElementById("adminLogin").classList.add("hidden");
  }
}

function mostrarProductos(lista = productos) {
  const contenedor = document.getElementById("productList");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  lista.forEach(p => {
    contenedor.innerHTML += `
      <div class="product">
        <h3>${p.nombre}</h3>
        <img src="${p.imagen}" alt="${p.nombre}">
        <p>${p.descripcion}</p>
        <p class="price">${p.precio || ""}</p>
        <a href="${p.whatsapp}" target="_blank" rel="noopener noreferrer">Comprar por WhatsApp</a>
      </div>`;
  });
}

function filterProducts() {
  const filtro = document.getElementById("categoriaSelect").value;
  const filtrados = filtro === "all" ? productos : productos.filter(p => p.categoria === filtro);
  mostrarProductos(filtrados);
}

function buscarProducto() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const lista = document.getElementById("searchSuggestions");
  lista.innerHTML = "";

  if (input.length === 0) return;

  productos
    .filter(p => p.nombre.toLowerCase().includes(input))
    .forEach(p => {
      const li = document.createElement("li");
      li.textContent = p.nombre;
      li.onclick = () => {
        alert("Seleccionaste: " + p.nombre);
        lista.innerHTML = "";
        mostrarSeccion("inicio");
      };
      lista.appendChild(li);
    });
}

// Mostrar modal admin login
function mostrarLoginAdmin() {
  mostrarSeccion("adminLogin");
}

// Cerrar modal admin login
function cerrarModalAdmin() {
  document.getElementById("adminLogin").classList.add("hidden");
}

// Verificar clave admin con validaciones
function verificarClave() {
  const cedula = document.getElementById("adminCedula").value.trim();
  const nombre = document.getElementById("adminNombre").value.trim();
  const clave = document.getElementById("adminClave").value;

  if(!cedula || !nombre || !clave) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Ejemplo clave fija, puedes implementar tu lógica
  if (clave === "1234") {
    esAdmin = true;
    cerrarModalAdmin();
    mostrarSeccion("admin");
    renderListaAdmin();
  } else {
    alert("Contraseña incorrecta");
  }
}

function renderListaAdmin() {
  const lista = document.getElementById("adminList");
  lista.innerHTML = "";
  productos.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${p.nombre} <button onclick="eliminarProducto(${i})">Eliminar</button>`;
    lista.appendChild(li);
  });
}

function eliminarProducto(index) {
  if(confirm(`¿Seguro que deseas eliminar el producto "${productos[index].nombre}"?`)) {
    productos.splice(index, 1);
    guardarProductos();
    renderListaAdmin();
    mostrarProductos();
    alert("Producto eliminado correctamente.");
  }
}

function addProduct() {
  const nombre = document.getElementById("productName").value.trim();
  const categoria = document.getElementById("productCategory").value;
  const descripcion = document.getElementById("productDescription").value.trim();
  let precio = document.getElementById("productPrice").value.trim();
  const imagenInput = document.getElementById("productImageFile");

  if (!nombre || !descripcion || !imagenInput.files[0] || !precio) {
    alert("Completa todos los campos");
    return;
  }

  // Asegurar que el precio empiece con símbolo ₡ y tenga formato correcto
  if(!precio.startsWith("₡")) {
    precio = "₡" + precio;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const producto = {
      nombre,
      categoria,
      descripcion,
      precio,
      imagen: e.target.result,
      whatsapp: `https://wa.me/50661631200?text=Quiero%20comprar%20${encodeURIComponent(nombre)}`
    };
    productos.push(producto);
    guardarProductos();
    renderListaAdmin();
    mostrarProductos();
    alert("Producto agregado correctamente.");
    document.getElementById("productName").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productPrice").value = "";
    imagenInput.value = "";
  };
  reader.readAsDataURL(imagenInput.files[0]);
}

function logoutAdmin() {
  if(confirm("¿Deseas cerrar sesión del administrador?")) {
    esAdmin = false;
    mostrarSeccion("inicio");
  }
}

// Al cargar página
window.onload = () => {
  mostrarProductos();

  // Asignar evento para logo (ir a inicio)
  const logoElems = document.querySelectorAll("#logoBtn");
  logoElems.forEach(el => {
    el.style.cursor = "pointer";
    el.onclick = () => mostrarSeccion("inicio");
  });
};
