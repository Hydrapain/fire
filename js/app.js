// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyCld6KWY_N7a8nGPbnigLmpmAaB5TxzqZw",
  authDomain: "usuarios-6830f.firebaseapp.com",
  databaseURL: "https://usuarios-6830f.firebaseio.com",
  projectId: "usuarios-6830f",
  storageBucket: "usuarios-6830f.appspot.com",
  messagingSenderId: "863158451087",
  appId: "1:863158451087:web:88904063f580df19"
};

// Initialize Firebase
firebase.initializeApp(config);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Definción de eventos para botones de registro y conexión
var re = document.getElementById("registrar");
re.addEventListener("click", registrar, false);
var co = document.getElementById("conectar");
co.addEventListener("click", conectar, false);

function registrar() {
  var email = document.getElementById("email1").value;
  var password = document.getElementById("password1").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      confirmar();
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
      $("#modalRegistro").modal('hide');
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function conectar() {
  var email = document.getElementById("email2").value;
  var password = document.getElementById("password2").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Existe usuario activo.");
      contenidosUsuarioRegistrado(user);

      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log('Usuario verificado: ' + emailVerified);
      // ...
    } else {
      // User is signed out.
      console.log("No existe ningún usuario activo.");
    }
  });
}

function contenidosUsuarioRegistrado(usuario) {
  var contenido = document.getElementById("contenido");
  if (usuario.emailVerified) {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Siéntete a gusto en nuestro portal.</p>
        <hr>
        <p class="mb-0">Tenemos muchos contenidos exclusivos solo para usuarios registrados como tú.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <h2>Agregar usuarios</h2>

      <div class="form-inline">
        <label for="tipo" class="col-sm-2 col-form-label">Tipo territorio: </label>
        <input type="number" id="tipo" placeholder="Introduce tipo de territorio" class="form-control my-3 col-sm-4" >
      </div>
      <div class="form-inline">
        <label for="territorio" class="col-sm-2 col-form-label">Territorio: </label>
        <input type="number" id="territorio" placeholder="Introduce un territorio" class="form-control my-3 col-sm-4" maxlenght="50" pattern="[A-Za-zÑñÁÉÍÓúáéíóúÇç\s]">
      </div>
      <div class="form-inline">
        <label for="inicial" class="col-sm-2 col-form-label">Fecha Inicial: </label>
        <input type="text" id="inicial" placeholder="Introduce fecha inicial" class="form-control my-3 col-sm-1" maxlenght="4" pattern="\d{4}">
      </div>
      <div class="form-inline">
        <label for="final" class="col-sm-2 col-form-label">Fecha Final: </label>
        <input type="text" id="final" placeholder="Introduce fecha final" class="form-control my-3 col-sm-4" >
      </div>
      <div class="form-inline">
        <label for="cuando" class="col-sm-2 col-form-label">Cuándo se trabaja: </label>
        <input type="text" id="cuando" placeholder="Cuando se trabaja" class="form-control my-3 col-sm-4" maxlenght="50" pattern="[A-Za-zÑñÁÉÍÓúáéíóúÇç\s]">
      </div>
      <div class="form-inline">
        <label for="quien" class="col-sm-2 col-form-label">Quien trabaja: </label>
        <input type="number" id="quien" placeholder="Quien trabaja" class="form-control my-3 col-sm-1" maxlenght="4" pattern="\d{4}">
      </div>
      <button class="btn btn-info my-3" id="guardar">Guardar</button>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tipo</th>
            <th scope="col">Territorio</th>
            <th scope="col">Inicial</th>
            <th scope="col">Final</th>
            <th scope="col">Apellido</th>
            <th scope="col">Cuando</th>
            <th scope="col">Quien</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody id="tabla">
        </tbody>
      </table>
    `;
    cargarTabla();
    $("#cerrarconexion").html(`<button id="cerrar" class="btn btn-danger btn-sm ml-2">Cerrar sesión</button>`);
    var ce = document.getElementById("cerrar");
    ce.addEventListener("click", cerrar, false);
    var gu = document.getElementById("guardar");
    gu.addEventListener("click", guardar, false);
  } else {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Activa tu cuenta para ver nuestros contenidos para usuarios registrados.</p>
        <hr>
        <p class="mb-0">Revisa tu correo electrónico</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
  }
}

function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      console.log("Saliendo...");
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <strong>¡Cáspitas!</strong> Esperamos verte pronto otra vez por nuestro portal.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
      cerrarconexion.innerHTML = "";
    })
    .catch(function (error) {
      console.log(error);
    });
}

function confirmar() {
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function () {
    // Email sent.
    console.log("Enviando correo...");
  }).catch(function (error) {
    // An error happened.
    console.log(error);
  });
}

function guardar() {
  var usuario = {
    tipo: document.getElementById("tipo").value,
    territorio: document.getElementById("territorio").value,
    inicial: document.getElementById("inicial").value
    final: document.getElementById("final").value,
    cuando: document.getElementById("cuando").value,
    quien: document.getElementById("quien").value
  };

  db.collection("usuarios").add(usuario)
    .then(function (docRef) {
      console.log("Documento escrito con ID: ", docRef.id);
      document.getElementById("tipo").value = "";
      document.getElementById("territorio").value = "";
      document.getElementById("inicial").value = "";
      document.getElementById("final").value = "";
      document.getElementById("cuando").value = "";
      document.getElementById("quien").value = "";
    })
    .catch(function (error) {
      console.error("Error añadiendo el documento: ", error);
    });
}

// Lectura de los documentos
function cargarTabla() {
  db.collection("usuarios").onSnapshot(function (querySnapshot) {
    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    querySnapshot.forEach(function (doc) {
      tabla.innerHTML += `
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().tipo}</td>
          <td>${doc.data().territorio}</td>
          <td>${doc.data().inicial}</td>
          <td>${doc.data().final}</td>
          <td>${doc.data().cuando}</td>
          <td>${doc.data().quien}</td>
          <td><button class="btn btn-success" onclick="editarDatos('${doc.id}');">Editar</button></td>
          <td><button class="btn btn-danger" onclick="borrarDatos('${doc.id}');">Eliminar</button></td>
        </tr>
      `;

    });
  });
}

// Borrar datos de documentos
function borrarDatos(parId) {
  db.collection("usuarios").doc(parId).delete()
    .then(function () {
      console.log("Usuario borrado correctamente.");
    }).catch(function (error) {
      console.error("Error borrando el usuario: ", error);
    });
}

// Editar datos de documentos
function editarDatos(parId) {

}

observador();