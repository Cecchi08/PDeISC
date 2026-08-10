interface TarjetaProps {
  nombre: string;
  apellido: string;
  profesion: string;
  imagen: string;
}

function Tarjeta({ nombre, apellido, profesion, imagen }: TarjetaProps) {
  // Renderiza la tarjeta de presentación utilizando los props recibidos
  return (
    <div className="card">
      <div className="card-left">
        {/* Imagen de perfil pasada por props */}
        <img className="card-avatar" src={imagen} alt={`${nombre} ${apellido}`} />
      </div>
      
      <div className="card-right">
        {/* Información personal y profesional */}
        <h2 className="card-name">{nombre} <span>{apellido}</span></h2>
        <p className="card-profession">{profesion}</p>
        <div className="card-divider"></div>
        
        {/* Sección de datos de contacto */}
        <div className="card-info">
          <div className="card-info-item">
            <span className="icon">📧</span>
            <span>{nombre.toLowerCase()}.{apellido.toLowerCase()}@email.com</span>
          </div>
          <div className="card-info-item">
            <span className="icon">📍</span>
            <span>Buenos Aires, Argentina</span>
          </div>
 
        </div>
      </div>
    </div>
  );
}

export default Tarjeta;
