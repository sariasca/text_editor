import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
//CSS
import './ExportPDFButton.css';

const ExportPDFButton = ({ editor }) => {
  // Estados para controlar:
  const [loading, setLoading] = useState(false); // Si se está generando el PDF
  const [fileName, setFileName] = useState("");  // Nombre personalizado del archivo
  const [showInput, setShowInput] = useState(false); // Mostrar/ocultar el input de nombre

  // Función que maneja el flujo completo de exportación
  const handleExport = () => {
    // Si no se ingresó nombre, usa "Documento_PDF_generado" por defecto
    if (!fileName.trim()) {
      exportToPDF("Documento_PDF_generado");
      return;
    }
    exportToPDF(fileName);
  };

  // Función principal que genera el PDF
  const exportToPDF = async (finalFileName) => {
    if (!editor) return; // Si no hay editor, no hace nada

    setLoading(true);
    let tempDiv; // Div temporal para renderizar el contenido

    try {
      // 1. Obtener HTML del editor
      const html = editor.getHTML();

      // 2. Crear contenedor temporal oculto
      tempDiv = document.createElement("div");
      tempDiv.id = "temp-export-div";
      tempDiv.style.width = "800px";       // Ancho fijo para mejor renderizado
      tempDiv.style.padding = "20px";     // Espaciado interno
      tempDiv.style.background = "white"; // Fondo blanco para el PDF
      tempDiv.style.position = "absolute"; // Posición fuera del flujo normal
      tempDiv.style.left = "-9999px";      // Oculta el div fuera de pantalla
      tempDiv.innerHTML = html;            // Inserta el HTML del editor
      document.body.appendChild(tempDiv);  // Añade al DOM

      // 3. Esperar a que todas las imágenes se carguen
      const images = tempDiv.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve(); // Si ya está cargada, continúa
          return new Promise((resolve) => {
            img.onload = resolve;  // Resuelve cuando la imagen cargue
            img.onerror = resolve; // Resuelve incluso si hay error (evita bloqueo)
          });
        })
      );

      // 4. Convertir el HTML a imagen usando html2canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,       // Renderizado a mayor resolución
        useCORS: true,  // Permite cargar imágenes externas (CORS)
      });

      // 5. Crear PDF con jsPDF
      const pdf = new jsPDF("p", "mm", "a4"); // Vertical, milímetros, tamaño A4
      const imgData = canvas.toDataURL("image/png"); // Convierte canvas a base64
      const pdfWidth = pdf.internal.pageSize.getWidth(); // Ancho del PDF
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Alto proporcional

      // Añade la imagen al PDF (formato PNG)
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      // 6. Descargar el PDF con el nombre elegido
      pdf.save(`${finalFileName}.pdf`);

    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al generar el PDF. Revisa la consola para más detalles.");
    } finally {
      // 7. Limpieza: eliminar el div temporal y resetear estados
      if (tempDiv?.parentNode) document.body.removeChild(tempDiv);
      setLoading(false);
      setShowInput(false); // Oculta el input después de exportar
    }
  };

  // Renderizado del componente
  return (
    <div className={`export-pdf-container ${showInput ? "show" : ""}`}>
      {showInput ? (
        <>
          {/* Botón de volver atrás */}
          <button
            className="back-button"
            onClick={() => setShowInput(false)}
            title="Cancelar"
          >
            ←
          </button>

          {/* Input para el nombre */}
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Nombre del archivo"
            className="filename-input"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleExport()}
          />

          {/* Botón OK */}
          <button
            onClick={handleExport}
            className="confirm-button"
          >
            OK
          </button>
        </>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          disabled={loading}
          className={`btnGuardar ${loading ? "disabled" : ""}`}
        >
          {loading ? "Generando..." : "Exportar a PDF"}
        </button>
      )}
    </div>
  );
};

export default ExportPDFButton;