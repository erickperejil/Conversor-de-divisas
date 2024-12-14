var animation = lottie.loadAnimation({
    container: document.getElementById("lottie-animation"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "assets/animations/world.json",
  });
  animation.setSpeed(0.1);


  var animation2 = lottie.loadAnimation({
    container: document.getElementById("lottie-animation2"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "assets/animations/coin.json",
  });
  animation2.setSpeed(1);
  let debounceTimer;
  
  const debounce = (func, delay) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
  };
  
  const convertidorFetch = async (data) => {
    console.log(data);
    try {
      const response = await fetch("http://127.0.0.1:5000/post/convertidor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor: " + response.statusText);
      }
  
      const respuesta = await response.json();
      const result = respuesta.result;
      console.log("Resultado de la conversión:", result ? result.result : "Ningún resultado");
  
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error; // Lanza el error para que pueda manejarse en `updateData`
    }
  };
  

  const fetchImagenArbol = async () => {
    try {
        // Realizar la solicitud fetch para obtener la imagen
        const response = await fetch("http://127.0.0.1:5000/get/arbol");
        
        if (!response.ok) {
            throw new Error("Error al obtener la imagen: " + response.statusText);
        }
        
        // Convertir la respuesta en un blob
        const imageBlob = await response.blob();
        
        // Crear una URL para el blob
        const imageUrl = URL.createObjectURL(imageBlob);
        
        // Obtener el elemento de la imagen en tu HTML
        const imageElement = document.getElementById("imagen-arbol");
        
        // Establecer la fuente de la imagen
        imageElement.src = imageUrl;

    } catch (error) {
        console.error("Error al obtener la imagen del árbol:", error);
    }
};


function cambiarVista() {
    fetchImagenArbol()
    const vista1 = document.getElementById("vista1");
    const vista2 = document.getElementById("vista2");
    const vistaAnimada = document.getElementById("vistaanimacion");

    // Activar la animación de desplazamiento
    vistaAnimada.style.display = "flex"; // Asegura que la animación sea visible
    vistaAnimada.classList.add("vista-activa");

    // Después de la animación, alternar las vistas
    setTimeout(() => {
        if (vista1.style.display !== "none") {
            vista1.style.display = "none"; // Ocultar vista1
            vista2.style.display = "flex"; // Mostrar vista2
        } else {
            vista2.style.display = "none"; // Ocultar vista2
            vista1.style.display = "flex"; // Mostrar vista1
        }

        // Desactivar la animación de desplazamiento
        vistaAnimada.classList.remove("vista-activa");
    }, 2000); // 2 segundos para la animación
}






  
  let isSwapping = false;
  
  const updateData = async (editedInput) => {
    const cantidadInput = document.getElementById("cantidad");
    const cantidad2Input = document.getElementById("cantidad2");
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
    
  
    const cantidadValida = cantidadInput.value !== "" || cantidad2Input.value !== "";
    const origenValido = origenSelect.value !== "";
    const destinoValido = destinoSelect.value !== "";
    updateConversionInfo(origenSelect.value, destinoSelect.value);
    if (cantidadValida && origenValido && destinoValido) {
      const data = {
        cantidad: editedInput.value,
        origen: origenSelect.value,
        destino: destinoSelect.value,
      };
  
      let result;
      try {
        result = await convertidorFetch(data);
      } catch (error) {
        console.error("Error al convertir los datos:", error);
      }
  
      if (!result || result === undefined) {
        console.warn("La conversión no devolvió resultados válidos.");
        if (editedInput === cantidadInput) {
          cantidad2Input.placeholder = "Conversión fallida";
        } else if (editedInput === cantidad2Input) {
          cantidadInput.placeholder = "Conversión fallida";
        }
        return;
      }
  
      if (editedInput === cantidadInput) {
        cantidad2Input.value = "";
        cantidad2Input.placeholder = result;
      } else if (editedInput === cantidad2Input) {
        cantidadInput.value = "";
        cantidadInput.placeholder = result;
      }
    

    }
  };
  
  
  
  const listenChanges = () => {
    const cantidadInput = document.getElementById("cantidad");
    const cantidad2Input = document.getElementById("cantidad2");
    cantidadInput.addEventListener("input", () => debounce(() => updateData(cantidadInput), 500));
    cantidad2Input.addEventListener("input", () => debounce(() => updateData(cantidad2Input), 500));
  
    const origenSelect = document.getElementById("origen");
    const destinoSelect = document.getElementById("destino");
  
    origenSelect.addEventListener("change", () => debounce(() => updateData(cantidadInput), 500));
    destinoSelect.addEventListener("change", () => debounce(() => updateData(cantidadInput), 500));
  };
  
  listenChanges();
  
  const origenSelect = document.getElementById("origen");
  const destinoSelect = document.getElementById("destino");
  
  function updateDestinoOptions() {
    const origenValue = origenSelect.value;
  
    Array.from(destinoSelect.options).forEach((option) => {
      option.style.display = "block";
  
      if (option.value === origenValue) {
        option.style.display = "none";
      }
    });
  
    if (origenValue === destinoSelect.value) {
      for (const option of destinoSelect.options) {
        if (option.style.display !== "none") {
          destinoSelect.value = option.value;
          break;
        }
      }
    }
  }
  
  origenSelect.addEventListener("change", () => {
    updateDestinoOptions();
  });
  
  destinoSelect.addEventListener("change", () => {
    updateDestinoOptions();
  });
  
  updateDestinoOptions();
  
  const updateConversionInfo = (origen, destino) => {
    const conversionText = document.getElementById("conversion-text");
    const conversionAmount = document.getElementById("conversion-amount");
  
    // Define conversion rates (estáticos) para cada combinación origen/destino
    const conversionRates = {
        "LempiraHondureño-DólarEstadounidense": { text: "1 Lempira es igual a", amount: "0.041 Dólares estadounidenses" },
        "LempiraHondureño-Euro": { text: "1 Lempira es igual a", amount: "0.038 Euros" },
        "DólarEstadounidense-LempiraHondureño": { text: "1 Dólar estadounidense es igual a", amount: "24.5 Lempiras Hondureños" },
        "DólarEstadounidense-Euro": { text: "1 Dólar estadounidense es igual a", amount: "0.94 Euros" },
        "Euro-LempiraHondureño": { text: "1 Euro es igual a", amount: "26.2 Lempiras Hondureños" },
        "Euro-DólarEstadounidense": { text: "1 Euro es igual a", amount: "1.06 Dólares estadounidenses" },
      };
  
    // Combinación del origen y destino (ej. "USD-HNL", "HNL-USD")
    const conversionKey = `${origen}-${destino}`; 
  
    // Verifica si la combinación existe en los rates
    if (conversionRates[conversionKey]) {
      conversionText.innerHTML = conversionRates[conversionKey].text;
      conversionAmount.innerHTML = conversionRates[conversionKey].amount;
    } else {
      conversionText.innerHTML = "Conversión no disponible.";
      conversionAmount.innerHTML = "";
    }
  };