const recipesData = [
  {
    title: "Paella Vegetariana",
    description: "Una deliciosa paella cargada de verduras frescas.",
    preparationTime: 45,
    servingCount: 4,
    ingredients: "Arroz|Pimientos|Guisantes|Alcachofas|Azafrán",
    steps: "Sofreír verduras|Añadir arroz y caldo|Cocinar 20 mins",
    calories: 350,
    totalFats: 10.0,
    proteins: 8.0,
    image:
      "https://s3.abcstatics.com/media/gurmesevilla/2012/01/comida-rapida-casera.jpg",
    tags: ["VEGAN", "ANTI_INFLAMMATORY"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 1,
  },
  {
    title: "Tacos Veganos de Jackfruit",
    description: "Tacos veganos con jackfruit como carne.",
    preparationTime: 30,
    servingCount: 2,
    ingredients: "Jackfruit|Tortillas de maíz|Cilantro|Lima|Aguacate",
    steps: "Desmenuzar jackfruit|Cocinar con especias|Servir en tortillas",
    calories: 250,
    totalFats: 5.0,
    proteins: 6.0,
    image: "https://static-cse.canva.com/blob/598703/Fotografiadecomida.jpg",
    tags: ["VEGAN", "GLUTEN_FREE"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Café de Cebada con Especias",
    description: "Café de cebada aromatizado con especias.",
    preparationTime: 15,
    servingCount: 1,
    ingredients: "Cebada molida|Canela|Clavo|Cardamomo|Agua",
    steps: "Mezclar ingredientes|Hervir 10 mins|Colar y servir",
    calories: 50,
    totalFats: 0.5,
    proteins: 1.5,
    image:
      "https://www.recetasnestle.com.ar/sites/default/files/2022-06/ingredientes-comida-de-mar-parrilla.jpg",
    tags: ["IMMUNE_SYSTEM", "ANTI_INFLAMMATORY"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Ensalada Mediterránea con Quinoa",
    description: "Fresca ensalada mediterránea con quinoa.",
    preparationTime: 25,
    servingCount: 3,
    ingredients: "Quinoa|Tomates cherry|Pepino|Aceitunas|Queso feta",
    steps: "Cocer quinoa|Mezclar con verduras|Aderezar al gusto",
    calories: 320,
    totalFats: 12.0,
    proteins: 10.0,
    image:
      "https://www.elmueble.com/medio/2023/05/23/tacos_fcb4f631_00541381_230523124558_1500x2032.jpg",
    tags: ["LOW_CARB", "BAJA_SODIO"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Bowl de Açaí y Frutas",
    description: "Energético bowl de açaí con frutas variadas.",
    preparationTime: 10,
    servingCount: 1,
    ingredients: "Pulpa de açaí|Plátano|Fresas|Miel|Granola",
    steps:
      "Mezclar açaí con plátano|Agregar frutas y granola|Endulzar con miel",
    calories: 280,
    totalFats: 4.0,
    proteins: 5.0,
    image:
      "https://cdn.aarp.net/content/dam/aarp/health/caregiving/2018/03/1140-nutrients-food-loved-ones-caregiving-esp.jpg",
    tags: ["VEGAN", "GLUTEN_FREE"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 1,
  },
  {
    title: "Helado de Aguacate y Coco",
    description: "Fresco y cremoso, ideal para verano.",
    preparationTime: 30,
    servingCount: 2,
    ingredients: "Aguacate|Coco rallado|Leche de coco|Miel|Lima",
    steps: "Mezclar ingredientes|Congelar 4 horas|Servir",
    calories: 220,
    totalFats: 14.0,
    proteins: 2.0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkGTV9ptpoJ1nv8SE8QJ_A4-pCjnd46axWiA&usqp=CAU",
    tags: ["GLUTEN_FREE", "INTESTINAL_FLORA"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Sopa de Maní Tradicional",
    description: "Sabor intenso y reconfortante, un clásico.",
    preparationTime: 60,
    servingCount: 4,
    ingredients: "Maní|Zanahoria|Apio|Cebolla|Ajo|Pollo",
    steps: "Sofreír vegetales|Añadir caldo y maní|Cocinar 1 hora",
    calories: 300,
    totalFats: 15.0,
    proteins: 10.0,
    image:
      "https://www.laylita.com/recetas/wp-content/uploads/2023/08/Receta-de-la-sopa-de-mani.jpg",
    tags: ["VEGETARIAN", "RAPID_PREPARATION"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Carne Asada con Chimichurri",
    description: "Perfecta combinación de sabores, ideal para parrilladas.",
    preparationTime: 90,
    servingCount: 4,
    ingredients: "Carne|Perejil|Ajo|Aceite de oliva|Vinagre",
    steps: "Asar la carne|Preparar chimichurri|Servir juntos",
    calories: 500,
    totalFats: 30.0,
    proteins: 25.0,
    image:
      "https://img.freepik.com/foto-gratis/primer-plano-carne-asada-salsa-verduras-patatas-fritas-plato-sobre-mesa_181624-35847.jpg",
    tags: ["VEGAN", "GLUTEN_FREE"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Gazpacho Andaluz Refrescante",
    description: "Frescura y sabor en cada sorbo, ideal para el calor.",
    preparationTime: 20,
    servingCount: 4,
    ingredients: "Tomate|Pimiento|Pepino|Ajo|Vinagre|Aceite de oliva",
    steps: "Picar ingredientes|Mezclar y licuar|Refrigerar antes de servir",
    calories: 120,
    totalFats: 5.0,
    proteins: 2.0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_wulETjl6TbYZ3Z4M088Gn3BDvEPhVmYiTQ&usqp=CAU",
    tags: ["IMMUNE_SYSTEM", "INTESTINAL_FLORA"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Curry Vegano de Lentejas",
    description: "Aromático, nutritivo y lleno de sabor.",
    preparationTime: 45,
    servingCount: 4,
    ingredients: "Lentejas|Leche de coco|Curry|Tomate|Cebolla|Ajo",
    steps:
      "Saltear cebolla y ajo|Añadir lentejas y curry|Cocinar hasta espesar",
    calories: 350,
    totalFats: 9.0,
    proteins: 18.0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4FR8wrs9_0hB3XpxnrggBXRjt1D6F2cLOqQ&usqp=CAU",
    tags: ["VEGAN", "LOW_CALORIES"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Tortilla Española Clásica",
    description: "Una tortilla sencilla y deliciosa.",
    preparationTime: 30,
    servingCount: 4,
    ingredients: "Huevos|Patatas|Cebolla|Aceite|Sal",
    steps:
      "Cortar patatas y cebolla|Freír patatas y cebolla|Batir huevos y mezclar|Cocinar en sartén",
    calories: 250,
    totalFats: 15.0,
    proteins: 12.0,
    image:
      "https://www.recetasnestle.com.co/sites/default/files/inline-images/comidas-fritas-plato-apanado-ensalada.jpg",
    tags: ["BAJA_SODIO", "VEGETARIAN"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Empanadas de Carne Cortada a Cuchillo",
    description: "Empanadas jugosas con carne cortada.",
    preparationTime: 60,
    servingCount: 6,
    ingredients: "Carne|Cebolla|Huevo|Masa para empanada|Aceitunas",
    steps:
      "Cortar carne y cebolla|Cocinar relleno|Armar empanadas|Hornear 20 mins",
    calories: 300,
    totalFats: 12.0,
    proteins: 15.0,
    image:
      "https://www.gastronomiaycia.com/wp-content/uploads/2021/01/elplatoharvard_2-680x448.jpg",
    tags: ["RAPID_PREPARATION", "VEGAN"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Ceviche Peruano de Pescado",
    description: "Fresco ceviche con toque cítrico.",
    preparationTime: 20,
    servingCount: 4,
    ingredients: "Pescado|Limón|Cebolla morada|Cilantro|Ají",
    steps:
      "Cortar pescado|Exprimir limón|Mezclar ingredientes|Refrigerar 2 horas",
    calories: 180,
    totalFats: 5.0,
    proteins: 22.0,
    image:
      "https://img.europapress.es/fotoweb/fotonoticia_20180117114451_1200.jpg",
    tags: ["GLUTEN_FREE", "IMMUNE_SYSTEM"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Pollo al Horno con Hierbas",
    description: "Pollo aromático con hierbas al horno.",
    preparationTime: 90,
    servingCount: 4,
    ingredients: "Pollo|Romero|Tomillo|Ajo|Limón",
    steps: "Preparar adobo|Marinar pollo|Hornear a 180°C|Servir caliente",
    calories: 220,
    totalFats: 9.0,
    proteins: 26.0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrgUcf2pA82UbEWGZy53h2SblBfjuh7HbSidmopFmeV8vxEGZmZWSJZ1YmcxNZN_Hdz9M&usqp=CAU",
    tags: ["INTESTINAL_FLORA", "ANTI_INFLAMMATORY"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Risotto de Setas Silvestres",
    description: "Risotto cremoso con setas.",
    preparationTime: 45,
    servingCount: 4,
    ingredients:
      "Arroz arborio|Setas|Caldo de verduras|Queso parmesano|Vino blanco",
    steps:
      "Sofreír setas|Añadir arroz|Incorporar caldo gradualmente|Agregar queso",
    calories: 310,
    totalFats: 8.0,
    proteins: 9.0,
    image:
      "https://www.cocinacaserayfacil.net/wp-content/uploads/2020/04/Recetas-de-comidas-para-ni%C3%B1os.jpg",
    tags: ["LOW_CARB", "HIGH_FIBER"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Crema de Calabaza y Zanahoria",
    description: "Sopa cremosa y reconfortante.",
    preparationTime: 30,
    servingCount: 4,
    ingredients: "Calabaza|Zanahoria|Cebolla|Ajo|Caldo vegetal|Sal|Pimienta",
    steps:
      "Saltear verduras|Agregar caldo y hervir|Triturar hasta cremar|Sazonar al gusto",
    calories: 150,
    totalFats: 3.5,
    proteins: 2.5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTm7KZl79yp8Hh8WOP8aRcoTYzaf3_xpXxEA&usqp=CAU",
    tags: ["VEGETARIAN", "RAPID_PREPARATION"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Chiles en Nogada Estilo Gourmet",
    description: "Plato mexicano festivo y elegante.",
    preparationTime: 90,
    servingCount: 4,
    ingredients:
      "Chiles poblanos|Relleno de carne|Frutas|Nogada|Granada|Perejil",
    steps:
      "Asar chiles|Preparar relleno|Llenar chiles|Cubrir con nogada|Adornar con granada y perejil",
    calories: 650,
    totalFats: 47.0,
    proteins: 29.0,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLWNBIqTtuhQjtMtQZ0JZYECLVb0f4JokSg&usqp=CAU",
    tags: ["RAPID_PREPARATION", "LOW_CARB"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Bacalao a la Vizcaína Tradicional",
    description: "Delicia navideña de bacalao.",
    preparationTime: 60,
    servingCount: 6,
    ingredients: "Bacalao|Tomate|Pimientos|Ajo|Aceite de oliva|Sal",
    steps:
      "Desalar bacalao|Sofreír ajo y pimientos|Añadir tomate y bacalao|Cocer a fuego lento",
    calories: 320,
    totalFats: 14.0,
    proteins: 38.0,
    image:
      "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGxhdG8lMjBkZSUyMGNvbWlkYXxlbnwwfHwwfHx8MA%3D%3D",
    tags: ["RAPID_PREPARATION", "GLUTEN_FREE"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Salpicón de Marisco Fresco",
    description: "Ensalada marina ligera y fresca.",
    preparationTime: 20,
    servingCount: 4,
    ingredients:
      "Mariscos variados|Pimiento|Cebolla|Vinagre|Aceite de oliva|Sal",
    steps:
      "Cocer mariscos|Picar verduras|Mezclar con vinagreta|Refrigerar antes de servir",
    calories: 200,
    totalFats: 5.0,
    proteins: 25.0,
    image:
      "https://cdn.pixabay.com/photo/2018/05/21/22/52/gourmet-food-3419926_1280.jpg",
    tags: ["LOW_CARB", "LOW_SODIUM"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
  {
    title: "Tarta de Santiago Almendrada",
    description: "Dulce tradicional con almendras.",
    preparationTime: 50,
    servingCount: 8,
    ingredients: "Almendras molidas|Azúcar|Huevos|Canela|Ralladura de limón",
    steps:
      "Mezclar ingredientes|Verter en molde|Hornear hasta dorar|Espolvorear con azúcar glass",
    calories: 450,
    totalFats: 27.0,
    proteins: 12.0,
    image:
      "https://aprende.com/wp-content/uploads/2021/12/clases-online-de-chef.jpg",
    tags: ["ANTI_INFLAMMATORY", "RAPID_PREPARATION"],
    video:
      "https://www.youtube.com/watch?v=zfdzfDGc-1k&ab_channel=PaulinaCocina",
    userId: 2,
  },
];

module.exports = { recipesData };
