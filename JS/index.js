document.addEventListener('DOMContentLoaded', async function () {

  const { google } = window; // No necesitas importar 'googleapis' ni 'url' en un navegador web
  const { Translate } = window['@google-cloud/translate'].v2;

  // Autenticación e inicialización de API de Google Docs

  const docs = google.docs({ version: 'v1', auth });

  // Obtener los elementos HTML
  const docURLInput = document.getElementById('docURL');
  const resultDiv = document.getElementById('result');

  // Función para obtener el contenido del documento de Google Docs
  async function getGoogleDocContent(docUrl) {
      const parsedUrl = new URL(docUrl);
      const pathSegments = parsedUrl.pathname.split('/');
      const docId = pathSegments[pathSegments.length - 1];
      
      try {
          const res = await docs.documents.get({ documentId: docId });
          const content = res.data.body.content;

          // Concatenar el texto del contenido
          let text = '';
          content.forEach(element => {
              if (element.paragraph) {
                  element.paragraph.elements.forEach(el => {
                      if (el.textRun) {
                          text += el.textRun.content;
                      }
                  });
              }
          });

          return text;
      } catch (error) {
          console.error('Error al obtener el contenido del documento:', error);
          throw error;
      }
  }

  // Función para detectar si el texto está en inglés
  async function detectEnglishText(text) {
      const translate = new Translate();

      try {
          const [detections] = await translate.detect(text);
          return detections.language === 'en';
      } catch (error) {
          console.error('Error al detectar el idioma:', error);
          throw error;
      }
  }

  // Función principal para verificar el documento
  async function checkDocument() {
      const docUrl = docURLInput.value;
      if (!docUrl) {
          resultDiv.textContent = 'Por favor, introduce la URL del documento.';
          return;
      }

      try {
          const content = await getGoogleDocContent(docUrl);
          const hasEnglishText = await detectEnglishText(content);

          if (hasEnglishText) {
              resultDiv.textContent = '¡Alerta! Se ha detectado texto en inglés que necesita corrección.';
          } else {
              resultDiv.textContent = 'El documento está completamente en español.';
          }
      } catch (error) {
          console.error('Error al verificar el documento:', error);
          resultDiv.textContent = 'Error al verificar el documento.';
      }
  }

  // Manejar el evento del botón
  const checkButton = document.getElementById('checkButton');
  checkButton.addEventListener('click', checkDocument);

});
