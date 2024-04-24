function checkAndTranslate() {
    function checkAndTranslate() {
        // Obtener el valor del URL del documento de Google Docs desde el campo de entrada
        let translatedDocUrl = document.getElementById("docURL").value;
    
        // Verificar si el campo de entrada está vacío
        if (!translatedDocUrl) {
            alert('Por favor, ingresa la URL del documento traducido.');
            return;
        }
    
        // Realizar una solicitud para obtener el contenido del documento de Google Docs
        fetch(translatedDocUrl)
            .then(response => response.text())
            .then(data => {
                // Convertir el texto del documento a minúsculas para la comparación
                let translatedText = data.toLowerCase();
    
                // Detectar si hay texto en inglés en el documento traducido
                let containsEnglish = detectLanguage(translatedText) === 'english';
    
                // Mostrar el mensaje correspondiente según la detección
                if (containsEnglish) {
                    alert('Hay texto en inglés en el documento traducido.');
                } else {
                    alert('Todo el documento está en español en el documento traducido.');
                }
            })
            .catch(error => {
                console.error('Error al obtener el contenido del documento:', error);
            });
    }
    
    // Función para detectar el idioma
    function detectLanguage(text) {
        // Implementa tu lógica para detectar el idioma aquí
        // Este es solo un ejemplo básico
        if (text.includes('english')) {
            return 'english';
        } else {
            return 'spanish';
        }
    }
}