const pool = require('../data/config');


const router = app => {

    app.get('/', (request, response) => {
        response.send({
            message: 'Node.js and Express REST API'
        });
    });

    // Endpoint para obtener las recetas destacadas
    app.get('/featured', (req, res) => {
        // Consulta SQL para obtener datos
        const sqlQuery = 'SELECT * FROM recipes WHERE isFeatured = 1';

        // Ejecuta la consulta
        pool.query(sqlQuery, (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
                return;
            }

            // Envia los resultados como respuesta JSON
            res.json(results);
        });
    });

    // Endpoint para obtener todas las recetas
    app.get('/recipes', (req, res) => {
        // Consulta SQL para obtener datos
        const sqlQuery = 'SELECT * FROM recipes WHERE isFeatured = 0';

        // Ejecuta la consulta
        pool.query(sqlQuery, (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error al obtener datos de la base de datos' });
                return;
            }

            // Envia los resultados como respuesta JSON
            res.json(results);
        });
    });

    // Endpoint para obtener el detalle de una receta
    app.get('/recipes/:recipeId', (req, res) => {
        //Obtenemos el id de la receta de la request
        var recipeId = req.params.recipeId;
        // Consulta SQL para obtener datos
        const sqlQuery = 'SELECT r.*, i.id_ingredient, i.ingredient, i.order as ingredient_order, ' + 
                's.id_step, s.name as step_name, s.order as step_order, s.instructions as instructions' +
            ' FROM recipes r' +
            ' LEFT JOIN ingredients i ON r.id_recipe = i.id_recipe' +
            ' LEFT JOIN steps s ON r.id_recipe = s.id_recipe' +
            ' WHERE r.id_recipe=' + recipeId +
            ' ORDER BY i.order ASC, s.order ASC';

        // Ejecuta la consulta
        pool.query(sqlQuery, (error, rows) => {

            if (error) {
                res.status(500).json(error);
                return;
            } else if (!rows.length) {
                res.status(404).json({ error: 'Recipe not found' });
                return;
            }

            // Creamos la estructura de datas deseada
            var result = [], recipe = {}, ingredients = {}, steps = {};

            rows.forEach(function (row) {
                if (!(row.id_recipe in recipe)) {
                    recipe[row.id_recipe] = {
                        name: row.name,
                        description: row.description,
                        preparation_time: row.preparation_time,
                        number_of_diners: row.number_of_diners,
                        image: row.image,
                        ingredients: [],
                        steps: []
                    };
                    result.push(recipe[row.id_recipe]);
                }
                if (row.id_ingredient != null && !(row.id_ingredient in ingredients)) {
                    ingredients[row.id_ingredient] = {
                        id_ingredient: row.id_ingredient,
                        ingredient: row.ingredient,
                        order: row.ingredient_order
                    }
                    recipe[row.id_recipe].ingredients.push(ingredients[row.id_ingredient]);
                }
                if (row.id_step != null && !(row.id_step in steps)) {
                    steps[row.id_step] = {
                        id_step: row.id_step,
                        name: row.step_name,
                        order: row.step_order,
                        instructions: row.instructions
                    }
                    recipe[row.id_recipe].steps.push(steps[row.id_step]);
                }
            });

            // Envia los resultados como respuesta JSON
            res.json(result[0]);
        });
    });

}

module.exports = router;