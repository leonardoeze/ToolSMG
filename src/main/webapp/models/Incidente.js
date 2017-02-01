
/*function Incidente(generadoPor,fecha,estado,prioridad,detalle,numeroCaso){

          this.generadoPor = generadoPor;
          this.fecha = fecha;
          this.antiguedad;
          this.fecha_ciere;
          this.estado = estado;
          this.prioridad = prioridad;
          this.detalle = detalle;
          this.numeroCaso = numeroCaso;
      }*/
function Incidente(numero,antiguedad,fecha_registro,recurrente,prioridad,modulo,estado,fecha_cierre,responsable,problema,descripcion,generadoPor){
  this.numero = numero;
  this.antiguedad = antiguedad;
  this.fecha_registro = fecha_registro;
  this.recurrente = recurrente;
  this.prioridad = prioridad;
  this.modulo = modulo;
  this.estado = estado;
  this.fecha_cierre = fecha_cierre
  this.generadoPor = generadoPor;
  this.responsable = responsable;
  this.problema = problema;
  this.descripcion = descripcion;
  this.generadoPor = generadoPor;

}
