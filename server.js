const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sendEmail = require("./utils/sendEmail");
const routes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use(cors());

// Route
app.get("/", routes);

app.post("/api/sendemail", async (req, res) => {
  const { comment, name, pas, document, moneda, poligonosData } = req.body;

  //const emails = ["ighione@norden.com.ar", "matiasbllzz@gmail.com"];

  try {
    const send_to = "matiasbllzz@gmail.com"; //emails; //"ighione@norden.com.ar";
    const sent_from = process.env.EMAIL_USER;
    const subject = "Pedido de cotización";
    const message = `
            <h2>Datos del solicitante</h2>
            <h4>Nombre: ${name}</h4>
            <h4>DNI o CUIT: ${document}</h4>
            <h4>PAS: ${pas}</h4>
            <h4>Comentario adicional: ${comment}</h4>
            <h4>Cotización solicitada en: ${moneda}</h4>
            <div>
              ${poligonosData
                .map(
                  (poligono) => `
                  <div key=${poligono.id}>
                      <h4 className="info-hectarea">Lote ${poligono.id}</h4>
                      <div className="info-container">
                          <div className="info-form">
                              <p className="info-parrafo">Cultivo: ${
                                poligono.cultivo
                              }</p>
                              <p className="info-parrafo">Valor del Lote: ${
                                poligono.price
                              }</p>
                              <p className="info-parrafo">Área: ${
                                poligono.formattedArea
                              }</p>                      
                              <div>
                                  ${poligono.latLngs
                                    .map(
                                      (coord, index) => `
                                      <p pkey=${index}>
                                          Punto ${
                                            index + 1
                                          }: ${coord.lat.toFixed(
                                        6
                                      )},${coord.lng.toFixed(6)}
                                      </p>
                                  `
                                    )
                                    .join("")}
                              </div>
                              <p className="info-parrafo">Mensaje: ${
                                poligono.message
                              }</p>
                          </div>
                      </div>
                  </div>
              `
                )
                .join("")}
            </div>`;

    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Email enviado" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
