/*  
    Esta función construye una query para insertar los valores especificados en el argumento data a 
    la tabla especificada en el argumento table. La columa se ignora si el valor recibido está vacio o
    es igual a undefined o a null. La función retorna un string con la query construida.

    Esta función tiene los siguientes parámetros:
    - table: Nombre de la tabla
    - data: {
        nombre_de_columna: valor
    }
*/

module.exports = (table, data) => {
    let query = `INSERT INTO ${table} `;
    let columns = "(";
    let insertValues = " VALUES (";

    let columnNames = Object.keys(data);
    let elements = Object.values(data);

    for (let i = 0; i < columnNames.length; i++) {
        let currentElement = elements[i];
        columns += `${columnNames[i]}`;
        if(typeof(currentElement) == "number"){
            insertValues += `${currentElement}`;
        } else if(typeof(currentElement) == "string" && currentElement != ''){
            insertValues += `'${currentElement}'`;
        } else {
            insertValues += `NULL`;
        }
        
        if(i != columnNames.length - 1){
            columns += ", ";
            insertValues += ", ";
        } else {
            columns += ") ";
            insertValues += ");";
        }
    }
    
    query = query + columns + insertValues;

    return query;
}