/*  
    Esta función construye una query para insertar los valores especificados en el argumento data a 
    la tabla especificada en el argumento table. La función retorna un string con la query construida.

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
        
        if(typeof(currentElement) == "number"){
            if(i != columnNames.length - 1){
                columns += `${columnNames[i]}, `;
                insertValues += `${currentElement}, `;
            } else {
                columns += `${columnNames[i]})`;
                insertValues += `${currentElement});`;
            }
        } else if(typeof(currentElement) == "string"){
            if(i != columnNames.length - 1){
                columns += `${columnNames[i]}, `;
                insertValues += `'${currentElement}', `;
            } else {
                columns += `${columnNames[i]})`;
                insertValues += `'${currentElement}');`;
            }
        }
    }

    query = query + columns + insertValues;

    return query;
}